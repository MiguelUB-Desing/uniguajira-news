import { useEffect, useState } from 'react';
import NewsFeed from '../components/News/NewsFeed';
import { fetchNews, refreshNews } from '../services/api';
import Layout from '../components/Layout/Layout';
import type { NewsItem } from '../types';

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadNews = async (category?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNews(category);
      setNews(data);
    } catch {
      setError('No pudimos cargar las noticias. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await refreshNews();
      setNews(data);
    } catch {
      setError('No se pudieron actualizar las noticias. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(activeCategory === 'all' ? undefined : activeCategory);
  }, [activeCategory]);

  return (
    <Layout
      activeCategory={activeCategory}
      onSelectCategory={setActiveCategory}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <NewsFeed
        news={news}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        searchQuery={searchQuery}
      />
    </Layout>
  );
}
