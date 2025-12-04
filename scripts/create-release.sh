#!/bin/bash

# Script pour créer une release GitHub avec les fichiers de build

VERSION=$(node -p "require('./package.json').version")
TAG="v${VERSION}"

echo "🚀 Création de la release ${TAG}..."

# Vérifier que les builds existent
if [ ! -d "out/make" ]; then
    echo "❌ Aucun build trouvé. Exécutez 'npm run make' d'abord."
    exit 1
fi

# Créer un tag si il n'existe pas
if ! git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "📌 Création du tag ${TAG}..."
    git tag -a "$TAG" -m "Release ${TAG}"
    git push origin "$TAG"
fi

# Créer la release avec gh CLI (si installé)
if command -v gh &> /dev/null; then
    echo "📦 Création de la release GitHub..."
    gh release create "$TAG" \
        out/make/*.dmg \
        out/make/zip/**/*.zip \
        --title "Release ${TAG}" \
        --notes "Version ${VERSION} de Dispatch Dub
    
## Téléchargements

- **macOS** : Téléchargez le fichier \`.dmg\` ou \`.zip\`
- **Windows** : Téléchargez le fichier \`.exe\` ou \`.zip\`
- **Linux** : Téléchargez le fichier \`.deb\`, \`.rpm\` ou \`.zip\`

## Installation

### macOS
1. Téléchargez le fichier \`.dmg\`
2. Ouvrez-le et glissez l'application dans le dossier Applications
3. Lancez l'application depuis Applications

### Windows
1. Téléchargez le fichier \`.exe\`
2. Exécutez l'installateur et suivez les instructions

### Linux
1. Téléchargez le fichier \`.deb\` (Debian/Ubuntu) ou \`.rpm\` (Red Hat/Fedora)
2. Installez avec votre gestionnaire de paquets"
else
    echo "⚠️  GitHub CLI (gh) n'est pas installé."
    echo "📝 Pour créer la release manuellement :"
    echo "   1. Allez sur https://github.com/alexxandre80/Dispatch-dub/releases/new"
    echo "   2. Sélectionnez le tag ${TAG}"
    echo "   3. Ajoutez les fichiers depuis out/make/"
    echo "   4. Publiez la release"
fi

echo "✅ Terminé !"

