import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      build: {
        emptyOutDir: false
      },
      server: {
        port: 3000,
        host: '0.0.0.0',
        watch: {
          ignored: ['**/fonts/**', '**/.git/**', '**/*.zip']
        },
        proxy: {
          '^/(login|register|versioncheck|getvariable|getvariables|create_user|delete_user|reset_hwid|create_license|delete_license|create_app|delete_app)': {
            target: 'http://127.0.0.1:8787',
            changeOrigin: true,
          }
        }
      },
      plugins: [
        react(),
        {
          name: 'alphaxen-font-drm-guard',
          configureServer(server) {
            server.middlewares.use((req, res, next) => {
              const url = req.url || '';
              // Strictly block any attempt to request or download font binaries or archives
              if (url.match(/\.(otf|ttf|woff|woff2|eot|zip|py|pyc)$/i) || url.match(/\/fonts\//i)) {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  error: 'DRM_PROTECTED_ASSET',
                  message: 'Alphaxen Anti-Theft Guard: Font binary access and direct downloads are strictly prohibited in this project. All authentic typefaces are distributed exclusively via official foundry channels.'
                }));
                return;
              }
              next();
            });
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
