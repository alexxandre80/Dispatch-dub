#!/bin/bash

# Script de désinstallation pour Dispatch Dub sur macOS

APP_NAME="Dispatch Dub"
APP_PATH="/Applications/${APP_NAME}.app"
SUPPORT_PATH="$HOME/Library/Application Support/${APP_NAME}"
CACHES_PATH="$HOME/Library/Caches/${APP_NAME}"
PREFERENCES_PATH="$HOME/Library/Preferences/com.dispatchdub.*"
LOG_PATH="$HOME/Library/Logs/${APP_NAME}"

echo "🗑️  Désinstallation de ${APP_NAME}..."
echo ""

# Vérifier si l'application est installée
if [ ! -d "$APP_PATH" ]; then
    echo "⚠️  ${APP_NAME} n'est pas installée dans /Applications/"
    echo "   L'application n'a peut-être pas été installée via le DMG."
    read -p "Voulez-vous continuer quand même pour supprimer les fichiers de support ? (o/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        echo "❌ Désinstallation annulée."
        exit 0
    fi
else
    # Supprimer l'application
    echo "📦 Suppression de l'application..."
    rm -rf "$APP_PATH"
    
    if [ $? -eq 0 ]; then
        echo "✅ Application supprimée avec succès"
    else
        echo "❌ Erreur lors de la suppression de l'application"
        echo "   Vous devrez peut-être saisir votre mot de passe administrateur"
        sudo rm -rf "$APP_PATH"
    fi
fi

# Supprimer les fichiers de support
echo ""
echo "🧹 Nettoyage des fichiers de support..."

# Supprimer Application Support
if [ -d "$SUPPORT_PATH" ]; then
    rm -rf "$SUPPORT_PATH"
    echo "✅ Fichiers de support supprimés"
fi

# Supprimer les caches
if [ -d "$CACHES_PATH" ]; then
    rm -rf "$CACHES_PATH"
    echo "✅ Caches supprimés"
fi

# Supprimer les préférences
if ls $PREFERENCES_PATH 1> /dev/null 2>&1; then
    rm -f $PREFERENCES_PATH
    echo "✅ Préférences supprimées"
fi

# Supprimer les logs
if [ -d "$LOG_PATH" ]; then
    rm -rf "$LOG_PATH"
    echo "✅ Logs supprimés"
fi

# Supprimer les fichiers de mise à jour (si présents)
UPDATE_PATH="$HOME/Library/Application Support/Caches/${APP_NAME}-updater"
if [ -d "$UPDATE_PATH" ]; then
    rm -rf "$UPDATE_PATH"
    echo "✅ Fichiers de mise à jour supprimés"
fi

echo ""
echo "✨ Désinstallation terminée !"
echo ""
echo "Note: Si vous avez installé l'application ailleurs que dans /Applications/,"
echo "      vous devrez la supprimer manuellement."

