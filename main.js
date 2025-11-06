const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
let visualizerWindow, joystickWindow;

function createWindows() {
  visualizerWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  joystickWindow = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  visualizerWindow.loadFile("main.html");
  joystickWindow.loadFile("joystick.html");
  visualizerWindow.on("closed", () => {
    app.quit();
  });
  joystickWindow.on("closed", () => {
    app.quit();
  });
}

app.whenReady().then(() => {
  createWindows();

  ipcMain.on("vectorCommand", (event, vec) => {
    //console.log("[main.js] Received vectorCommand:", vec);
    visualizerWindow.webContents.send("vectorCommand", vec);
    //console.log("[main.js] Sent vectorCommand to visualizerWindow:", vec);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindows();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
