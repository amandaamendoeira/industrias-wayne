import React from 'react';
import { 
  Home, 
  Shield, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: Home, permission: 'funcionario' },
  { id: 'seguranca', labelKey: 'nav.security', icon: Shield, permission: 'gerente' },
  { id: 'recursos', labelKey: 'nav.resources', icon: Package, permission: 'funcionario' },
  { id: 'usuarios', labelKey: 'nav.users', icon: Users, permission: 'admin' },
  { id: 'configuracoes', labelKey: 'nav.settings', icon: Settings, permission: 'admin' },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { user, logout, hasPermission } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="w-64 bg-gray-900 dark:bg-gray-950 text-white h-full flex flex-col transition-colors">
      <div className="p-6 border-b border-gray-700 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xl">W</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Wayne Industries</h1>
            <p className="text-sm text-gray-400">Sistema de Gerenciamento</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          if (!hasPermission(item.permission)) return null;
          
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-yellow-500 text-black' 
                  : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon size={20} />
                <span className="font-medium">{t(item.labelKey)}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700 dark:border-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-700 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.nome.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.nome}</p>
            <p className="text-xs text-gray-400">{user?.cargo}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  );
}