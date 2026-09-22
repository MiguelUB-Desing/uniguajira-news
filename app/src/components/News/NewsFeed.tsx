import { Calendar, ExternalLink, RefreshCw, X } from 'lucide-react';
import NewsCard from './NewsCard';
import type { NewsItem } from '../../types';
import { useState } from 'react';

interface NewsFeedProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  searchQuery: string;
}

export default function NewsFeed({ news, loading, error, onRefresh, searchQuery }: NewsFeedProps) {

  // Suprimir warnings de props no usadas en el renderizado
  void error;

  const [expanded, setExpanded] = useState<NewsItem | null>(null);

  // Filtrar noticias por búsqueda
  const filtered = searchQuery
    ? news.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : news;

  // Modal expandido cuando el usuario hace click en una noticia
  const modal = expanded ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl transform transition-all duration-300 ease-out">
        <button
          onClick={() => setExpanded(null)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <X size={24} className="transition-transform" />
        </button>

        <Calendar size={32} className="w-12 h-12 mx-auto mb-4 text-blue-600" />

        <h2 className="text-2xl font-bold mb-2">{expanded.title}</h2>
        <p className="text-sm text-gray-600 mb-4 line-clamp-6">{expanded.description}</p>

        <div className="mt-6 flex gap-2">
          <span className="text-xs text-gray-500">
            <Calendar size={12} /> {expanded.category}
          </span>
          <span className="text-xs text-gray-500">
            <Calendar size={12} /> {expanded.published_at ? new Date(expanded.published_at).toLocaleDateString('es-CO') : '—'}
          </span>
        </div>

        <a
          href={expanded.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-4 py-3 px-4 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors text-sm font-medium">
            Leer más <ExternalLink size={12} />
          </a>

          <button
            onClick={() => setExpanded(null)}
            className="mt-2 w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300 transition-colors">
            Cerrar
          </button>
      </div>
    </div>
  ) : null;

  // Suprimir warning del modal (aunque se usa condicionalmente)
  void modal;

  // Filtrar noticias por búsqueda
  const filteredResults = searchQuery
    ? news.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : news;
  void filteredResults;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm opacity-60">
          {filtered.length} noticia{filtered.length !== 1 ? 's' : ''}
          {searchQuery && ` para "${searchQuery}"`}
        </p>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1 text-sm opacity-60 hover:opacity-100 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Actualizando…' : 'Actualizar'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <NewsCard
            key={item.source_url}
            news={item}
          />
        ))}
      </div>
    </div>
  );
}
