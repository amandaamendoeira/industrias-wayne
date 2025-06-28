import React, { useState } from 'react';
import { Search, Moon, Sun, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSearch } from '../../contexts/SearchContext';
import { NotificationDropdown } from './NotificationDropdown';
import { SearchDropdown } from './SearchDropdown';

interface HeaderProps {
  title: string;
  onPageChange?: (page: string) => void;
}

export function Header({ title, onPageChange }: HeaderProps) {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { searchTerm, setSearchTerm } = useSearch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleLanguage = () => {
    const newLanguage = language === 'pt-BR' ? 'en-US' : 'pt-BR';
    setLanguage(newLanguage);
  };

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleNavigate = (page: string, data?: any) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 transition-colors">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleSearchFocus}
                placeholder={t('common.search')}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all focus:w-80"
              />
            </div>
            
            <SearchDropdown
              isOpen={isSearchOpen}
              onClose={handleSearchClose}
              onNavigate={handleNavigate}
            />
          </div>
          
          <NotificationDropdown />
          
          <button
            onClick={toggleLanguage}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={language === 'pt-BR' ? 'Switch to English' : 'Mudar para Português'}
          >
            <Globe size={20} />
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-medium text-sm">
                {user?.nome.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.nome}</span>
          </div>
        </div>
      </div>
    </header>
  );
}