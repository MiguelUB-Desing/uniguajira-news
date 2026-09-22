import axios from 'axios';
import { File } from 'node:buffer';

// Cheerio 1.2 usa undici, que espera esta API web global. Node 18 no la
// publica globalmente aunque sí la ofrece desde node:buffer.
if (!globalThis.File) globalThis.File = File;
const cheerio = await import('cheerio');

// WordPress expone una API pública con la imagen destacada ya vinculada al post.
// Es mucho más estable que depender exclusivamente de clases HTML del tema.
const SITE_URL = 'https://uniguajira.edu.co';
const POSTS_API_URL = `${SITE_URL}/wp-json/wp/v2/posts`;

const POSTS_PER_PAGE = clampNumber(process.env.SCRAPER_POSTS_PER_PAGE, 50, 1, 100);
const MAX_WP_PAGES = clampNumber(process.env.SCRAPER_MAX_PAGES, 2, 1, 20);
const MAX_DETAIL_REQUESTS = clampNumber(process.env.SCRAPER_MAX_DETAIL_REQUESTS, 30, 0, 100);
const DETAIL_CONCURRENCY = clampNumber(process.env.SCRAPER_DETAIL_CONCURRENCY, 4, 1, 8);
const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 20_000;

const REQUEST_HEADERS = {
  'User-Agent': 'UniGuajira-News/1.0 (+https://uniguajira.edu.co)',
  Accept: 'application/json,application/rss+xml,application/xml,text/html;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-CO,es;q=0.9',
};

const JUNK_TITLES = new Set([
  'skip to content', 'saltar al contenido', 'transparencia', 'normogramas',
  'gestión jurídica', 'gestion juridica', 'enlaces por normativa',
  'atención y servicios a la ciudadanía', 'atención al ciudadano', 'contacto',
  'inicio', 'menú principal', 'menu principal', 'portal de servicios',
  'política de tratamiento de datos', 'terms of use', 'privacy policy',
]);

function clampNumber(value, fallback, min, max) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, min), max) : fallback;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, config = {}) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await axios.get(url, {
        ...config,
        headers: { ...REQUEST_HEADERS, ...(config.headers || {}) },
        timeout: REQUEST_TIMEOUT_MS,
        maxRedirects: 5,
      });
    } catch (error) {
      const status = error.response?.status;
      const retryable = !status || status === 429 || status >= 500;
      if (!retryable || attempt === MAX_RETRIES) {
        console.error(`No se pudo consultar ${url}: ${error.message}`);
        return null;
      }
      await sleep(500 * (attempt + 1));
    }
  }
  return null;
}

function canonicalUrl(value, baseUrl = SITE_URL) {
  if (!value) return null;
  try {
    const url = new URL(value.trim(), baseUrl);
    url.hash = '';
    url.search = '';
    return url.toString();
  } catch {
    return null;
  }
}

function isArticleUrl(value) {
  const url = canonicalUrl(value);
  if (!url) return false;
  const parsed = new URL(url);
  if (parsed.hostname !== 'uniguajira.edu.co' || !parsed.pathname.startsWith('/actualidad/')) return false;
  return !/^\/actualidad\/(?:author|tag|page)(?:\/|$)/i.test(parsed.pathname);
}

function htmlToText(html = '') {
  return cheerio.load(`<div>${html}</div>`).text().replace(/\s+/g, ' ').trim();
}

function cleanTitle(value = '') {
  return htmlToText(value)
    .replace(/[\u{1F000}-\u{1FFFF}\u2600-\u27BF\u2300-\u23FF]/gu, '')
    .replace(/^(?:noticias|convocatorias|eventos|academia|actualidad)\s*[:\-–—]?\s*/i, '')
    .replace(/\s*[.…]+\s*\d{1,2}\s+\w+\s+\d{4}\s*$/i, '')
    .replace(/[.…]+$/, '')
    .trim();
}

function isJunkTitle(title) {
  const normalized = title.toLowerCase().trim();
  return normalized.length < 10 || JUNK_TITLES.has(normalized);
}

