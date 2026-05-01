// start.js
// Orquestrador: Postgres local + Next.js + Prisma resiliente

const { spawn, execSync } = require("child_process");
const net = require("net");
const fs = require("fs");

const PG_BIN = "./db/postgres/bin";
const PG_DATA = "./db/postgres/data";

const PRIMARY_PORT = 5432;
const FALLBACK_PORT = 15250;

const PG_USER = "postgres";
const PG_PASSWORD = "";
const PG_DB = "contabilidade";

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
  const envPath = ".env";

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
  return new Promise((resolve, reject) => {
    console.log(`🚀 Iniciando PostgreSQL na porta ${port}...`);

    const pg = spawn(`${PG_BIN}/pg_ctl.exe`, [
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

    pg.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error("Postgres falhou ao iniciar"));
    });
  });
}

// ---------------- DB wait ----------------

async function waitDatabase(port) {
  console.log("⏳ aguardando DB...");

  for (let i = 0; i < 20; i++) {
    const ok = await checkPort(port);

    if (ok) {
      console.log("✅ DB respondendo");
      return;
    }

    await wait(1000);
  }

  throw new Error("Falha ao conectar no banco");
}

// ---------------- PRISMA (ROBUSTO) ----------------

function runPrisma() {
  console.log("🧬 Inicializando banco...");

  try {
    console.log("➡️ tentando migrate deploy...");

    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
    });

    console.log("✅ migrations OK");
  } catch (err) {
    console.log("⚠️ migrate falhou, tentando db push...");

    try {
      execSync("npx prisma db push", {
        stdio: "inherit",
      });

      console.log("✅ db push OK (banco criado)");
    } catch (err2) {
      console.log("❌ falha crítica no Prisma");
      throw err2;
    }
  }
}

function runSeed() {
  console.log("🌱 Rodando seed...");

  try {
    execSync("npx prisma db seed", {
      stdio: "inherit",
    });

    console.log("✅ seed OK");
  } catch {
    console.log("⚠️ seed ignorado");
  }
}

// ---------------- next ----------------

function startNext() {
  console.log("🚀 Iniciando Next.js...");

  const next = spawn("npm", ["run", "start"], {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

  return next;
}

// ---------------- main ----------------

async function main() {
  try {
    const port = await getAvailablePort();

    const databaseUrl = buildDatabaseUrl(port);

    console.log("🔌 DATABASE_URL gerada:", databaseUrl);

    process.env.DATABASE_URL = databaseUrl;
    updateEnv(databaseUrl);

    const isUp = await checkPort(port);

    if (!isUp) {
      await startPostgres(port);
      await wait(2000);
    } else {
      console.log("✅ PostgreSQL já está rodando");
    }

    await waitDatabase(port);

    console.log("🔌 Banco pronto...");

    runPrisma();
    runSeed();

    console.log("🚀 Subindo aplicação...");

    startNext();
  } catch (err) {
    console.error("❌ erro start:", err);
  }
}

main();
