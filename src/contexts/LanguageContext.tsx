import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  'pt-BR': {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.security': 'Segurança',
    'nav.resources': 'Recursos',
    'nav.users': 'Usuários',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalUsers': 'Total de Usuários',
    'dashboard.activeUsers': 'Usuários Ativos',
    'dashboard.totalResources': 'Recursos Totais',
    'dashboard.availableResources': 'Recursos Disponíveis',
    'dashboard.securityAreas': 'Áreas de Segurança',
    'dashboard.activeAlerts': 'Alertas Ativos',
    'dashboard.recentActivities': 'Atividades Recentes',
    'dashboard.systemStatus': 'Status do Sistema',
    'dashboard.mainServer': 'Servidor Principal',
    'dashboard.securitySystem': 'Sistema de Segurança',
    'dashboard.backup': 'Backup',
    'dashboard.lastSync': 'Última Sincronização',
    
    // Security
    'security.title': 'Controle de Segurança',
    'security.subtitle': 'Gerencie áreas restritas e controle de acesso',
    'security.newArea': 'Nova Área',
    'security.searchAreas': 'Buscar áreas de segurança...',
    'security.allLevels': 'Todos os Níveis',
    'security.lowLevel': 'Nível Baixo',
    'security.mediumLevel': 'Nível Médio',
    'security.highLevel': 'Nível Alto',
    'security.restricted': 'Restrito',
    'security.viewDetails': 'Ver Detalhes',
    'security.lastInspection': 'Última vistoria',
    'security.usersWithAccess': 'usuários com acesso',
    
    // Resources
    'resources.title': 'Gestão de Recursos',
    'resources.subtitle': 'Gerencie equipamentos, veículos e sistemas de segurança',
    'resources.newResource': 'Novo Recurso',
    'resources.searchResources': 'Buscar recursos...',
    'resources.allCategories': 'Todas as Categorias',
    'resources.equipment': 'Equipamentos',
    'resources.vehicles': 'Veículos',
    'resources.security': 'Segurança',
    'resources.edit': 'Editar',
    'resources.delete': 'Excluir',
    'resources.acquiredOn': 'Adquirido em',
    
    // Users
    'users.title': 'Gerenciamento de Usuários',
    'users.subtitle': 'Controle usuários e permissões de acesso',
    'users.newUser': 'Novo Usuário',
    'users.searchUsers': 'Buscar usuários...',
    'users.allLevels': 'Todos os Níveis',
    'users.administrators': 'Administradores',
    'users.managers': 'Gerentes',
    'users.employees': 'Funcionários',
    'users.user': 'Usuário',
    'users.position': 'Cargo',
    'users.level': 'Nível',
    'users.status': 'Status',
    'users.lastAccess': 'Último Acesso',
    'users.actions': 'Ações',
    'users.active': 'Ativo',
    'users.inactive': 'Inativo',
    
    // Settings
    'settings.title': 'Configurações do Sistema',
    'settings.subtitle': 'Gerencie as configurações de segurança e preferências',
    'settings.notifications': 'Notificações',
    'settings.security': 'Segurança',
    'settings.system': 'Sistema',
    'settings.backup': 'Backup & Dados',
    'settings.save': 'Salvar Configurações',
    'settings.language': 'Idioma',
    'settings.saveSuccess': 'Configurações salvas com sucesso!',
    
    // Login
    'login.title': 'Wayne Industries',
    'login.subtitle': 'Sistema de Gerenciamento Interno',
    'login.email': 'Email',
    'login.password': 'Senha',
    'login.login': 'Entrar',
    'login.logging': 'Entrando...',
    'login.testCredentials': 'Credenciais de Teste:',
    
    // Common
    'common.search': 'Buscar...',
    'common.online': 'Online',
    'common.active': 'Ativo',
    'common.inProgress': 'Em Andamento',
    'common.available': 'Disponível',
    'common.inUse': 'Em Uso',
    'common.maintenance': 'Manutenção',
    'common.inactive': 'Inativo',
    'common.stable': 'Estável',
    'common.allActive': 'Todas ativas',
    
    // Notifications
    'notifications.title': 'Notificações',
    'notifications.markAllRead': 'Marcar todas como lidas',
    'notifications.noNotifications': 'Nenhuma notificação',
  },
  'en-US': {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.security': 'Security',
    'nav.resources': 'Resources',
    'nav.users': 'Users',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalUsers': 'Total Users',
    'dashboard.activeUsers': 'Active Users',
    'dashboard.totalResources': 'Total Resources',
    'dashboard.availableResources': 'Available Resources',
    'dashboard.securityAreas': 'Security Areas',
    'dashboard.activeAlerts': 'Active Alerts',
    'dashboard.recentActivities': 'Recent Activities',
    'dashboard.systemStatus': 'System Status',
    'dashboard.mainServer': 'Main Server',
    'dashboard.securitySystem': 'Security System',
    'dashboard.backup': 'Backup',
    'dashboard.lastSync': 'Last Sync',
    
    // Security
    'security.title': 'Security Control',
    'security.subtitle': 'Manage restricted areas and access control',
    'security.newArea': 'New Area',
    'security.searchAreas': 'Search security areas...',
    'security.allLevels': 'All Levels',
    'security.lowLevel': 'Low Level',
    'security.mediumLevel': 'Medium Level',
    'security.highLevel': 'High Level',
    'security.restricted': 'Restricted',
    'security.viewDetails': 'View Details',
    'security.lastInspection': 'Last inspection',
    'security.usersWithAccess': 'users with access',
    
    // Resources
    'resources.title': 'Resource Management',
    'resources.subtitle': 'Manage equipment, vehicles and security systems',
    'resources.newResource': 'New Resource',
    'resources.searchResources': 'Search resources...',
    'resources.allCategories': 'All Categories',
    'resources.equipment': 'Equipment',
    'resources.vehicles': 'Vehicles',
    'resources.security': 'Security',
    'resources.edit': 'Edit',
    'resources.delete': 'Delete',
    'resources.acquiredOn': 'Acquired on',
    
    // Users
    'users.title': 'User Management',
    'users.subtitle': 'Control users and access permissions',
    'users.newUser': 'New User',
    'users.searchUsers': 'Search users...',
    'users.allLevels': 'All Levels',
    'users.administrators': 'Administrators',
    'users.managers': 'Managers',
    'users.employees': 'Employees',
    'users.user': 'User',
    'users.position': 'Position',
    'users.level': 'Level',
    'users.status': 'Status',
    'users.lastAccess': 'Last Access',
    'users.actions': 'Actions',
    'users.active': 'Active',
    'users.inactive': 'Inactive',
    
    // Settings
    'settings.title': 'System Settings',
    'settings.subtitle': 'Manage security settings and preferences',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',
    'settings.system': 'System',
    'settings.backup': 'Backup & Data',
    'settings.save': 'Save Settings',
    'settings.language': 'Language',
    'settings.saveSuccess': 'Settings saved successfully!',
    
    // Login
    'login.title': 'Wayne Industries',
    'login.subtitle': 'Internal Management System',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.login': 'Login',
    'login.logging': 'Logging in...',
    'login.testCredentials': 'Test Credentials:',
    
    // Common
    'common.search': 'Search...',
    'common.online': 'Online',
    'common.active': 'Active',
    'common.inProgress': 'In Progress',
    'common.available': 'Available',
    'common.inUse': 'In Use',
    'common.maintenance': 'Maintenance',
    'common.inactive': 'Inactive',
    'common.stable': 'Stable',
    'common.allActive': 'All active',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Mark all as read',
    'notifications.noNotifications': 'No notifications',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('pt-BR');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('wayne-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('wayne-language', lang);
  };

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations['pt-BR']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}