import { RefreshCw, AlertCircle, Newspaper } from 'lucide-react';
import NewsCard from './NewsCard';
import type { NewsItem } from '../../types';

interface NewsFeedProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  searchQuery: string;
}

export default function NewsFeed({ news, loading, error, onRefresh, searchQuery }: NewsFeedProps) {

  const filtered = searchQuery
    ? news.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : news;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <RefreshCw size={40} className="animate-spin opacity-40" />
        <p className="opacity-60">Cargando noticias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Newspaper size={40} className="opacity-40" />
        <p className="opacity-60">
          {searchQuery ? 'Sin resultados para tu búsqueda' : 'No hay noticias disponibles'}
        </p>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm opacity-60">
          {filtered.length} noticia{filtered.length !== 1 ? 's' : ''}
          {searchQuery && ` para "${searchQuery}"`}
        </p>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1 text-sm opacity-60 hover:opacity-100 transition-opacity"
        >
          <RefreshCw size={14} />
          Actualizar
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <NewsCard key={item.id || item.source_url} news={item} />
        ))}
      </div>
    </div>
  );
}
