import React, { useRef, useEffect } from 'react';
import { Search, User, Package, Shield, Activity, X, Loader2 } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, data?: any) => void;
}

const typeIcons = {
  user: User,
  resource: Package,
  security: Shield,
  activity: Activity
};

const typeColors = {
  user: 'text-blue-500',
  resource: 'text-green-500',
  security: 'text-red-500',
  activity: 'text-purple-500'
};

const typeLabels = {
  user: 'Usuário',
  resource: 'Recurso',
  security: 'Segurança',
  activity: 'Atividade'
};

const typePages = {
  user: 'usuarios',
  resource: 'recursos',
  security: 'seguranca',
  activity: 'dashboard'
};

export function SearchDropdown({ isOpen, onClose, onNavigate }: SearchDropdownProps) {
  const { searchTerm, setSearchTerm, searchResults, isSearching, clearSearch } = useSearch();
  const { t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleResultClick = (result: any) => {
    const page = typePages[result.type];
    onNavigate(page, result.data);
    onClose();
    clearSearch();
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
      <div ref={dropdownRef}>
        {/* Header da busca */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuários, recursos, áreas de segurança..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Resultados da busca */}
        <div className="max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="p-6 text-center">
              <Loader2 className="animate-spin mx-auto mb-3 text-yellow-500" size={24} />
              <p className="text-gray-500 dark:text-gray-400">Buscando...</p>
            </div>
          ) : searchTerm && searchResults.length === 0 ? (
            <div className="p-6 text-center">
              <Search className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum resultado encontrado para "{searchTerm}"
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Tente buscar por usuários, recursos, áreas de segurança ou atividades
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((result) => {
                const Icon = typeIcons[result.type];
                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left flex items-center space-x-3"
                  >
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${typeColors[result.type]}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {result.title}
                        </h4>
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-xs rounded-full text-gray-600 dark:text-gray-400">
                          {typeLabels[result.type]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {result.subtitle}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                        {result.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : !searchTerm ? (
            <div className="p-6 text-center">
              <Search className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="text-gray-500 dark:text-gray-400">
                Digite algo para começar a buscar
              </p>
              <div className="mt-4 space-y-2 text-sm text-gray-400 dark:text-gray-500">
                <p>• Usuários: nomes, emails, cargos</p>
                <p>• Recursos: equipamentos, veículos, sistemas</p>
                <p>• Segurança: áreas restritas, níveis de acesso</p>
                <p>• Atividades: logs do sistema</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer com dicas */}
        {searchResults.length > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''} • Clique em um item para navegar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}