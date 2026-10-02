import { ArrowUpRight, Calendar, RefreshCw, Tag, X, SearchX, TriangleAlert } from 'lucide-react';
import NewsCard from './NewsCard';
import type { NewsItem } from '../../types';
import { useEffect, useState } from 'react';

interface NewsFeedProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  searchQuery: string;
}

function SkeletonCard() {
  return (
    <div className="glass animate-pulse overflow-hidden rounded-3xl" aria-hidden="true">
      <div className="aspect-[16/9] bg-accent-soft/70" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 rounded-full bg-accent-mid/70" />
        <div className="h-4 w-full rounded bg-accent-soft" />
        <div className="h-4 w-4/5 rounded bg-accent-soft" />
        <div className="h-3 w-full rounded bg-accent-soft/70" />
        <div className="h-9 w-28 rounded-full bg-accent-mid/50" />
      </div>
    </div>
  );
}

export default function NewsFeed({ news, loading, error, onRefresh, searchQuery }: NewsFeedProps) {
  const [expanded, setExpanded] = useState<NewsItem | null>(null);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [expanded]);

  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? news.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      )
    : news;

  const countLabel = `${filtered.length} noticia${filtered.length !== 1 ? 's' : ''}`;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {q ? 'Resultados' : 'Últimas noticias'}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {countLabel}
            {searchQuery && ` para “${searchQuery}”`}
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-2 text-sm font-medium text-accent transition-all hover:border-accent-bright hover:bg-white hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={15} aria-hidden="true" className={loading ? 'animate-spin' : ''} />
          {loading ? 'Actualizando…' : 'Actualizar'}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-2xl border border-accent-bright/40 bg-accent-soft/80 px-4 py-3.5 text-sm text-accent"
        >
          <TriangleAlert size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading && news.length === 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="glass flex flex-col items-center rounded-3xl px-6 py-16 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <SearchX size={26} aria-hidden="true" />
          </span>
          <h3 className="font-display text-xl font-semibold text-ink">Sin resultados</h3>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-muted">
            {searchQuery
              ? 'No encontramos noticias que coincidan con tu búsqueda. Prueba con otras palabras.'
              : 'Aún no hay noticias en esta categoría. Actualiza o vuelve más tarde.'}
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <NewsCard key={item.source_url} news={item} />
          ))}
        </div>
      )}

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-modal-title"
        >
          <button
            type="button"
            aria-label="Cerrar vista de noticia"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setExpanded(null)}
          />
          <div className="glass-strong relative max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-3xl p-6 sm:p-7">
            <button
              type="button"
              onClick={() => setExpanded(null)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover"
            >
              <X size={18} aria-hidden="true" />
            </button>

            {expanded.image_url && (
              <div className="mb-5 aspect-[16/9] overflow-hidden rounded-2xl bg-accent-soft">
                <img
                  src={expanded.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="mb-3 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 font-medium uppercase tracking-wider text-accent">
                <Tag size={11} aria-hidden="true" />
                {expanded.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/60 px-2.5 py-1 text-ink-muted">
                <Calendar size={11} aria-hidden="true" />
                {expanded.published_at
                  ? new Date(expanded.published_at).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '—'}
              </span>
            </div>

            <h2
              id="news-modal-title"
              className="font-display text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-[1.65rem]"
            >
              {expanded.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{expanded.description}</p>

            <a
              href={expanded.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Leer más
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => setExpanded(null)}
              className="mt-2 w-full rounded-2xl border border-line bg-white/60 py-3 text-sm font-medium text-ink transition-colors hover:bg-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
