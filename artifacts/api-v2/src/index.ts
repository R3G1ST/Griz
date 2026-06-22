import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { apiReference } from '@scalar/express-api-reference';
import { env } from './config/env.js';
import { menuRoutes } from './routes/menu.js';
import { swaggerDocument } from './config/swagger.js';

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Scalar API Reference (современная документация)
app.use('/reference', apiReference({
  spec: {
    url: '/api/v1/openapi.json',
  },
  theme: 'purple',
  darkMode: true,
  hideModels: false,
  hideDownloadButton: false,
}));



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
