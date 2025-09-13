import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cw.resilient',
  appName: 'Resilient',
  webDir: 'dist/resilient-front-end/browser/',
  plugins: {
    EdgeToEdge: {
      backgroundColor: "#ffffff",
    },
  },
  
};

export default config;
