import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pawsitivecheck.app',
  appName: 'PawsitiveCheck',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // Point mobile app to your live Replit server
    url: 'https://059083a2-a2a5-4ec8-a102-d74ccfb64f20-00-2qvtd9mlye025.picard.replit.dev',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
