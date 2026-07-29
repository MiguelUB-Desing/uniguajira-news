import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ThemeMode } from '../types';

const themes: Record<ThemeMode, { label: string; icon: string; next: ThemeMode }> = {
  oscuro: { label: 'Oscuro', icon: '🌙', next: 'atardecer' },
  atardecer: { label: 'Atardecer', icon: '🌆', next: 'amanecer' },
  amanecer: { label: 'Amanecer', icon: '🌅', next: 'claro' },
  claro: { label: 'Claro', icon: '☀️', next: 'oscuro' },
};

const themeClasses: Record<ThemeMode, string> = {
  oscuro: 'bg-gray-950 text-gray-100',
  atardecer: 'bg-orange-950 text-orange-100',
  amanecer: 'bg-yellow-50 text-yellow-900',
  claro: 'bg-white text-gray-900',
};

const sidebarClasses: Record<ThemeMode, string> = {
  oscuro: 'bg-gray-900 border-gray-800',
  atardecer: 'bg-orange-900 border-orange-800',
  amanecer: 'bg-yellow-100 border-yellow-200',
  claro: 'bg-gray-100 border-gray-200',
};

const cardClasses: Record<ThemeMode, string> = {
  oscuro: 'bg-gray-800 hover:bg-gray-700 border-gray-700',
  atardecer: 'bg-orange-800 hover:bg-orange-700 border-orange-700',
  amanecer: 'bg-white hover:bg-yellow-50 border-yellow-200',
  claro: 'bg-white hover:bg-gray-50 border-gray-200',
};

interface ThemeContextType {
  theme: ThemeMode;
  themeClass: string;
  sidebarClass: string;
  cardClass: string;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as ThemeMode) || 'oscuro';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const cycleTheme = () => setTheme(themes[theme].next);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeClass: themeClasses[theme],
        sidebarClass: sidebarClasses[theme],
        cardClass: cardClasses[theme],
        cycleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}
