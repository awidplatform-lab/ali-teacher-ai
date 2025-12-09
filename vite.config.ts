import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // --- HNA FIN TQDR T-COLLER L-KEY DIALK ---
  // Ila mabghitich tdir fichier .env, mseh had l-ktba li bin " " o coller l-Key dialk hna.
  // Methal: const manualKey = "AIzaSyD-xxxxxxxxxxxxxxxx";
  const manualKey = "AIzaSyDYuzBTAoTaZ5gA8RuUOsZa3XiuJeO-ME8"; 
  // -----------------------------------------

  return {
    plugins: [react()],
    base: './', // Fixes white screen on GitHub Pages (loads assets relatively)
    define: {
      // Hada kaychouf wach kayn Key f .env, ila makanch kayakhod manualKey li lfouq
      'process.env.API_KEY': JSON.stringify(env.API_KEY || manualKey)
    }
  };
});