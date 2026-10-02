import { X, Home, BookOpen, Heart, Beaker, Users, Megaphone, Globe, LayoutGrid } from 'lucide-react';

const categories = [
  { id: 'all', label: 'Todas', icon: Home },
  { id: 'Academia', label: 'Academia', icon: BookOpen },
  { id: 'Bienestar', label: 'Bienestar', icon: Heart },
  { id: 'Investigación', label: 'Investigación', icon: Beaker },
  { id: 'Extensión', label: 'Extensión', icon: Users },
  { id: 'Comunicados', label: 'Comunicados', icon: Megaphone },
  { id: 'Admisiones', label: 'Admisiones', icon: Globe },
  { id: 'General', label: 'General', icon: LayoutGrid },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function Sidebar({ isOpen, onClose, activeCategory, onSelectCategory }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-ink/35 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-20 lg:h-dvh lg:translate-x-0 lg:border-r lg:border-line lg:bg-white/45 lg:backdrop-blur-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5 lg:h-20">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
            Categorías
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar categorías"
            className="rounded-xl p-2 text-ink transition-colors hover:bg-accent-soft lg:hidden"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav className="space-y-1 p-3" aria-label="Filtrar por categoría">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/25'
                    : 'text-ink hover:bg-accent-soft hover:text-accent'
                }`}
              >
                <Icon size={17} aria-hidden="true" className={isActive ? 'text-white' : 'text-accent'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
