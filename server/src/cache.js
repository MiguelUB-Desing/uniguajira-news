import pool from './config/db.js';

export async function getCachedNews(category = null, limit = 50) {
  const conn = await pool.getConnection();
  try {
    let query = 'SELECT * FROM noticias_cache';
    const params = [];
    if (category && category.toLowerCase() !== 'all') {
      query += ' WHERE category = ?';
      params.push(category);
    }
    query += ' ORDER BY published_at DESC LIMIT ?';
    params.push(parseInt(limit));
    const rows = await conn.query(query, params);
    return rows.map(r => ({ ...r, id: Number(r.id) }));
  } finally {
    conn.release();
  }
}

export async function cacheNews(newsList) {
  const conn = await pool.getConnection();
  try {
    let inserted = 0;
    for (const item of newsList) {
      try {
        await conn.query(
          `INSERT INTO noticias_cache (title, description, content, source_url, image_url, category, published_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             title = VALUES(title),
             description = VALUES(description),
             image_url = VALUES(image_url),
             category = VALUES(category),
             updated_at = NOW()`,
          [item.title, item.description, item.content || null, item.source_url, item.image_url, item.category, item.published_at]
        );
        inserted++;
      } catch (err) {
        console.error('Error caching item:', err.message);
      }
    }
    return inserted;
  } finally {
    conn.release();
  }
}

export async function getCacheControl() {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query('SELECT * FROM cache_control WHERE id = 1');
    if (rows.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      await conn.query('INSERT INTO cache_control (id, last_scrape, requests_today, last_request_date) VALUES (1, NULL, 0, ?)', [today]);
      return { last_scrape: null, requests_today: 0, last_request_date: today, max_daily_requests: 100 };
    }
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function updateScrapeTimestamp() {
  const conn = await pool.getConnection();
  try {
    await conn.query('UPDATE cache_control SET last_scrape = NOW() WHERE id = 1');
  } finally {
    conn.release();
  }
}
