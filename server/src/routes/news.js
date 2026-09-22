import { Router } from 'express';
import { scrapeNews } from '../scraper.js';
import { getCachedNews, cacheNews, getCacheControl, updateScrapeTimestamp, incrementRequests } from '../cache.js';
import db from '../config/db.js';

const router = Router();

async function refreshCache() {
  try {
    const news = await scrapeNews();
    if (news.length > 0) {
      await cacheNews(news);
      await updateScrapeTimestamp();
    }
    return news.length;
  } catch (err) {
    console.error('Error en refresco de caché:', err.message);
    return 0;
  }
}

router.get('/', async (req, res) => {
  try {
    const { category, limit } = req.query;
    const news = await getCachedNews(category, parseInt(limit) || 50);

    if (news.length === 0) {
      refreshCache();
      return res.json({ source: 'empty', data: [], message: 'No hay noticias en caché. El scraper se ejecutará en segundo plano.' });
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

    const count = await refreshCache();
    const news = await getCachedNews();

    res.json({ source: 'scraped', count, data: news });
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
