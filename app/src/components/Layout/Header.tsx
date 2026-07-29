import { Menu, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { ThemeMode } from '../../types';

const themeIcons: Record<ThemeMode, typeof Sun> = {
  oscuro: Moon,
  atardecer: Moon,
  amanecer: Sun,
  claro: Sun,
};

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({ onToggleSidebar, searchQuery, onSearchChange }: HeaderProps) {
  const { theme, cycleTheme } = useTheme();
  const ThemeIcon = themeIcons[theme];

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-inherit border-b" style={{ borderColor: 'inherit' }}>
      <div className="flex items-center gap-3 px-4 h-14">
        <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-black/10">
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <img src="/vite.svg" alt="UniGuajira" className="w-7 h-7 hidden sm:block" />
          <h1 className="font-bold text-sm sm:text-base truncate">
            UniGuajira News
          </h1>
        </div>

        <div className="relative flex-1 max-w-md mx-2 hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Buscar noticias..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-black/10 dark:bg-white/10 border border-transparent focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <button
          onClick={cycleTheme}
          className="p-2 rounded-lg hover:bg-black/10 transition-colors"
          title={`Tema: ${theme}`}
        >
          <ThemeIcon size={20} />
        </button>
      </div>

      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Buscar noticias..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-black/10 dark:bg-white/10 border border-transparent focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>
    </header>
  );
}
