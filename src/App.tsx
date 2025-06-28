import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TimezoneProvider } from './contexts/TimezoneContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SearchProvider } from './contexts/SearchContext';
import { LoginForm } from './components/Login/LoginForm';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Security } from './pages/Security';
import { Resources } from './pages/Resources';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';
import { useLanguage } from './contexts/LanguageContext';

const pageComponents = {
  dashboard: Dashboard,
  seguranca: Security,
  recursos: Resources,
  usuarios: Users,
  configuracoes: Settings
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const pageTitles = {
    dashboard: t('dashboard.title'),
    seguranca: t('security.title'),
    recursos: t('resources.title'),
    usuarios: t('users.title'),
    configuracoes: t('settings.title')
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const PageComponent = pageComponents[currentPage as keyof typeof pageComponents];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={pageTitles[currentPage as keyof typeof pageTitles]} 
          onPageChange={setCurrentPage}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <PageComponent />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TimezoneProvider>
        <LanguageProvider>
          <NotificationProvider>
            <SearchProvider>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </SearchProvider>
          </NotificationProvider>
        </LanguageProvider>
      </TimezoneProvider>
    </ThemeProvider>
  );
}

export default App;