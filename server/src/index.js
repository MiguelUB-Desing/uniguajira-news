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
  const url = 'https://uniguajira.edu.co/wp-json/wp/v2/posts?per_page=1';
  const attempts = [
    { name: 'news-ua', headers: { 'User-Agent': 'UniGuajira-News/1.0 (+https://uniguajira.edu.co)' } },
    { name: 'browser-ua', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', Accept: 'application/json, text/plain, */*', 'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8', Referer: 'https://uniguajira.edu.co/' } },
    { name: 'curl-ua', headers: { 'User-Agent': 'curl/8.5.0' } },
  ];
  const results = {};
  for (const a of attempts) {
    try {
      const r = await axios.get(url, { timeout: 15000, maxRedirects: 5, validateStatus: () => true, headers: a.headers });
      results[a.name] = {
        status: r.status,
        type: Array.isArray(r.data) ? 'array' : typeof r.data,
        len: Array.isArray(r.data) ? r.data.length : typeof r.data === 'string' ? r.data.length : 'obj',
        snippet: typeof r.data === 'string' ? r.data.slice(0, 200) : null,
        cf: r.headers['cf-ray'] || null,
      };
    } catch (e) {
      results[a.name] = { error: e.message, code: e.code };
    }
  }
  res.json({ node: process.version, results });
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