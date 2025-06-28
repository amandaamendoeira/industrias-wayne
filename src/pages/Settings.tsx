import React, { useState } from 'react';
import { Save, Shield, Database, Bell, Globe, Lock, Download, RotateCcw, Clock, Palette } from 'lucide-react';
import { BackupModal } from '../components/Settings/BackupModal';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTimezone, timezoneOptions } from '../contexts/TimezoneContext';
import { useNotifications } from '../contexts/NotificationContext';
import { generateBackupData, downloadBackup, BackupData } from '../utils/backupUtils';

export function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { timezone, setTimezone, getCurrentTime } = useTimezone();
  const { addNotification } = useNotifications();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      desktop: true,
      security: true,
      resources: false
    },
    security: {
      twoFactor: true,
      sessionTimeout: 30,
      passwordPolicy: 'strong'
    },
    system: {
      language: language,
      timezone: timezone,
      theme: theme
    }
  });

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  const handleSave = () => {
    // Aplicar mudança de idioma se foi alterado
    if (settings.system.language !== language) {
      setLanguage(settings.system.language);
    }
    
    // Aplicar mudança de tema se foi alterado
    if (settings.system.theme !== theme) {
      setTheme(settings.system.theme);
    }
    
    // Aplicar mudança de fuso horário se foi alterado
    if (settings.system.timezone !== timezone) {
      setTimezone(settings.system.timezone);
    }
    
    addNotification({
      title: 'Configurações Salvas',
      message: t('settings.saveSuccess') || 'Configurações salvas com sucesso!',
      type: 'success'
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setSettings({
      ...settings,
      system: { ...settings.system, language: newLanguage }
    });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setSettings({
      ...settings,
      system: { ...settings.system, theme: newTheme }
    });
  };

  const handleTimezoneChange = (newTimezone: string) => {
    setSettings({
      ...settings,
      system: { ...settings.system, timezone: newTimezone }
    });
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    
    try {
      // Simular processo de criação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerar dados do backup
      const backupData = generateBackupData();
      
      // Fazer download do arquivo
      downloadBackup(backupData);
      
      addNotification({
        title: 'Backup Criado com Sucesso',
        message: 'O arquivo de backup foi gerado e baixado automaticamente. Guarde-o em local seguro.',
        type: 'success'
      });
      
    } catch (error) {
      addNotification({
        title: 'Erro ao Criar Backup',
        message: 'Ocorreu um erro durante a criação do backup. Tente novamente.',
        type: 'error'
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleRestoreBackup = (backupData: BackupData) => {
    // Aqui você implementaria a lógica real de restauração
    console.log('Aplicando dados do backup:', backupData);
    
    addNotification({
      title: 'Sistema Será Reiniciado',
      message: 'O backup foi aplicado. O sistema será recarregado em alguns segundos.',
      type: 'info'
    });
  };

  const getThemeLabel = (themeValue: string) => {
    switch (themeValue) {
      case 'light': return 'Claro';
      case 'dark': return 'Escuro';
      case 'auto': return 'Automático (Sistema)';
      default: return 'Escuro';
    }
  };

  const hasChanges = 
    settings.system.language !== language ||
    settings.system.theme !== theme ||
    settings.system.timezone !== timezone;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t('settings.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notificações */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="text-yellow-500" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.notifications')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Notificações por email</span>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, email: e.target.checked }
                })}
                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Notificações desktop</span>
              <input
                type="checkbox"
                checked={settings.notifications.desktop}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, desktop: e.target.checked }
                })}
                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Alertas de segurança</span>
              <input
                type="checkbox"
                checked={settings.notifications.security}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, security: e.target.checked }
                })}
                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Atualizações de recursos</span>
              <input
                type="checkbox"
                checked={settings.notifications.resources}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, resources: e.target.checked }
                })}
                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="text-yellow-500" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.security')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Autenticação em dois fatores</span>
              <input
                type="checkbox"
                checked={settings.security.twoFactor}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, twoFactor: e.target.checked }
                })}
                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Timeout da sessão (minutos)
              </label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Política de senhas
              </label>
              <select
                value={settings.security.passwordPolicy}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, passwordPolicy: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="basic">Básica</option>
                <option value="medium">Média</option>
                <option value="strong">Forte</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sistema */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="text-yellow-500" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.system')}</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.language') || 'Idioma'}
              </label>
              <select
                value={settings.system.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
              </select>
              {settings.system.language !== language && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  {language === 'pt-BR' 
                    ? 'Clique em "Salvar Configurações" para aplicar a mudança de idioma'
                    : 'Click "Save Settings" to apply language change'
                  }
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Clock size={16} className="mr-2" />
                Fuso horário
              </label>
              <select
                value={settings.system.timezone}
                onChange={(e) => handleTimezoneChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Object.entries(timezoneOptions).map(([key, option]) => (
                  <option key={key} value={key}>
                    {option.name}
                  </option>
                ))}
              </select>
              {settings.system.timezone !== timezone && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  Clique em "Salvar Configurações" para aplicar o novo fuso horário
                </p>
              )}
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                <strong>Horário atual:</strong> {getCurrentTime()}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Palette size={16} className="mr-2" />
                Tema
              </label>
              <select
                value={settings.system.theme}
                onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'auto')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="auto">Automático (Sistema)</option>
              </select>
              {settings.system.theme !== theme && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  Clique em "Salvar Configurações" para aplicar o novo tema
                </p>
              )}
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                <strong>Tema atual:</strong> {getThemeLabel(theme)}
              </div>
            </div>
          </div>
        </div>

        {/* Backup & Dados */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="text-yellow-500" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.backup')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Último backup</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">15/01/2024 às 02:30</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Backup automático executado com sucesso
              </p>
            </div>
            
            <button 
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="w-full py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 font-medium"
            >
              {isCreatingBackup ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Criando Backup...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Fazer Backup Agora</span>
                </>
              )}
            </button>
            
            <button 
              onClick={() => setIsBackupModalOpen(true)}
              className="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 font-medium"
            >
              <RotateCcw size={16} />
              <span>Restaurar Backup</span>
            </button>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pt-2 border-t border-gray-200 dark:border-gray-600">
              <p>• Backups automáticos são executados diariamente às 02:30</p>
              <p>• Os últimos 30 backups são mantidos no sistema</p>
              <p>• Backups incluem usuários, recursos e configurações</p>
              <p>• Arquivos de backup podem ser baixados e restaurados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium ${
            hasChanges
              ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save size={20} />
          <span>{t('settings.save')}</span>
        </button>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
              Você tem alterações não salvas. Clique em "Salvar Configurações" para aplicá-las.
            </p>
          </div>
        </div>
      )}

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onRestore={handleRestoreBackup}
      />
    </div>
  );
}