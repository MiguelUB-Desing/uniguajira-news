import { useEffect, useState } from 'react';
import NewsFeed from '../components/News/NewsFeed';
import { fetchNews, refreshNews } from '../services/api';
import type { NewsItem } from '../types';
import Layout from '../components/Layout/Layout';

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
    } catch (err) {
      setError('Error al cargar noticias. Verifica la conexión con el servidor.');
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
    } catch (err) {
      setError('Error al actualizar noticias.');
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
