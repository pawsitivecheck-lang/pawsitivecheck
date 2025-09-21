#!/bin/bash

# Android SDK Setup Script for Replit/Local Development
# This script downloads and configures the Android SDK locally
# Note: This is a fallback option - GitHub Actions is recommended for builds

set -e

echo "==================================="
echo "Android SDK Setup for PawsitiveCheck"
echo "==================================="

# Configuration
ANDROID_SDK_ROOT="$PWD/android-sdk"
CMDLINE_TOOLS_VERSION="11076708"
CMDLINE_TOOLS_URL="https://dl.google.com/android/repository/commandlinetools-linux-${CMDLINE_TOOLS_VERSION}_latest.zip"
BUILD_TOOLS_VERSION="34.0.0"
PLATFORM_VERSION="34"

echo "📍 SDK will be installed to: $ANDROID_SDK_ROOT"

# Create SDK directory
echo "📁 Creating SDK directory..."
mkdir -p "$ANDROID_SDK_ROOT"
cd "$ANDROID_SDK_ROOT"

# Download command-line tools if not present
if [ ! -d "cmdline-tools" ]; then
    echo "📥 Downloading Android command-line tools..."
    wget -q --show-progress "$CMDLINE_TOOLS_URL" -O cmdline-tools.zip
    
    echo "📦 Extracting command-line tools..."
    unzip -q cmdline-tools.zip
    rm cmdline-tools.zip
    
    # Move to correct structure
    mkdir -p cmdline-tools/latest
    mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true
else
    echo "✅ Command-line tools already present"
fi

# Set up paths
export ANDROID_HOME="$ANDROID_SDK_ROOT"
export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH"

# Accept licenses
echo "📜 Accepting Android SDK licenses..."
yes | sdkmanager --licenses > /dev/null 2>&1 || true

# Install required SDK components
echo "📱 Installing Android SDK components..."
echo "   - platform-tools"
sdkmanager "platform-tools" > /dev/null 2>&1

echo "   - platforms;android-${PLATFORM_VERSION}"
sdkmanager "platforms;android-${PLATFORM_VERSION}" > /dev/null 2>&1

echo "   - build-tools;${BUILD_TOOLS_VERSION}"
sdkmanager "build-tools;${BUILD_TOOLS_VERSION}" > /dev/null 2>&1

echo "   - tools"
sdkmanager "tools" > /dev/null 2>&1 || true

# Update local.properties
cd "$OLDPWD"
echo "📝 Updating android/local.properties..."
echo "sdk.dir=$ANDROID_SDK_ROOT" > android/local.properties
echo "✅ Updated local.properties with SDK path"

# Create environment setup script
cat > android/setup-env.sh << 'EOF'
#!/bin/bash
# Source this file before building: source android/setup-env.sh
export ANDROID_SDK_ROOT="$PWD/android-sdk"
export ANDROID_HOME="$ANDROID_SDK_ROOT"
export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH"
export JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"

# Signing configuration (update with your values)
export KEYSTORE_PASSWORD="pawsitive123"
export KEY_ALIAS="pawsitivecheck"
export KEY_PASSWORD="pawsitive123"

echo "✅ Android build environment configured"
echo "   ANDROID_SDK_ROOT: $ANDROID_SDK_ROOT"
echo "   JAVA_HOME: $JAVA_HOME"
EOF

chmod +x android/setup-env.sh

echo ""
echo "==================================="
echo "✅ Android SDK Setup Complete!"
echo "==================================="
echo ""
echo "📋 Next Steps:"
echo "1. Source the environment: source android/setup-env.sh"
echo "2. Build the app:"
echo "   cd android"
echo "   ./gradlew assembleRelease"
echo ""
echo "⚠️  Note: Building in Replit may timeout. GitHub Actions is recommended."
echo ""
echo "SDK Location: $ANDROID_SDK_ROOT"
echo "SDK Version: Android $PLATFORM_VERSION"
echo "Build Tools: $BUILD_TOOLS_VERSION"