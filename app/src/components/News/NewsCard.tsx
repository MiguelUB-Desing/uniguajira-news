import { useState } from 'react';
import { Calendar, ExternalLink, ImageOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { NewsItem } from '../../types';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const { cardClass } = useTheme();
  const [imgError, setImgError] = useState(false);

  const date = new Date(news.published_at).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className={`rounded-xl border p-4 transition-all duration-200 ${cardClass}`}>
      {news.image_url && !imgError && (
        <div className="relative w-full h-40 sm:h-48 rounded-lg overflow-hidden mb-3">
          <img
            src={news.image_url}
            alt={news.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </div>
      )}
      {imgError && (
        <div className="flex items-center justify-center w-full h-40 sm:h-48 rounded-lg mb-3 bg-black/10">
          <ImageOff size={32} className="opacity-40" />
        </div>
      )}
      <div className="flex items-center gap-2 text-xs opacity-60 mb-2">
        <Calendar size={12} />
        <span>{date}</span>
        <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-medium">
          {news.category}
        </span>
      </div>
      <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">{news.title}</h3>
      <p className="text-xs sm:text-sm opacity-70 line-clamp-3 mb-3">{news.description}</p>
      <a
        href={news.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
      >
        Leer más <ExternalLink size={12} />
      </a>
    </article>
  );
}