function formatDateForDatabase(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function getImageCandidate($image, baseUrl) {
  if (!$image?.length) return null;
  const raw = $image.attr('data-src') || $image.attr('data-lazy-src') || $image.attr('data-original') || $image.attr('src');
  return canonicalUrl(raw, baseUrl);
}

function imageFromHtml(html, baseUrl) {
  if (!html) return null;
  const $ = cheerio.load(html);
  const candidates = [];
  $('img, source').each((_, element) => {
    const candidate = getImageCandidate($(element), baseUrl);
    if (candidate) candidates.push(candidate);
  });

  // Evita que el logo global se convierta en la portada al usar un fallback.
  return candidates.find(url => !/(?:logo|favicon|icono?)(?:[-_.]|$)/i.test(url)) || candidates[0] || null;
}

function imageFromMedia(media) {
  if (!media) return null;
  const sizes = media.media_details?.sizes || {};
  const preferredSizes = ['large', 'medium_large', 'full', '1536x1536', 'medium'];
  for (const size of preferredSizes) {
    if (sizes[size]?.source_url) return canonicalUrl(sizes[size].source_url);
  }
  return canonicalUrl(media.source_url || media.guid?.rendered);
}

function imageFromYoast(post) {
  const yoastImage = post.yoast_head_json?.og_image?.[0];
  return canonicalUrl(yoastImage?.url || post.jetpack_featured_media_url);
}

function mapCategory(value) {
  const category = String(value || '').toLowerCase();
  if (/(admisi|matr[ií]cula|inscripci|aspirante)/.test(category)) return 'Admisiones';
  if (/(investigaci|ciencia|laboratorio)/.test(category)) return 'Investigación';
  if (/(extensi[oó]n|proyecci[oó]n social)/.test(category)) return 'Extensión';
  if (/(curso|academ|docente|pregrado|posgrado|educaci[oó]n continuada)/.test(category)) return 'Academia';
  if (/(evento|seminario|congreso|taller)/.test(category)) return 'Eventos';
  if (/(comunicado|circular|oficial|convocatoria|oferta laboral)/.test(category)) return 'Comunicados';
  return 'General';
}

function getPostTerms(post) {
  const groups = post._embedded?.['wp:term'];
  if (!Array.isArray(groups)) return '';
  return groups.flat().map(term => term?.name || term?.slug).filter(Boolean).join(', ');
}

function compactContent(html = '') {
  const $ = cheerio.load(html);
  $('script, style, nav, header, footer, aside, form').remove();
  return $.html().trim().slice(0, 3000);
}

function normalizeWordPressPost(post) {
  const sourceUrl = canonicalUrl(post.link);
  const title = cleanTitle(post.title?.rendered);
  if (!sourceUrl || !isArticleUrl(sourceUrl) || isJunkTitle(title)) return null;

  const content = post.content?.rendered || '';
  const description = htmlToText(post.excerpt?.rendered || content).slice(0, 500);
  const imageUrl = imageFromMedia(post._embedded?.['wp:featuredmedia']?.[0])
    || imageFromYoast(post)
    || imageFromHtml(content, sourceUrl);

  return {
    title,
    description,
    content: compactContent(content),
    source_url: sourceUrl,
    image_url: imageUrl,
    category: mapCategory(getPostTerms(post)),
    published_at: formatDateForDatabase(post.date_gmt ? `${post.date_gmt}Z` : post.date),
  };
}

async function fetchWordPressPosts() {
  const posts = [];
  for (let page = 1; page <= MAX_WP_PAGES; page += 1) {
    const response = await fetchWithRetry(POSTS_API_URL, {
      params: {
        page,
        per_page: POSTS_PER_PAGE,
        _embed: 1,
        _fields: 'link,date,date_gmt,title,excerpt,content,featured_media,_embedded,yoast_head_json,jetpack_featured_media_url',
      },
    });
    if (!response || !Array.isArray(response.data)) break;
    posts.push(...response.data);

    const totalPages = Number.parseInt(response.headers['x-wp-totalpages'], 10);
    if (response.data.length < POSTS_PER_PAGE || (Number.isFinite(totalPages) && page >= totalPages)) break;
  }
  return posts;
}

function parseRssItems(xml) {
  const $ = cheerio.load(xml, { xmlMode: true });
  const items = [];
  $('item').each((_, element) => {
    const item = $(element);
    const sourceUrl = canonicalUrl(item.children('link').first().text());
    const title = cleanTitle(item.children('title').first().text());
    if (!sourceUrl || !isArticleUrl(sourceUrl) || isJunkTitle(title)) return;

    const content = item.children().filter((__, child) => child.tagName === 'content:encoded').text();
    const description = htmlToText(item.children('description').first().text() || content).slice(0, 500);
    items.push({
      title,
      description,
      content: compactContent(content),
      source_url: sourceUrl,
      image_url: imageFromHtml(content, sourceUrl),
      category: mapCategory(item.children('category').first().text()),
      published_at: formatDateForDatabase(item.children('pubDate').first().text()),
    });
  });
  return items;
}

async function fetchRssFallback() {
  const response = await fetchWithRetry(`${SITE_URL}/feed/`);
  return response ? parseRssItems(response.data) : [];
}

function parseArchivePage(html, pageUrl) {
  const $ = cheerio.load(html);
  const articles = [];
  const addArticle = (container, titleLink, imageElement) => {
    const sourceUrl = canonicalUrl(titleLink.attr('href'), pageUrl);
    const title = cleanTitle(titleLink.text());
    if (!sourceUrl || !isArticleUrl(sourceUrl) || isJunkTitle(title)) return;
    const description = htmlToText(container.find('.entry-summary, .wp-block-latest-posts__post-excerpt').first().html() || '').slice(0, 500);
    const published = container.find('time[datetime]').first().attr('datetime');
    articles.push({
      title,
      description,
      content: '',
      source_url: sourceUrl,
      image_url: getImageCandidate(imageElement, pageUrl),
      category: mapCategory(container.find('.tags-links, .cat-links').text()),
      published_at: formatDateForDatabase(published),
    });
  };

  $('article').each((_, element) => {
    const article = $(element);
    addArticle(article, article.find('.entry-title a').first(), article.find('img').first());
  });
  $('li.wp-block-latest-posts__item').each((_, element) => {
    const item = $(element);
    addArticle(item, item.find('a.wp-block-latest-posts__post-title').first(), item.find('img').first());
  });
  return articles;
}

async function fetchHtmlFallback() {
  const collected = [];
  // Solo se usa cuando la API y el feed no entregan datos: no castiga al sitio en el caso normal.
  for (let page = 1; page <= 3; page += 1) {
    const url = page === 1 ? `${SITE_URL}/actualidad/` : `${SITE_URL}/actualidad/page/${page}/`;
    const response = await fetchWithRetry(url);
    if (response) collected.push(...parseArchivePage(response.data, url));
  }
  return collected;
}

function readJsonLd($) {
  const entities = [];
  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const parsed = JSON.parse($(element).contents().text());
      if (Array.isArray(parsed)) entities.push(...parsed);
      else if (Array.isArray(parsed?.['@graph'])) entities.push(...parsed['@graph']);
      else if (parsed) entities.push(parsed);
    } catch {
      // Un bloque JSON-LD inválido no debe descartar las demás fuentes.
    }
  });
  return entities;
}

