#!/usr/bin/env node

/**
 * Script pour ajouter les fichiers de désinstallation au DMG
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dmgPath = process.argv[2] || path.join(__dirname, '../out/make/Dispatch Dub-1.0.0-arm64.dmg');

if (!fs.existsSync(dmgPath)) {
  console.error(`❌ DMG non trouvé : ${dmgPath}`);
  process.exit(1);
}

console.log('📦 Ajout des fichiers de désinstallation au DMG...');

const mountPoint = '/Volumes/Dispatch Dub';
const scriptsDir = path.join(__dirname, '..');

try {
  // Monter le DMG
  console.log(' mount du DMG...');
  execSync(`hdiutil attach "${dmgPath}" -mountpoint "${mountPoint}" -quiet`, { stdio: 'inherit' });

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
  const readmePath = path.join(scriptsDir, 'scripts', 'DMG-README.txt');
  if (fs.existsSync(readmePath)) {
    const targetReadme = path.join(mountPoint, 'LISEZ-MOI.txt');
    fs.copyFileSync(readmePath, targetReadme);
    console.log('✅ Fichier README copié');
  }

  // Démontrer le DMG
  console.log('🔽 Démontage du DMG...');
  execSync(`hdiutil detach "${mountPoint}" -quiet`, { stdio: 'inherit' });

  console.log('✨ Fichiers de désinstallation ajoutés au DMG avec succès !');
} catch (error) {
  console.error('❌ Erreur:', error.message);
  // Essayer de démonter en cas d'erreur
  try {
    execSync(`hdiutil detach "${mountPoint}" -force -quiet`, { stdio: 'ignore' });
  } catch (e) {
    // Ignorer les erreurs de démontage
  }
  process.exit(1);
}

