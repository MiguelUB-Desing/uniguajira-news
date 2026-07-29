import { useState, type ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Layout({ children, activeCategory, onSelectCategory, searchQuery, onSearchChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { themeClass } = useTheme();

  return (
    <div className={`min-h-screen flex ${themeClass} transition-colors duration-300`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeCategory={activeCategory}
        onSelectCategory={onSelectCategory}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
