# Android Build Setup for PawsitiveCheck

## Important Security Notice
Your keystore credentials have been updated to use environment variables instead of hardcoded values. This is a critical security improvement.

## GitHub Actions Setup (Recommended)

Your project already has a GitHub Actions workflow configured at `.github/workflows/android-build.yml`. To enable automated APK builds:

### 1. Set up GitHub Secrets

Go to your repository Settings → Secrets and Variables → Actions, and add these secrets:

- `KEYSTORE_PASSWORD`: pawsitive123
- `KEY_ALIAS`: pawsitivecheck  
- `KEY_PASSWORD`: pawsitive123

### 2. Encode and Upload Your Keystore

**IMPORTANT**: For production, you should:
1. Generate a new keystore with secure passwords
2. Never commit the keystore file to the repository
3. Store it as a base64-encoded GitHub secret

To encode your existing keystore:
```bash
base64 -i android/app/pawsitivecheck-release.jks -o keystore.txt
```

Then add the contents of `keystore.txt` as a GitHub secret named `KEYSTORE_BASE64`.

### 3. Trigger Builds

Builds will automatically run when you:
- Push to the main branch
- Create a tag starting with 'v' (e.g., v1.0.0)
- Manually trigger from Actions tab

APKs will be available as artifacts in the GitHub Actions run.

## Local Build Fallback (Not Recommended for Replit)

If you absolutely need to build locally in Replit (expect timeouts and issues):

### Option 1: Quick Setup Script
```bash
# Run this script to download and set up Android SDK locally
./scripts/setup-android-sdk.sh
```

### Option 2: Manual SDK Setup
1. Download Android command-line tools
2. Install required SDK components
3. Update `android/local.properties` with the SDK path
4. Run build with environment variables:
```bash
cd android
export KEYSTORE_PASSWORD=pawsitive123
export KEY_ALIAS=pawsitivecheck
export KEY_PASSWORD=pawsitive123
./gradlew assembleRelease
```

## Security Best Practices

1. **Rotate Your Keys**: Since your passwords were previously hardcoded, generate a new keystore with secure passwords
2. **Remove from Repository**: Delete the keystore file from your repository history
3. **Use CI/CD**: Always build production APKs through GitHub Actions, not locally
4. **Secure Storage**: Store keystore and passwords in a password manager

## Build Outputs

- **Debug APK**: For testing (not signed for production)
- **Release APK**: Signed and optimized for production/Play Store

Both APKs support multiple architectures (ARM, x86) and are optimized with ProGuard.

## Troubleshooting

If builds fail:
1. Check that all GitHub secrets are set correctly
2. Ensure Node.js dependencies are installed: `npm ci`
3. Sync Capacitor: `npx cap sync android`
4. Check Java version: Requires JDK 21

For more help, check the build logs in GitHub Actions.