# Guide de création de Release

## Créer une release manuellement

1. **Créer un tag Git** :
   ```bash
   git tag -a v1.0.0 -m "Release 1.0.0"
   git push origin v1.0.0
   ```

2. **Aller sur GitHub** :
   - Allez sur https://github.com/alexxandre80/Dispatch-dub/releases/new
   - Sélectionnez le tag que vous venez de créer (ex: `v1.0.0`)
   - Donnez un titre à la release (ex: "Release 1.0.0")

3. **Ajouter les fichiers de build** :
   - Téléversez les fichiers depuis `out/make/` :
     - `Dispatch Dub-1.0.0-arm64.dmg` (macOS)
     - `Dispatch Dub-darwin-arm64-1.0.0.zip` (macOS ZIP)
     - Et les autres fichiers selon les plateformes buildées

4. **Ajouter des notes de release** (optionnel) :
   ```
   ## Version 1.0.0
   
   Première release de Dispatch Dub !
   
   ### Téléchargements
   - **macOS** : Téléchargez le fichier `.dmg` ou `.zip`
   - **Windows** : Téléchargez le fichier `.exe` ou `.zip`
   - **Linux** : Téléchargez le fichier `.deb`, `.rpm` ou `.zip`
   
   ### Installation
   - **macOS** : Ouvrez le `.dmg` et glissez l'application dans Applications
   - **Windows** : Exécutez le `.exe` et suivez les instructions
   - **Linux** : Installez avec `sudo dpkg -i *.deb` ou `sudo rpm -i *.rpm`
   ```

5. **Publier la release** : Cliquez sur "Publish release"

## Automatisation avec GitHub Actions

Un workflow GitHub Actions est configuré pour créer automatiquement des releases lors de la création d'un tag `v*`.

Pour l'utiliser :
1. Créez un tag : `git tag -a v1.0.0 -m "Release 1.0.0"`
2. Poussez le tag : `git push origin v1.0.0`
3. Le workflow GitHub Actions va automatiquement :
   - Builder l'application pour macOS, Windows et Linux
   - Créer une release avec tous les fichiers de build
   - Publier la release sur GitHub

## Avec GitHub CLI (si installé)

Si vous avez GitHub CLI installé :

```bash
./scripts/create-release.sh
```

Ou manuellement :

```bash
gh release create v1.0.0 \
  out/make/*.dmg \
  out/make/zip/**/*.zip \
  --title "Release 1.0.0" \
  --notes "Notes de la release"
```

