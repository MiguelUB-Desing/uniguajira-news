import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.uniguajira.news',
  appName: 'UniGuajiraNews',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  }
};

export default config;
