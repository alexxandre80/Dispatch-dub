const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class UninstallerPlugin {
  constructor() {
    this.name = 'uninstaller-plugin';
  }

  getHooks() {
    return {
      postMake: async (config, makeResults) => {
        // Après la création des distributables
        for (const result of makeResults) {
          if (result.platform === 'darwin' && result.artifacts.length > 0) {
            const dmgPath = result.artifacts.find(artifact => artifact.endsWith('.dmg'));
            if (dmgPath && fs.existsSync(dmgPath)) {
              console.log('📦 Ajout des fichiers de désinstallation au DMG...');
              await this.addUninstallerToDMG(dmgPath);
            }
          }
        }
      }
    };
  }

  async addUninstallerToDMG(dmgPath) {
    const mountPoint = '/Volumes/Dispatch Dub';
    const scriptsDir = path.join(__dirname, 'scripts');
    let mounted = false;

    try {
      // Monter le DMG
      execSync(`hdiutil attach "${dmgPath}" -mountpoint "${mountPoint}" -quiet`, { stdio: 'pipe' });
      mounted = true;

      // Copier le script de désinstallation
      const uninstallScript = path.join(scriptsDir, 'uninstall.sh');
      if (fs.existsSync(uninstallScript)) {
        const targetScript = path.join(mountPoint, 'uninstall.sh');
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
      const uninstallCommandPath = path.join(mountPoint, 'Désinstaller Dispatch Dub.command');
      fs.writeFileSync(uninstallCommandPath, uninstallCommand);
      fs.chmodSync(uninstallCommandPath, '755');
      console.log('✅ Fichier .command créé');

      // Copier le README
      const readmePath = path.join(scriptsDir, 'DMG-README.txt');
      if (fs.existsSync(readmePath)) {
        const targetReadme = path.join(mountPoint, 'LISEZ-MOI.txt');
        fs.copyFileSync(readmePath, targetReadme);
        console.log('✅ Fichier README copié');
      }

      // Démontrer le DMG
      execSync(`hdiutil detach "${mountPoint}" -quiet`, { stdio: 'pipe' });
      mounted = false;

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
    }
  }
}

module.exports = UninstallerPlugin;

