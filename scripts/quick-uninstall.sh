#!/bin/bash

# Script de désinstallation rapide pour Dispatch Dub

APP_NAME="Dispatch Dub"
APP_PATH="/Applications/${APP_NAME}.app"

echo "🗑️  Désinstallation de ${APP_NAME}..."
echo ""

# Chercher l'application
if [ ! -d "$APP_PATH" ]; then
    echo "⚠️  Application non trouvée dans /Applications/"
    echo ""
    echo "Recherche de l'application..."
    
    # Chercher dans les emplacements courants
    FOUND=$(find ~/Desktop ~/Downloads ~/Documents -name "${APP_NAME}.app" -type d 2>/dev/null | head -1)
    
    if [ -n "$FOUND" ]; then
        echo "✅ Application trouvée : $FOUND"
        read -p "Voulez-vous la supprimer ? (o/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Oo]$ ]]; then
            rm -rf "$FOUND"
            echo "✅ Application supprimée"
        fi
    else
        echo "❌ Application non trouvée. Elle a peut-être déjà été supprimée."
    fi
else
    # Supprimer l'application
    echo "📦 Suppression de l'application..."
    rm -rf "$APP_PATH"
    echo "✅ Application supprimée"
fi

# Supprimer les fichiers de support
echo ""
echo "🧹 Nettoyage des fichiers de support..."

SUPPORT_PATH="$HOME/Library/Application Support/${APP_NAME}"
CACHES_PATH="$HOME/Library/Caches/${APP_NAME}"
PREFERENCES_PATH="$HOME/Library/Preferences/com.dispatchdub.*"
LOG_PATH="$HOME/Library/Logs/${APP_NAME}"

if [ -d "$SUPPORT_PATH" ]; then
    rm -rf "$SUPPORT_PATH"
    echo "✅ Fichiers de support supprimés"
fi

if [ -d "$CACHES_PATH" ]; then
    rm -rf "$CACHES_PATH"
    echo "✅ Caches supprimés"
fi

if ls $PREFERENCES_PATH 1> /dev/null 2>&1; then
    rm -f $PREFERENCES_PATH
    echo "✅ Préférences supprimées"
fi

if [ -d "$LOG_PATH" ]; then
    rm -rf "$LOG_PATH"
    echo "✅ Logs supprimés"
fi

echo ""
echo "✨ Désinstallation terminée !"

