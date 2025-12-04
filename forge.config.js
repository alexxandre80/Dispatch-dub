const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  packagerConfig: {
    name: 'Dispatch Dub',
    executableName: 'dispatch-dub',
    asar: true,
    appBundleId: 'com.dispatchdub.app',
    appCategoryType: 'public.app-category.utilities',
    extendInfo: {
      'CFBundleName': 'Dispatch Dub',
      'CFBundleDisplayName': 'Dispatch Dub',
      'CFBundleIdentifier': 'com.dispatchdub.app',
      'CFBundleVersion': '1.0.0',
      'CFBundleShortVersionString': '1.0.0',
      'CFBundlePackageType': 'APPL',
      'CFBundleSignature': '????',
      'LSMinimumSystemVersion': '10.13.0',
      'NSHumanReadableCopyright': 'Copyright © 2025 Dispatch Dub',
      'LSApplicationCategoryType': 'public.app-category.utilities'
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'dispatch-dub',
        authors: 'Dispatch Dub',
        description: 'Application Electron pour télécharger et remplacer des fichiers depuis un repo Git selon la langue'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Dispatch Dub',
          homepage: 'https://github.com/alexxandre80/Dispatch-dub',
          description: 'Application Electron pour télécharger et remplacer des fichiers depuis un repo Git selon la langue'
        }
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          maintainer: 'Dispatch Dub',
          homepage: 'https://github.com/alexxandre80/Dispatch-dub',
          description: 'Application Electron pour télécharger et remplacer des fichiers depuis un repo Git selon la langue'
        }
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'UDZO'
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    }
  ],
  hooks: {
    postMake: async (config, makeResults) => {
      // Ajouter les fichiers de désinstallation au DMG macOS
      for (const result of makeResults) {
        if (result.platform === 'darwin' && result.artifacts.length > 0) {
          const dmgPath = result.artifacts.find(artifact => artifact.endsWith('.dmg'));
          if (dmgPath && fs.existsSync(dmgPath)) {
            console.log('📦 Ajout des fichiers de désinstallation au DMG...');
            await addUninstallerToDMG(dmgPath);
          }
        }
      }
    }
  }
};

async function addUninstallerToDMG(dmgPath) {
  const mountPoint = '/Volumes/Dispatch Dub';
  const tempDir = path.join(__dirname, 'temp-dmg');
  const scriptsDir = path.join(__dirname, 'scripts');
  let mounted = false;

  try {
    // Créer un dossier temporaire
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });

    // Monter le DMG original
    execSync(`hdiutil attach "${dmgPath}" -mountpoint "${mountPoint}" -quiet`, { stdio: 'pipe' });
    mounted = true;

    // Copier tout le contenu du DMG dans le dossier temporaire
    execSync(`cp -R "${mountPoint}/"* "${tempDir}/"`, { stdio: 'pipe' });
    console.log('✅ Contenu du DMG copié');

    // Démonter le DMG original
    execSync(`hdiutil detach "${mountPoint}" -quiet`, { stdio: 'pipe' });
    mounted = false;

    // Ajouter les fichiers de désinstallation
    const uninstallScript = path.join(scriptsDir, 'uninstall.sh');
    if (fs.existsSync(uninstallScript)) {
      const targetScript = path.join(tempDir, 'uninstall.sh');
      fs.copyFileSync(uninstallScript, targetScript);
      fs.chmodSync(targetScript, '755');
      console.log('✅ Script de désinstallation copié');
    }

    // Créer un fichier .command pour double-clic
    const uninstallCommand = `#!/bin/bash
cd "$(dirname "$0")"
bash uninstall.sh
read -p "Appuyez sur Entrée pour fermer..."
`;
    const uninstallCommandPath = path.join(tempDir, 'Désinstaller Dispatch Dub.command');
    fs.writeFileSync(uninstallCommandPath, uninstallCommand);
    fs.chmodSync(uninstallCommandPath, '755');
    console.log('✅ Fichier .command créé');

    // Copier le README
    const readmePath = path.join(scriptsDir, 'DMG-README.txt');
    if (fs.existsSync(readmePath)) {
      const targetReadme = path.join(tempDir, 'LISEZ-MOI.txt');
      fs.copyFileSync(readmePath, targetReadme);
      console.log('✅ Fichier README copié');
    }

    // Créer un nouveau DMG avec le contenu modifié
    const newDmgPath = dmgPath.replace('.dmg', '-with-uninstaller.dmg');
    const finalDmgPath = dmgPath;
    
    // Supprimer l'ancien DMG
    if (fs.existsSync(finalDmgPath)) {
      fs.unlinkSync(finalDmgPath);
    }

    // Créer le nouveau DMG
    execSync(`hdiutil create -volname "Dispatch Dub" -srcfolder "${tempDir}" -ov -format UDZO "${finalDmgPath}"`, { stdio: 'pipe' });
    console.log('✅ Nouveau DMG créé avec les fichiers de désinstallation');

    // Nettoyer le dossier temporaire
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log('✨ Fichiers de désinstallation ajoutés au DMG avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des fichiers de désinstallation:', error.message);
    // Essayer de démonter en cas d'erreur
    if (mounted) {
      try {
        execSync(`hdiutil detach "${mountPoint}" -force -quiet`, { stdio: 'ignore' });
      } catch (e) {
        // Ignorer les erreurs de démontage
      }
    }
    // Nettoyer le dossier temporaire en cas d'erreur
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

