export interface NewsItem {
  id: number;
  title: string;
  description: string;
  content: string | null;
  source_url: string;
  image_url: string | null;
  category: string;
  published_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'lector';
}

export type ThemeMode = 'oscuro' | 'atardecer' | 'amanecer' | 'claro';

export interface NewsResponse {
  source: 'cache' | 'scraped';
  data: NewsItem[];
  count?: number;
}
