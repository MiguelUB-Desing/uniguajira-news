CREATE DATABASE IF NOT EXISTS uniguajira_news;
USE uniguajira_news;

CREATE TABLE IF NOT EXISTS noticias_cache (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT,
  source_url VARCHAR(500) UNIQUE NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100) DEFAULT 'general',
  published_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_published_at (published_at)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'lector') DEFAULT 'lector',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cache_control (
  id INT AUTO_INCREMENT PRIMARY KEY,
  last_scrape DATETIME,
  requests_today INT DEFAULT 0,
  last_request_date DATE,
  max_daily_requests INT DEFAULT 100
);
