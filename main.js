const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const simpleGit = require('simple-git');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');

  // Ouvrir les DevTools en mode développement
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Gérer la sélection du dossier de destination
ipcMain.handle('select-destination-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Sélectionner le dossier de destination'
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Gérer la sélection du dossier source (optionnel)
ipcMain.handle('select-source-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Sélectionner le dossier source'
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Fonction pour copier récursivement les fichiers
async function copyRecursive(src, dest) {
  const stats = await fs.stat(src);
  
  if (stats.isDirectory()) {
    // Créer le dossier de destination s'il n'existe pas
    await fs.mkdir(dest, { recursive: true });
    
    // Lire le contenu du dossier source
    const entries = await fs.readdir(src);
    
    // Copier chaque entrée
    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      await copyRecursive(srcPath, destPath);
    }
  } else {
    // Copier le fichier
    await fs.copyFile(src, dest);
  }
}

// Gérer le téléchargement et le remplacement des fichiers
ipcMain.handle('download-and-replace', async (event, repoUrl, language, destinationPath) => {
  const tempDir = path.join(os.tmpdir(), 'dispatch-dub-' + Date.now());
  const languageFolder = path.join(tempDir, language);
  
  try {
    // Vérifier que le chemin de destination existe
    try {
      await fs.access(destinationPath);
    } catch {
      throw new Error(`Le chemin de destination n'existe pas : ${destinationPath}`);
    }

    // Cloner le repository dans un dossier temporaire
    console.log('Clonage du repository...');
    const git = simpleGit();
    await git.clone(repoUrl, tempDir);

    // Vérifier que le dossier de langue existe dans le repo
    try {
      await fs.access(languageFolder);
    } catch {
      // Nettoyer le dossier temporaire
      await fs.rm(tempDir, { recursive: true, force: true });
      throw new Error(`Le dossier de langue "${language}" n'existe pas dans le repository`);
    }

    // Copier les fichiers du dossier de langue vers la destination
    console.log(`Copie des fichiers de ${language} vers ${destinationPath}...`);
    await copyRecursive(languageFolder, destinationPath);

    // Nettoyer le dossier temporaire
    console.log('Nettoyage du dossier temporaire...');
    await fs.rm(tempDir, { recursive: true, force: true });

    return { success: true, message: 'Fichiers synchronisés avec succès' };
  } catch (error) {
    // Nettoyer le dossier temporaire en cas d'erreur
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Erreur lors du nettoyage:', cleanupError);
    }
    
    throw error;
  }
});

