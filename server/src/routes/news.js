import { Router } from 'express';
import { scrapeNews } from '../scraper.js';
import { getCachedNews, cacheNews, getCacheControl, updateScrapeTimestamp } from '../cache.js';
import db from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category, limit } = req.query;
    const news = await getCachedNews(category, parseInt(limit) || 50);

    if (news.length === 0) {
      scrapeNews().then(async (fresh) => {
        if (fresh.length > 0) {
          await cacheNews(fresh);
          await updateScrapeTimestamp();
        }
      });
      return res.json({ source: 'empty', data: [], message: 'No hay noticias en caché. El scraper se ejecutará en segundo plano.' });
    }

    res.json({ source: 'cache', data: news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const control = getCacheControl();
    const today = new Date().toISOString().split('T')[0];

    if (control.last_request_date === today && control.requests_today >= control.max_daily_requests) {
      const cached = getCachedNews();
      return res.json({ source: 'cache (daily limit reached)', data: cached });
    }

    const news = await scrapeNews();
    if (news.length > 0) {
      await cacheNews(news);
      await updateScrapeTimestamp();
    }

    res.json({ source: 'scraped', count: news.length, data: news });
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