function imageFromJsonLd(entities) {
  for (const entity of entities) {
    const types = Array.isArray(entity?.['@type']) ? entity['@type'] : [entity?.['@type']];
    if (!types.some(type => /article|newsarticle/i.test(type || ''))) continue;
    const image = Array.isArray(entity.image) ? entity.image[0] : entity.image;
    const candidate = typeof image === 'string' ? image : image?.url || image?.contentUrl;
    const url = canonicalUrl(candidate || entity.thumbnailUrl);
    if (url) return url;
  }
  return null;
}

async function fetchArticleImageFallback(item) {
  const response = await fetchWithRetry(item.source_url);
  if (!response) return item;
  const $ = cheerio.load(response.data);
  const jsonLd = readJsonLd($);
  const imageUrl = canonicalUrl($('meta[property="og:image"]').first().attr('content'), item.source_url)
    || canonicalUrl($('meta[name="twitter:image"], meta[property="twitter:image"]').first().attr('content'), item.source_url)
    || imageFromJsonLd(jsonLd)
    || getImageCandidate($('.featured-image img, .wp-post-image, [itemprop="image"] img').first(), item.source_url)
    || imageFromHtml($('.entry-content, article').first().html() || '', item.source_url);

  return { ...item, image_url: imageUrl || null };
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await mapper(items[current]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function mergeByUrl(items) {
  const merged = new Map();
  for (const item of items) {
    if (!item?.source_url) continue;
    const previous = merged.get(item.source_url);
    merged.set(item.source_url, {
      ...previous,
      ...item,
      // Nunca reemplazar una portada que sí existe con una respuesta sin portada.
      image_url: item.image_url || previous?.image_url || null,
      content: item.content || previous?.content || '',
      description: item.description || previous?.description || '',
    });
  }
  return [...merged.values()];
}

/**
 * Obtiene noticias recientes y devuelve un arreglo listo para guardar en cacheNews.
 * Orden de resiliencia: REST WordPress -> RSS -> HTML -> detalle de los casos sin imagen.
 */
export async function scrapeNews() {
  console.log(`Iniciando scraper UniGuajira (API WordPress: ${MAX_WP_PAGES} x ${POSTS_PER_PAGE})...`);

  let news = (await fetchWordPressPosts()).map(normalizeWordPressPost).filter(Boolean);
  console.log(`  API WordPress: ${news.length} noticias válidas`);

  // El RSS aporta contenido e imágenes si la API cambia o llega con campos incompletos.
  const rssItems = await fetchRssFallback();
  news = mergeByUrl([...news, ...rssItems]);
  console.log(`  RSS: ${rssItems.length} noticias válidas`);

  if (news.length === 0) {
    const htmlItems = await fetchHtmlFallback();
    news = mergeByUrl(htmlItems);
    console.log(`  HTML de respaldo: ${htmlItems.length} noticias válidas`);
  }

  const missingImage = news.filter(item => !item.image_url).slice(0, MAX_DETAIL_REQUESTS);
  if (missingImage.length > 0) {
    const enriched = await mapWithConcurrency(missingImage, DETAIL_CONCURRENCY, fetchArticleImageFallback);
    const resolved = new Map(enriched.map(item => [item.source_url, item]));
    news = news.map(item => resolved.get(item.source_url) || item);
  }

  const result = news
    .filter(item => item.title && !isJunkTitle(item.title) && isArticleUrl(item.source_url))
    .sort((a, b) => String(b.published_at || '').localeCompare(String(a.published_at || '')));

  console.log(`Scraper finalizado: ${result.length} noticias; ${result.filter(item => item.image_url).length} con portada.`);
  return result;
}
