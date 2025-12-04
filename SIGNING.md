# Guide de signature et notarisation macOS

Pour signer et notariser l'application macOS, vous devez avoir un compte Apple Developer.

## Prérequis

1. **Compte Apple Developer** (99$/an) : https://developer.apple.com/programs/
2. **Certificat de signature** : Créez un "Developer ID Application" sur https://developer.apple.com/account/resources/certificates/list
3. **Mot de passe d'application** : Créez-en un sur https://appleid.apple.com/account/manage

## Configuration

1. Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

2. Remplissez le fichier `.env` avec vos identifiants :

```env
# Identité de signature (trouvez-la avec: security find-identity -v -p codesigning)
APPLE_SIGNING_IDENTITY="Developer ID Application: Votre Nom (XXXXXXXXXX)"

# Apple ID pour la notarisation
APPLE_ID=votre.email@example.com

# Mot de passe d'application (pas votre mot de passe Apple ID)
APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Team ID (trouvez-le sur https://developer.apple.com/account)
APPLE_TEAM_ID=XXXXXXXXXX
```

3. Trouvez votre identité de signature :

```bash
security find-identity -v -p codesigning
```

4. Créez un mot de passe d'application :
   - Allez sur https://appleid.apple.com/account/manage
   - Section "App-Specific Passwords"
   - Créez un nouveau mot de passe pour "Dispatch Dub"

5. Trouvez votre Team ID :
   - Allez sur https://developer.apple.com/account
   - Votre Team ID est affiché en haut à droite

## Build avec signature

Une fois le fichier `.env` configuré, lancez simplement :

```bash
npm run make
```

L'application sera automatiquement signée et notarisée si les identifiants sont corrects.

## Vérification

Pour vérifier que l'application est signée :

```bash
codesign -dv --verbose=4 "out/Dispatch Dub-darwin-arm64/Dispatch Dub.app"
```

Pour vérifier la notarisation :

```bash
spctl -a -vv "out/Dispatch Dub-darwin-arm64/Dispatch Dub.app"
```

## Notes

- Le fichier `.env` est dans `.gitignore` et ne sera pas commité
- La signature et la notarisation prennent du temps (plusieurs minutes)
- En cas d'erreur, vérifiez vos identifiants dans `.env`

