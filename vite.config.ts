import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    // IMPORTANT: base: './' makes paths relative, so it works on user.github.io/repo-name/
    base: './', 
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false, // Disable sourcemaps for production to save space
      minify: 'esbuild',
    },
    define: {
      // MA TKTBCH L-KEY HNA B YEDIK.
      // Sta3ml l-Popup li f l-site bach t-dakhal l-Key.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});