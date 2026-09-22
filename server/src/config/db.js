import mariadb from 'mariadb';

function buildConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    const url = new URL(databaseUrl);
    const ssl = url.searchParams.get('ssl') !== 'false';
    return {
      host: url.hostname,
      port: parseInt(url.port || '3306', 10),
      user: decodeURIComponent(url.username || 'root'),
      password: decodeURIComponent(url.password || ''),
      database: (url.pathname || '/uniguajira_news').replace(/^\//, '') || 'uniguajira_news',
      connectionLimit: 5,
      ssl,
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'uniguajira_news',
    connectionLimit: 5,
  };
}

const pool = mariadb.createPool(buildConfig());

export async function getConnection() {
  return await pool.getConnection();
}

export default pool;
