# =========================
# FIX ENCODING
# =========================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# =========================
# CONFIG
# =========================
$OUTPUT_DIR = "build"

Write-Host "[INFO] Limpando pasta antiga..."
Remove-Item -Recurse -Force $OUTPUT_DIR -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $OUTPUT_DIR | Out-Null

docker system prune -a -f

# =========================
# PEGAR IP + GERAR API URL (ANTES DO BUILD)
# =========================

$ip = Get-NetIPAddress -AddressFamily IPv4 |
Where-Object {
    $_.IPAddress -match "^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)" -and
    $_.IPAddress -notlike "127.*" -and
    $_.IPAddress -notlike "169.254.*" -and
    $_.InterfaceAlias -notmatch "vEthernet|WSL|Docker|VirtualBox" -and
    $_.PrefixOrigin -ne "WellKnown"
} |
Select-Object -First 1 -ExpandProperty IPAddress

Write-Host "[DEBUG] IP LAN final: $ip"

# fallback seguro
if ([string]::IsNullOrWhiteSpace($ip)) {
    $apiUrl = "http://localhost:3000/api"
} else {
    $apiUrl = "http://$($ip):3000/api"
}

Write-Host "[INFO] API URL gerada: $apiUrl"

# =========================
# BUILD FRONT (COM API EMBUTIDA)
# =========================

Write-Host "[INFO] Buildando FRONT..."

docker build `
  --build-arg NEXT_PUBLIC_API_URL=$apiUrl `
  -t contabilidade-front .

# =========================
# POSTGRES
# =========================

Write-Host "[INFO] Preparando POSTGRES..."
docker pull postgres:15

# =========================
# EXPORT IMAGEM
# =========================

Write-Host "[INFO] Exportando imagens..."
docker save -o "$OUTPUT_DIR\contabilidade-front.tar" contabilidade-front

# =========================
# COPIAR ARQUIVOS
# =========================

Write-Host "[INFO] Copiando icone..."
Copy-Item "cha.ico" "$OUTPUT_DIR\" -Force

# =========================
# DOCKER COMPOSE PROD
# =========================

Write-Host "[INFO] Gerando docker-compose de producao..."

$composeProd = @'
services:
  postgres:
    image: postgres:15
    container_name: contabilidade_postgres
    restart: always
    ports:
      - "5432:5432"
    env_file:
      - .env
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d contabilidade"]
      interval: 5s
      timeout: 5s
      retries: 10

  front:
    image: contabilidade-front
    container_name: contabilidade_front
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    env_file:
      - .env
    command: sh -c "
      npx prisma@5.22.0 migrate deploy &&
      npx prisma@5.22.0 db seed &&
      node server.js
      "

volumes:
  pgdata:
'@

$composePath = Join-Path $OUTPUT_DIR "docker-compose.yml"
$composeProd | Out-File -FilePath $composePath -Encoding utf8

# =========================
# ENV FINAL (APENAS BACKEND + DB + FALLBACK)
# =========================

Write-Host "[INFO] Gerando .env..."

$envSource = ".env"
$envDest = Join-Path $OUTPUT_DIR ".env"

$envContent = Get-Content $envSource -Raw

# mantém sua lógica, mas evita duplicar API errada
$envContent = $envContent -replace "NEXT_PUBLIC_API_URL=.*", ""

$envContent += "`nNEXT_PUBLIC_API_URL=$apiUrl`n"

$envContent | Out-File -FilePath $envDest -Encoding utf8

# =========================
# SCRIPT CLIENTE
# =========================

Write-Host "[INFO] Criando script do cliente..."

$clientScript = @'
Write-Host "[INFO] Carregando imagens..."

docker load -i contabilidade-front.tar

Write-Host "[INFO] Subindo containers..."

docker compose up -d --no-build

# =========================
# PEGAR IP LOCAL
# =========================

$ip = Get-NetIPAddress -AddressFamily IPv4 |
Where-Object {
    $_.IPAddress -match "^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)" -and
    $_.IPAddress -notlike "127.*" -and
    $_.IPAddress -notlike "169.254.*" -and
    $_.InterfaceAlias -notmatch "vEthernet|WSL|Docker|VirtualBox" -and
    $_.PrefixOrigin -ne "WellKnown"
} |
Select-Object -First 1 -ExpandProperty IPAddress

Write-Host "[DEBUG] IP LAN final: $ip"

if ([string]::IsNullOrWhiteSpace($ip)) {
    $baseUrl = "http://localhost:3000"
} else {
    $baseUrl = "http://$($ip):3000"
}

Write-Host "[INFO] URL gerada: $baseUrl"

# =========================
# ATALHO
# =========================

$desktop = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktop "Contabilidade Web.lnk"

$WScriptShell = New-Object -ComObject WScript.Shell
$shortcut = $WScriptShell.CreateShortcut($shortcutPath)

$shortcut.TargetPath = $baseUrl
$shortcut.IconLocation = (Join-Path (Get-Location) "cha.ico")

$shortcut.Save()

Copy-Item $shortcutPath (Join-Path (Get-Location) "Contabilidade Web.lnk") -Force

Write-Host "[OK] Aplicacao rodando em $baseUrl"
Write-Host "[OK] Atalho criado"
'@

$clientPath = Join-Path $OUTPUT_DIR "run-build.ps1"
$clientScript | Out-File -FilePath $clientPath -Encoding utf8

# =========================
# FINAL
# =========================

Write-Host "[OK] Entrega pronta em: $OUTPUT_DIR"