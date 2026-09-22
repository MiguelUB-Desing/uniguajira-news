import mysql from 'mysql2/promise';

function buildConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    const url = new URL(databaseUrl);
    const useSsl = url.searchParams.get('ssl') !== 'false';
    return {
      host: url.hostname,
      port: parseInt(url.port || '3306', 10),
      user: decodeURIComponent(url.username || 'root'),
      password: decodeURIComponent(url.password || ''),
      database: (url.pathname || '/uniguajira_news').replace(/^\//, '') || 'uniguajira_news',
      ssl: useSsl ? { rejectUnauthorized: false } : false,
      connectTimeout: 15000,
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'uniguajira_news',
    connectTimeout: 15000,
  };
}

const pool = mysql.createPool({
  ...buildConfig(),
  waitForConnections: true,
  connectionLimit: 5,
  namedPlaceholders: false,
});

async function wrapConnection(conn) {
  return {
    async query(sql, params) {
      const [rows] = await conn.query(sql, params);
      return rows;
    },
    release() {
      conn.release();
    },
  };
}

export async function getConnection() {
  const conn = await pool.getConnection();
  return wrapConnection(conn);
}

const db = {
  getConnection,
  async query(sql, params) {
    const [rows] = await pool.query(sql, params);
    return rows;
  },
};

export default db;
