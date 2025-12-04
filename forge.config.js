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
  ]
};

