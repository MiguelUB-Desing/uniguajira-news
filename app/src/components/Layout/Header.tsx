import { Menu, Search, Newspaper } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({ onToggleSidebar, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 glass border-x-0 border-t-0 rounded-none">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Abrir categorías"
          className="rounded-xl p-2.5 text-ink transition-colors hover:bg-accent-soft lg:hidden"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <a href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-sm shadow-accent/30">
            <Newspaper size={18} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-semibold leading-none tracking-tight text-ink">
              UniGuajira News
            </span>
            <span className="mt-0.5 hidden text-[11px] font-medium uppercase tracking-[0.14em] text-accent sm:block">
              Universidad de La Guajira
            </span>
          </span>
        </a>

        <div className="relative ml-auto hidden w-full max-w-md sm:block">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            placeholder="Buscar noticias…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-line bg-white/70 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/80 transition-all outline-none focus:border-accent-bright focus:bg-white focus:ring-2 focus:ring-accent-mid"
          />
        </div>
      </div>

      <div className="px-4 pb-3 sm:hidden">
        <div className="relative">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            placeholder="Buscar noticias…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-line bg-white/70 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/80 outline-none focus:border-accent-bright focus:ring-2 focus:ring-accent-mid"
          />
        </div>
      </div>
    </header>
  );
}
