# Firebase Storage Setup for Direct APK Downloads

## Why Firebase?
- Free tier: 5GB storage, 1GB/day download
- Direct download links (no redirect)
- Works with Vercel static hosting
- No GitHub redirect needed

## Setup Steps

1. Go to https://console.firebase.google.com
2. Create a new project (or use existing)
3. Go to Storage → Get Started
4. Upload `client-app.apk` to `downloads/` folder
5. Set security rules:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /downloads/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
6. Get your download URL:
   - Click on the APK file
   - Click "Get download URL"
   - Or use: `https://firebasestorage.googleapis.com/v0/b/<bucket>/o/downloads%2Fclient-app.apk?alt=media`

## Update Website
Replace the GitHub Releases link in `app/download/page.tsx` with your Firebase download URL.
