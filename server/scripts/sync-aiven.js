#!/usr/bin/env node
/**
 * Scrapa uniguajira.edu.co desde la máquina local (Cloudflare no bloquea aquí)
 * y guarda los resultados en Aiven (u otra BD si DATABASE_URL/DB_* está en el entorno).
 *
 * Uso:
 *   DATABASE_URL='mysql://...' node scripts/sync-aiven.js
 * o con variables DB_HOST/DB_USER/...
 */
import 'dotenv/config';
import { scrapeNews } from '../src/scraper.js';
import db from '../src/config/db.js';

if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
  console.error('Define DATABASE_URL (o DB_HOST) en el entorno o server/.env');
  process.exit(1);
}

const news = await scrapeNews();
if (news.length === 0) {
  console.error('Scraper devolvió 0 noticias; no se escribe nada.');
  process.exit(1);
}

const conn = await db.getConnection();
let inserted = 0;
for (const item of news) {
  try {
    await conn.query(
      `INSERT INTO noticias_cache (title, description, content, source_url, image_url, category, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         description = VALUES(description),
         content = VALUES(content),
         image_url = VALUES(image_url),
         category = VALUES(category),
         published_at = VALUES(published_at),
         updated_at = NOW()`,
      [item.title, item.description, item.content || null, item.source_url, item.image_url, item.category, item.published_at]
    );
    inserted += 1;
  } catch (err) {
    console.error('Error guardando', item.source_url, err.message);
  }
}
await conn.query(
  `INSERT INTO cache_control (id, last_scrape, requests_today, last_request_date, max_daily_requests)
   VALUES (1, NOW(), 0, CURDATE(), 100)
   ON DUPLICATE KEY UPDATE last_scrape = NOW()`
);
conn.release();

const rows = await db.query('SELECT COUNT(*) AS c FROM noticias_cache');
console.log(`OK: ${inserted}/${news.length} guardadas; total en BD: ${rows[0].c}`);
process.exit(0);
