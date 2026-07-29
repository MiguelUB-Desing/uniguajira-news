import axios from 'axios';
import * as cheerio from 'cheerio';

const UNI_GUAJIRA_URL = 'https://uniguajira.edu.co';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
  'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36',
];

function randomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\t+/g, ' ')
    .trim();
}

function formatDate(isoDate) {
  const d = new Date(isoDate);
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0') + ' ' +
    String(d.getHours()).padStart(2, '0') + ':' +
    String(d.getMinutes()).padStart(2, '0') + ':' +
    String(d.getSeconds()).padStart(2, '0');
}

async function extractNews($) {
  const news = [];
  const seen = new Set();

  const selectors = [
    'article', '.post', '.entry', '.noticia', '.news-item',
    '[class*="noticia"]', '[class*="post"]', '[class*="news"]',
    '.elementor-post', '.td-module', '.mvp-blog-story',
  ];

  $(selectors.join(', ')).each((_, el) => {
    const $el = $(el);
    const rawTitle = $el.find('h1, h2, h3, h4, .title, .entry-title, a').first().text();
    const title = cleanText(rawTitle);
    const link = $el.find('a').first().attr('href');
    const srcUrl = link ? (link.startsWith('http') ? link : `${UNI_GUAJIRA_URL}${link}`) : null;

    if (!title || title.length < 10 || seen.has(srcUrl)) return;
    if (srcUrl) seen.add(srcUrl);

    const rawDesc = $el.find('p, .excerpt, .description, .entry-summary').first().text();
    const description = cleanText(rawDesc) || title;
    const img = $el.find('img').first().attr('src');
    const imageUrl = img ? (img.startsWith('http') ? img : `${UNI_GUAJIRA_URL}${img}`) : null;

    news.push({
      title,
      description: description.slice(0, 300),
      source_url: srcUrl || UNI_GUAJIRA_URL,
      image_url: imageUrl,
      category: inferCategory(title + ' ' + description),
      published_at: formatDate(new Date().toISOString()),
    });
  });

  return news;
}

export async function scrapeNews() {
  try {
    const { data } = await axios.get(UNI_GUAJIRA_URL, {
      headers: {
        'User-Agent': randomUA(),
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'es-CO,es;q=0.9',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);
    const seen = new Set();
    let news = await extractNews($);

    if (news.length < 5) {
      $('a[href*="noticia"], a[href*="news"], a[href*="comunicado"], a[href*="actualidad"]').each((_, el) => {
        const $el = $(el);
        const rawTitle = cleanText($el.text());
        const link = $el.attr('href');
        const srcUrl = link ? (link.startsWith('http') ? link : `${UNI_GUAJIRA_URL}${link}`) : null;

        if (!rawTitle || rawTitle.length < 10 || seen.has(srcUrl)) return;
        if (srcUrl) seen.add(srcUrl);

        news.push({
          title: rawTitle,
          description: rawTitle,
          source_url: srcUrl || UNI_GUAJIRA_URL,
          image_url: null,
          category: inferCategory(rawTitle),
          published_at: formatDate(new Date().toISOString()),
        });
      });
    }

    news = news.filter(n => n.title.length >= 10);

    return news;
  } catch (error) {
    console.error('Scraping error:', error.message);
    return [];
  }
}

function inferCategory(text) {
  const lower = text.toLowerCase();
  if (lower.includes('admision') || lower.includes('matrícula') || lower.includes('inscripcion') || lower.includes('aspirante')) return 'Admisiones';
  if (lower.includes('academia') || lower.includes('académico') || lower.includes('curso') || lower.includes('semestre') || lower.includes('docente') || lower.includes('clase')) return 'Academia';
  if (lower.includes('bienestar') || lower.includes('deporte') || lower.includes('cultura') || lower.includes('salud') || lower.includes('recreacion')) return 'Bienestar';
  if (lower.includes('investigacion') || lower.includes('investigación') || lower.includes('ciencia') || lower.includes('laboratorio')) return 'Investigación';
  if (lower.includes('extensión') || lower.includes('extension') || lower.includes('social') || lower.includes('proyección')) return 'Extensión';
  if (lower.includes('comunicado') || lower.includes('circular') || lower.includes('oficial') || lower.includes('convocatoria')) return 'Comunicados';
  return 'General';
}
