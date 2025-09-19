import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pawsitivecheck.app',
  appName: 'PawsitiveCheck',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // Standalone APK mode - no external server dependency during build
  },
  android: {
    allowMixedContent: true,
    appendUserAgent: 'PawsitiveCheck',
    overrideUserAgent: 'PawsitiveCheckApp'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    Camera: {
      permissions: ["camera"]
    }
  }
};

export default config;
