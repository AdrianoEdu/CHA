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

# =========================
# BUILD DAS IMAGENS
# =========================

Write-Host "[INFO] Buildando FRONT..."
docker build -t contabilidade-front .

Write-Host "[INFO] Preparando POSTGRES..."
docker pull postgres:15
docker tag postgres:15 contabilidade-postgres

# =========================
# EXPORTANDO IMAGENS
# =========================

Write-Host "[INFO] Exportando imagens..."
docker save -o "$OUTPUT_DIR\contabilidade-front.tar" contabilidade-front
docker save -o "$OUTPUT_DIR\contabilidade-postgres.tar" contabilidade-postgres

# =========================
# GERANDO DOCKER COMPOSE (PROD)
# =========================

Write-Host "[INFO] Gerando docker-compose de producao..."

$composeProd = @'
version: "3.8"

services:
  postgres:
    image: contabilidade-postgres
    container_name: contabilidade_postgres
    restart: always
    ports:
      - "5432:5432"
    env_file:
      - .env
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
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
# COPIANDO .ENV
# =========================

Write-Host "[INFO] Copiando .env..."
Copy-Item ".env" "$OUTPUT_DIR\" -Force

# =========================
# SCRIPT DO CLIENTE
# =========================

Write-Host "[INFO] Criando script do cliente..."

$clientScript = @'
Write-Host "[INFO] Carregando imagens..."

docker load -i contabilidade-front.tar
docker load -i contabilidade-postgres.tar

Write-Host "[INFO] Subindo containers..."

docker compose up -d --no-build

Write-Host "[OK] Aplicacao rodando em http://localhost:3000"
'@

$clientPath = Join-Path $OUTPUT_DIR "run-build.ps1"
$clientScript | Out-File -FilePath $clientPath -Encoding utf8

# =========================
# FINAL
# =========================

Write-Host "[OK] Entrega pronta em: $OUTPUT_DIR"