import type { NewsResponse, NewsItem, User } from '../types';

const TOKEN_KEY = 'uniguajira_token';

function resolveApiBase(): string {
  const env = import.meta.env.VITE_API_URL as string | undefined;
  if (env) return env;
  // Ruta relativa: Vite proxea /api hacia localhost:3000
  // Funciona en localhost, red local y túnel cloudflared
  return '/api';
}

const API_BASE = resolveApiBase();

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || 'Credenciales inválidas');
  setToken(data.token);
  return data;
}

export async function register(nombre: string, email: string, password: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || 'Error al registrarse');
  setToken(data.token);
  return data;
}

export async function fetchMe(): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Sesión no válida');
  const data = await res.json();
  return data.user;
}

export { API_BASE };