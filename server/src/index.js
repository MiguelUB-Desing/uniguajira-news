import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import newsRoutes from './routes/news.js';
import authRoutes from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
