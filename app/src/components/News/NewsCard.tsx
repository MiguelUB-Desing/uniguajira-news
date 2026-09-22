import { ExternalLink } from 'lucide-react';
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
    <article className="group rounded-2xl border p-4 transition-all hover:shadow-sm hover:border-accent/30 cursor-pointer">
      {news.image_url && !imageFailed && (
        <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-muted/30">
          <img
            src={news.image_url}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-start gap-2 pt-2 border-t border-border/20">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {news.category}
        </span>
        <span className="text-sm text-text fg sm:mt-0 sm:ml-auto">
          {date}
        </span>
      </div>
      <h3 className="font-medium text-lg sm:text-xl leading-tight line-clamp-2 hover:text-accent transition-colors">
        {news.title}
      </h3>
      <p className="text-sm text-text/60 line-clamp-3 mb-3">
        {news.description}
      </p>
      <a
        href={news.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
        <ExternalLink size={12} /> Leer más
      </a>
    </article>
  );
}
