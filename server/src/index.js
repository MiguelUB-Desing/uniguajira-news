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

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] }));
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