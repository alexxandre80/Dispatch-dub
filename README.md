# Dispatch Dub

Application Electron pour télécharger et remplacer des fichiers depuis un repository Git selon la langue sélectionnée.

## 🚀 Fonctionnalités

- **Sélection de langue** : Choisissez parmi plusieurs langues disponibles
- **Téléchargement Git** : Clone automatiquement le repository Git spécifié
- **Remplacement de fichiers** : Remplace les fichiers dans le chemin de destination avec ceux du dossier de langue sélectionné
- **Interface moderne** : Interface utilisateur élégante et intuitive

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn
- Git installé sur votre système

## 🔧 Installation

1. Clonez ou téléchargez ce repository
2. Installez les dépendances :

```bash
npm install
```

## ▶️ Utilisation

1. Lancez l'application :

```bash
npm start
```

Pour le mode développement (avec DevTools) :

```bash
npm run dev
```

2. Dans l'interface :
   - Le repository Git est pré-configuré : `https://github.com/alexxandre80/Dispatch-dub`
   - Sélectionnez la langue souhaitée
   - Cliquez sur "Parcourir" pour sélectionner le dossier de destination
   - Cliquez sur "Synchroniser les fichiers"

## 📁 Structure du Repository Git

Le repository Git utilisé est : [https://github.com/alexxandre80/Dispatch-dub](https://github.com/alexxandre80/Dispatch-dub)

Il doit avoir la structure suivante :

```
Dispatch-dub/
├── fr/          # Fichiers français
├── en/          # Fichiers anglais
├── es/          # Fichiers espagnols
└── ...
```

L'application téléchargera les fichiers du dossier correspondant à la langue sélectionnée et les copiera dans le chemin de destination.

## ⚠️ Notes importantes

- Les fichiers existants dans le dossier de destination seront **remplacés** par ceux du repository
- L'application clone le repository dans un dossier temporaire qui est supprimé après la synchronisation
- Assurez-vous d'avoir les permissions nécessaires pour écrire dans le dossier de destination

## 🛠️ Technologies utilisées

- **Electron** : Framework pour créer des applications desktop
- **simple-git** : Bibliothèque pour interagir avec Git
- **Node.js** : Runtime JavaScript

## 📝 Licence

MIT
