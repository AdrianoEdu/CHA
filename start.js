const { spawn, execSync } = require("child_process");
const net = require("net");
const fs = require("fs");
const path = require("path");

// 🔒 EVITA DUPLICAÇÃO
if (global.__START_RUNNING__) {
  console.log("⚠️ start.js já está rodando");
  process.exit(0);
}
global.__START_RUNNING__ = true;

const PG_BIN = path.join(__dirname, "db/postgres/bin");
const PG_DATA = path.join(__dirname, "db/postgres/data");

const PRIMARY_PORT = 5432;
const FALLBACK_PORT = 15250;

const PG_USER = "postgres";
const PG_PASSWORD = "";
const PG_DB = "contabilidade";

let nextProcess = null;

// ---------------- utils ----------------

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(800);

    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });

    socket.once("error", () => resolve(false));

    socket.connect(port, "127.0.0.1");
  });
}

// ---------------- port ----------------

async function getAvailablePort() {
  const primaryBusy = await checkPort(PRIMARY_PORT);
  if (!primaryBusy) return PRIMARY_PORT;

  const fallbackBusy = await checkPort(FALLBACK_PORT);
  return fallbackBusy ? FALLBACK_PORT + 1 : FALLBACK_PORT;
}

// ---------------- DATABASE_URL ----------------

function buildDatabaseUrl(port) {
  return `postgresql://${PG_USER}:${PG_PASSWORD}@localhost:${port}/${PG_DB}`;
}

function updateEnv(databaseUrl) {
  const envPath = path.join(__dirname, ".env");

  let env = "";

  if (fs.existsSync(envPath)) {
    env = fs.readFileSync(envPath, "utf8");
    env = env
      .split("\n")
      .filter((l) => !l.startsWith("DATABASE_URL="))
      .join("\n");
  }

  env += `\nDATABASE_URL="${databaseUrl}"\n`;

  fs.writeFileSync(envPath, env.trim() + "\n");
}

// ---------------- postgres ----------------

function startPostgres(port) {
  const pgCtl = path.join(PG_BIN, "pg_ctl.exe");

  return new Promise((resolve, reject) => {
    console.log(`🚀 Iniciando PostgreSQL na porta ${port}...`);

    if (!fs.existsSync(pgCtl)) {
      console.error("❌ PostgreSQL NÃO encontrado:", pgCtl);
      return resolve(); // sai sem quebrar app
    }

    const pg = spawn(pgCtl, [
      "-D",
      PG_DATA,
      "-o",
      `-p ${port}`,
      "-l",
      "pg.log",
      "start",
    ]);

    pg.stdout.on("data", (d) => console.log(d.toString()));
    pg.stderr.on("data", (d) => console.log(d.toString()));

    pg.on("error", (err) => {
      console.error("❌ erro ao iniciar postgres:", err);
      reject(err);
    });

    pg.on("exit", (code) => {
      if (code === 0) {
        console.log("✅ Postgres iniciado com sucesso");
        resolve();
      } else {
        reject(new Error("Postgres falhou ao iniciar"));
      }
    });
  });
}

// ---------------- DB wait ----------------

async function waitDatabase(port) {
  console.log("⏳ aguardando DB...");

  for (let i = 0; i < 20; i++) {
    const ok = await checkPort(port);

    if (ok) {
      console.log("DB respondendo");
      return;
    }

    await wait(1000);
  }

  throw new Error("Falha ao conectar no banco");
}

// ---------------- PRISMA ----------------

function runPrisma() {
  console.log("🧬 Inicializando banco...");

  try {
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      shell: true,
    });
  } catch {
    execSync("npx prisma db push", {
      stdio: "inherit",
      shell: true,
    });
  }
}

function runSeed() {
  console.log("🌱 Rodando seed...");

  try {
    execSync("npx prisma db seed", {
      stdio: "inherit",
      shell: true,
    });
  } catch {
    console.log("seed ignorado");
  }
}

// ---------------- NEXT (🔥 CORREÇÃO REAL) ----------------

function startNext() {
  console.log("🚀 Iniciando Next.js (PROD)...");

  const nextPath = path.join(
    __dirname,
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );

  nextProcess = spawn(process.execPath, [nextPath, "start", "-p", "3000"], {
    stdio: "inherit",
    env: process.env,
  });

  nextProcess.on("error", (err) => {
    console.error("❌ Erro ao iniciar Next:", err);
  });

  nextProcess.on("exit", (code) => {
    console.error("💥 Next morreu com código:", code);
  });

  return nextProcess;
}

// ---------------- main ----------------

async function main() {
  try {
    const port = await getAvailablePort();

    const databaseUrl = buildDatabaseUrl(port);

    console.log("🔌 DATABASE_URL:", databaseUrl);

    process.env.DATABASE_URL = databaseUrl;
    updateEnv(databaseUrl);

    const isUp = await checkPort(port);

    if (!isUp) {
      await startPostgres(port);
      await wait(2000);
    } else {
      console.log("PostgreSQL já rodando");
    }

    await waitDatabase(port);

    console.log("🔌 Banco pronto");

    runPrisma();
    runSeed();

    console.log("🚀 Subindo aplicação...");

    startNext();

    // 🔥 SEGURA PROCESSO VIVO (ESSENCIAL)
    setInterval(() => {}, 1000);
  } catch (err) {
    console.error("erro start:", err);
  }
}

main();
