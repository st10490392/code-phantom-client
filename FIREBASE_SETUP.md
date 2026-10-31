# Firebase Storage — Direct APK Download Setup

## Status

- **Project:** `codephantom-technologies` (CodePhantom Technologies)
- **Account:** vuneneripfumelongobeni@gmail.com
- **CLI:** firebase-tools 15.34.2 installed globally
- **BLOCKED:** Firebase Storage API not yet enabled on the project.

## One Manual Step Required (2 minutes)

Firebase Storage must be created once via the console before the CLI can deploy to it:

1. Open: **https://console.firebase.google.com/project/codephantom-technologies/storage**
2. Click **"Get Started"**
3. Choose a location (pick `europe-west1` or `us-central1` — closest to your users)
4. Click **Done**

Then I will: deploy the storage rules, upload the APK, wire the service
account into the CodePhantom backend, and point `/download` at the direct URL.

## What the client sees

```
Click "Download APK" on the CodePhantom website
  -> https://firebasestorage.googleapis.com/v0/b/<bucket>/o/downloads%2Fcodephantom-client.apk?alt=media
  -> APK downloads immediately (no GitHub, no redirect)
```

## Rules (already written to storage.rules)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /downloads/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Commands (ready once Storage is enabled)

```bash
cd /c/Users/cptadmin/code-phantom/client-web

firebase deploy --only storage --project codephantom-technologies

curl -X POST \
  -H "Content-Type: application/octet-stream" \
  --data-binary @app-debug.apk \
  "https://firebasestorage.googleapis.com/v0/b/<bucket>/o?uploadType=media&name=downloads/codephantom-client.apk"
```

## Free Tier Limits

- Storage: 5 GB
- Download: 1 GB/day
- Max file size: 5 GB

An APK is ~15-25 MB, so ~40-60 full downloads/day on the free tier.
