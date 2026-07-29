import { useTheme } from '../../context/ThemeContext';
import { X, Home, BookOpen, Heart, Beaker, Users, Megaphone, Globe, Search } from 'lucide-react';

const categories = [
  { id: 'all', label: 'Todas', icon: Home },
  { id: 'Academia', label: 'Academia', icon: BookOpen },
  { id: 'Bienestar', label: 'Bienestar', icon: Heart },
  { id: 'Investigación', label: 'Investigación', icon: Beaker },
  { id: 'Extensión', label: 'Extensión', icon: Users },
  { id: 'Comunicados', label: 'Comunicados', icon: Megaphone },
  { id: 'Admisiones', label: 'Admisiones', icon: Globe },
  { id: 'General', label: 'General', icon: Search },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function Sidebar({ isOpen, onClose, activeCategory, onSelectCategory }: SidebarProps) {
  const { sidebarClass } = useTheme();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-50
          transform transition-transform duration-300 ease-in-out
          border-r ${sidebarClass}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'inherit' }}>
          <h2 className="font-bold text-lg">Categorías</h2>
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-black/20">
            <X size={20} />
          </button>
        </div>
        <nav className="p-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { onSelectCategory(cat.id); onClose(); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left
                  transition-colors
                  ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-black/10'
                  }
                `}
              >
                <Icon size={18} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
