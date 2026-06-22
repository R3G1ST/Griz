import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiReference } from '@scalar/express-api-reference';
import { env } from './config/env.js';
import { menuRoutes } from './routes/menu.js';
import { postsRoutes } from './routes/posts.js';
import { swaggerDocument } from './config/swagger.js';

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      connectSrc: ["'self'", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/posts', postsRoutes);

// Scalar API Reference (современная документация)
app.get('/reference', (req, res, next) => {
  // Отключаем CSP для Scalar
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('X-Content-Security-Policy');
  next();
}, apiReference({
  spec: {
    url: '/api/v1/openapi.json',
  },
  theme: 'alternate',
  darkMode: true,
  hideModels: true,
  hideDownloadButton: true,
  hideTestRequestButton: false,
  defaultHttpClient: {
    targetKey: 'shell',
    clientKey: 'curl',
  },
  customCss: `
    /* === GRIZZLY THEME === */
    /* Фон */
    .dark-mode, body { background: #0d0d0d !important; }
    .scalar-app { background: #0d0d0d !important; }
    
    /* Сайдбар - убираем лишний отступ */
    .sidebar { 
      background: #111 !important; 
      border-right: 1px solid #222 !important;
      width: 260px !important;
    }
    .sidebar-group-title { color: #D4FF3F !important; font-size: 11px !important; text-transform: uppercase !important; letter-spacing: 1px !important; }
    .sidebar-link { color: #999 !important; font-size: 13px !important; padding: 6px 12px !important; }
    .sidebar-link.active-page { color: #D4FF3F !important; background: rgba(212,255,63,0.08) !important; }
    .sidebar-link:hover { color: #fff !important; }
    
    /* Контент - компактнее */
    .section-header { border-bottom: 1px solid #222 !important; }
    .endpoint-label { font-size: 11px !important; }
    .request-url { background: #1a1a1a !important; border: 1px solid #333 !important; border-radius: 6px !important; }
    
    /* Акцентный цвет */
    .text-c-1, .method-get { color: #D4FF3F !important; }
    .bg-c-1 { background: #D4FF3F !important; }
    .border-c-1 { border-color: #D4FF3F !important; }
    
    /* Код */
    pre, code { background: #1a1a1a !important; border: 1px solid #222 !important; }
    
    /* Убираем ненужное */
    .darklight-reference, .download-cta, .scalar-brand { display: none !important; }
    .show-api-client-button { background: #D4FF3F !important; color: #000 !important; border-radius: 6px !important; }
  `,
}));




// OpenAPI JSON для Scalar
app.get('/api/v1/openapi.json', (req, res) => {
  res.json(swaggerDocument);
});

// Root endpoint - serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = parseInt(env.PORT);
app.listen(PORT, () => {
  console.log(`🚀 API v2 server running on port ${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/docs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
