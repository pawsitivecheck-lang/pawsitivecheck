# Android Build Setup Guide

## Automated CI/CD Pipeline

This repository now includes GitHub Actions workflows for automated Android APK builds. No local Android SDK setup required!

## Available Workflows

### 1. Debug Builds (`android-build.yml`)
- **Triggers**: Push to main/master, Pull Requests, Manual trigger
- **Output**: Debug APK for testing
- **Location**: Actions artifacts (30-day retention)

### 2. Release Builds (`android-release.yml`)
- **Triggers**: Version tags (v1.0.0), Manual trigger
- **Output**: Signed release APK + GitHub Release
- **Location**: GitHub Releases (permanent)

## Quick Start

### For Debug Builds
1. Push code to main/master branch
2. Go to Actions tab in GitHub
3. Wait for build completion
4. Download APK from artifacts

### For Release Builds
1. Create version tag: `git tag v1.0.0 && git push origin v1.0.0`
2. Workflow automatically creates GitHub Release with APK
3. Or manually trigger from Actions tab

## Manual Commands (Local Development)

```bash
# Build web app and sync to Android
npm run build
npx cap sync android

# Build debug APK locally (if Android SDK installed)
cd android && ./gradlew assembleDebug

# Build release APK locally (if Android SDK installed)
cd android && ./gradlew assembleRelease
```

## GitHub Secrets Setup (For Release Builds)

To enable signed release builds, add these secrets in GitHub Settings > Secrets:

- `KEYSTORE_FILE`: Base64 encoded keystore file
- `KEYSTORE_PASSWORD`: Your keystore password
- `KEY_ALIAS`: Your key alias
- `KEY_PASSWORD`: Your key password

## Build Outputs

- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

## Benefits

✅ **No Local Setup**: No need for Android SDK on development machines  
✅ **Consistent Builds**: Same environment every time  
✅ **Automatic Releases**: Tag-based release workflow  
✅ **Build Artifacts**: 30-90 day artifact retention  
✅ **Team Collaboration**: Anyone can trigger builds via GitHub