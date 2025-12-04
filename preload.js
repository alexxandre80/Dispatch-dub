const { contextBridge, ipcRenderer } = require('electron');

// Exposer les APIs sécurisées au renderer
contextBridge.exposeInMainWorld('electronAPI', {
  selectDestinationFolder: () => ipcRenderer.invoke('select-destination-folder'),
  selectSourceFolder: () => ipcRenderer.invoke('select-source-folder'),
  downloadAndReplaceFiles: (repoUrl, language, destinationPath) => 
    ipcRenderer.invoke('download-and-replace', repoUrl, language, destinationPath)
});

