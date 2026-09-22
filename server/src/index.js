import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from './config/db.js';
import newsRoutes from './routes/news.js';
import authRoutes from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta de nuevo en un minuto.' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Límite de peticiones alcanzado. Intenta más tarde.' },
});

const corsOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const corsOrigin = corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins;

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: corsOrigin, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '1mb' }));

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', async (_, res) => {
  let database = 'ok';
  try {
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    conn.release();
  } catch {
    database = 'error';
  }
  const status = database === 'ok' ? 'ok' : 'degraded';
  res.status(database === 'ok' ? 200 : 503).json({ status, database, timestamp: new Date().toISOString() });
});

app.get('/api/diag', async (_, res) => {
  const axios = (await import('axios')).default;
  const targets = [
    'https://uniguajira.edu.co/wp-json/wp/v2/posts?per_page=1',
    'https://uniguajira.edu.co/feed/',
    'https://www.uniguajira.edu.co/wp-json/wp/v2/posts?per_page=1',
  ];
  const results = {};
  for (const url of targets) {
    try {
      const r = await axios.get(url, { timeout: 15000, maxRedirects: 5, validateStatus: () => true });
      results[url] = { status: r.status, type: typeof r.data, len: typeof r.data === 'string' ? r.data.length : Array.isArray(r.data) ? r.data.length : 'obj' };
    } catch (e) {
      results[url] = { error: e.message, code: e.code };
    }
  }
  res.json({ node: process.version, env: { maxPages: process.env.SCRAPER_MAX_PAGES, perPage: process.env.SCRAPER_POSTS_PER_PAGE }, results });
});

if (isProd) {
  const distPath = path.join(__dirname, '../../app/dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`Sirviendo frontend desde ${distPath}`);
  } else {
    console.warn('ADVERTENCIA: No se encontró app/dist/. Ejecuta "npm run build" en la carpeta app/');
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor proxy corriendo en puerto ${PORT} [${isProd ? 'PRODUCCIÓN' : 'DESARROLLO'}]`);
});