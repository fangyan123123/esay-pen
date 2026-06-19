const { app, BrowserWindow, globalShortcut, Tray, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let isDrawingMode = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    fullscreen: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('renderer/index.html');
  mainWindow.setIgnoreMouseEvents(false);
  mainWindow.hide();
}

function createTrayIcon() {
  const nativeImage = require('electron').nativeImage;
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  if (!icon.isEmpty()) return icon;

  // 备用：程序化生成一个简单的 16x16 蓝色圆形图标
  const size = 16;
  const buf = Buffer.alloc(size * size * 4, 0);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dist = Math.sqrt((x - 7.5) ** 2 + (y - 7.5) ** 2);
      if (dist <= 7) {
        const i = (y * size + x) * 4;
        buf[i] = 41; buf[i+1] = 98; buf[i+2] = 255; buf[i+3] = 255;
      }
    }
  }
  return nativeImage.createFromBuffer(buf, { width: size, height: size });
}

function createTray() {
  tray = new Tray(createTrayIcon());
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示/隐藏画笔', click: () => toggleDrawingMode() },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() }
  ]);
  tray.setToolTip('easy-pen 屏幕画笔');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => toggleDrawingMode());
}

function toggleDrawingMode() {
  isDrawingMode = !isDrawingMode;
  if (isDrawingMode) {
    mainWindow.show();
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    // 画笔模式开启时注册 Escape
    globalShortcut.register('Escape', () => {
      if (isDrawingMode) toggleDrawingMode();
    });
  } else {
    mainWindow.hide();
    // 画笔模式关闭时释放 Escape
    globalShortcut.unregister('Escape');
  }
  mainWindow.webContents.send('mode-changed', isDrawingMode);
}

app.whenReady().then(() => {
  createWindow();

  try {
    createTray();
  } catch (e) {
    console.warn('托盘创建失败:', e.message);
  }

  // Ctrl+Q 始终注册，作为打开画笔的入口快捷键
  globalShortcut.register('CommandOrControl+Q', () => {
    toggleDrawingMode();
  });
}).catch(err => {
  console.error('应用初始化失败:', err);
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});

ipcMain.on('toggle-mode', () => {
  toggleDrawingMode();
});

ipcMain.on('exit-app', () => {
  app.quit();
});
