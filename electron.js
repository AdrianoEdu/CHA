console.log("ELECTRON MAIN RODANDO");

const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const waitOn = require("wait-on");
const path = require("path");

let backendProcess;
let mainWindow;

// 🚫 impede múltiplas instâncias do app
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

// 🔁 se tentar abrir outra instância, foca na atual
app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000");
}

function startBackend() {
  // 🧠 evita subir múltiplas vezes
  if (backendProcess) {
    console.log("⚠️ Backend já está rodando, ignorando...");
    return;
  }

  console.log("🚀 Iniciando backend (start.js)...");

  backendProcess = spawn(process.execPath, [path.join(__dirname, "start.js")], {
    stdio: "inherit",
  });

  backendProcess.on("error", (err) => {
    console.error("❌ Erro ao iniciar backend:", err);
  });

  backendProcess.on("exit", (code) => {
    console.log("🛑 Backend finalizado:", code);
    backendProcess = null;
  });
}

app.whenReady().then(async () => {
  startBackend();

  console.log("⏳ aguardando aplicação subir...");

  try {
    await waitOn({
      resources: ["http://localhost:3000"],
      timeout: 60000,
      interval: 1000,
    });

    console.log("✅ Aplicação pronta!");
    createWindow();
  } catch (err) {
    console.error("❌ Timeout esperando app:", err);
    app.quit();
  }
});

// 🧹 cleanup TOTAL (isso evita zumbi comendo RAM)
app.on("before-quit", () => {
  if (backendProcess) {
    backendProcess.kill("SIGKILL");
    backendProcess = null;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
