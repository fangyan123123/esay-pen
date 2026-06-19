const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  toggleMode: () => ipcRenderer.send('toggle-mode'),
  exitApp: () => ipcRenderer.send('exit-app'),
  onModeChanged: (callback) => ipcRenderer.on('mode-changed', (event, isDrawing) => callback(isDrawing))
});
