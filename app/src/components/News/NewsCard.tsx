import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import type { NewsItem } from '../../types';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const date = new Date(news.published_at).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="group glass flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgb(194_65_12_0.35)]">
      {news.image_url && !imageFailed && (
        <div className="relative aspect-[16/9] overflow-hidden bg-accent-soft">
          <img
            src={news.image_url}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={() => setImageFailed(true)}
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          <span className="rounded-full bg-accent-soft px-2.5 py-1 font-medium uppercase tracking-[0.12em] text-accent">
            {news.category}
          </span>
          <time dateTime={news.published_at} className="text-ink-muted">
            {date}
          </time>
        </div>

        <h3 className="font-display text-[1.2rem] font-semibold leading-snug tracking-tight text-ink text-balance-tight transition-colors group-hover:text-accent">
          {news.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
          {news.description}
        </p>

        <div className="mt-auto pt-4">
          <a
            href={news.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Leer más
            <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only">: {news.title} (se abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
    </article>
  );
}
