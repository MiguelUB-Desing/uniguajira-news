import type { NewsResponse, NewsItem } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchNews(category?: string): Promise<NewsItem[]> {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.set('category', category);
  params.set('limit', '50');

  const res = await fetch(`${API_BASE}/news?${params}`);
  if (!res.ok) throw new Error('Error al obtener noticias');
  const data: NewsResponse = await res.json();
  return data.data;
}

export async function refreshNews(): Promise<NewsItem[]> {
  const res = await fetch(`${API_BASE}/news/refresh`, { method: 'POST' });
  if (!res.ok) throw new Error('Error al refrescar noticias');
  const data: NewsResponse = await res.json();
  return data.data;
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/news/categories`);
  if (!res.ok) return ['General'];
  const cats: string[] = await res.json();
  return cats.length > 0 ? cats : ['General'];
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Credenciales inválidas');
  return res.json();
}

export async function register(nombre: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password }),
  });
  if (!res.ok) throw new Error('Error al registrarse');
  return res.json();
}
