import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://fpabvfwjbxqsrpdglvgt.supabase.co';
  const secretKey = env.SUPABASE_SECRET_KEY || env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

  return {
    plugins: [react()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    server: {
      port: 5176,
      host: true,
      proxy: {
        '/supabase-admin': {
          target: supabaseUrl,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/supabase-admin/, '/rest/v1'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Strip browser client hint headers so Supabase recognizes this as a secure server-to-server request
              proxyReq.removeHeader('sec-ch-ua');
              proxyReq.removeHeader('sec-ch-ua-mobile');
              proxyReq.removeHeader('sec-ch-ua-platform');
              proxyReq.setHeader('User-Agent', 'toomakt-atelier-server/1.0');
              proxyReq.setHeader('apikey', secretKey);
              proxyReq.setHeader('Authorization', `Bearer ${secretKey}`);
            });
          },
        },
      },
    },
  };
});
