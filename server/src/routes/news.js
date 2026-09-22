import { Router } from 'express';
import { scrapeNews } from '../scraper.js';
import { getCachedNews, cacheNews, getCacheControl, updateScrapeTimestamp, incrementRequests } from '../cache.js';
import db from '../config/db.js';

const router = Router();

async function refreshCache() {
  try {
    const news = await scrapeNews();
    if (news.length > 0) {
      const inserted = await cacheNews(news);
      await updateScrapeTimestamp();
      return { count: news.length, inserted, error: null };
    }
    return { count: 0, inserted: 0, error: 'scraper devolvió 0 noticias' };
  } catch (err) {
    console.error('Error en refresco de caché:', err);
    return { count: 0, inserted: 0, error: err.message };
  }
}

router.get('/', async (req, res) => {
  try {
    const { category, limit } = req.query;
    const news = await getCachedNews(category, parseInt(limit) || 50);

    if (news.length === 0) {
      const bg = await refreshCache();
      if (bg.count > 0) {
        const refreshed = await getCachedNews(category, parseInt(limit) || 50);
        return res.json({ source: 'scraped', data: refreshed });
      }
      return res.json({ source: 'empty', data: [], message: 'No hay noticias en caché.', error: bg.error });
    }

    res.json({ source: 'cache', data: news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/by-url', async (req, res) => {
  try {
    const { source_url } = req.query;
    if (!source_url) return res.status(400).json({ error: 'source_url requerido' });
    const news = await getCachedNews(null, 200);
    const item = news.find(n => n.source_url === source_url);
    if (item) {
      res.json({ source: 'single', data: item });
    } else {
      res.status(404).json({ error: 'Noticia no encontrada en caché' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const control = await getCacheControl();
    const today = new Date().toISOString().split('T')[0];

    if (control.last_request_date === today && control.requests_today >= control.max_daily_requests) {
      const cached = await getCachedNews();
      return res.json({ source: 'cache (daily limit reached)', data: cached });
    }

    await incrementRequests(today);

    const result = await refreshCache();
    const news = await getCachedNews();

    res.json({ source: 'scraped', count: result.count, inserted: result.inserted, error: result.error, data: news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const conn = await db.getConnection();
    const rows = await conn.query('SELECT DISTINCT category FROM noticias_cache ORDER BY category');
    conn.release();
    res.json(rows.map(r => r.category));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
