import React from 'react';
import { Users, Package, Shield, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { ActivityList } from '../components/Dashboard/ActivityList';
import { DashboardStats, Atividade } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const mockStats: DashboardStats = {
  totalUsuarios: 247,
  usuariosAtivos: 189,
  totalRecursos: 1834,
  recursosDisponiveis: 1456,
  areasSeguranca: 12,
  alertasAtivos: 3
};

const mockActivities: Atividade[] = [
  {
    id: '1',
    tipo: 'acesso',
    descricao: 'Acesso autorizado à Área de Pesquisa',
    usuario: 'Lucius Fox',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'sucesso'
  },
  {
    id: '2',
    tipo: 'recurso',
    descricao: 'Batmóvel adicionado ao inventário',
    usuario: 'Alfred Pennyworth',
    timestamp: '2024-01-15T09:45:00Z',
    status: 'sucesso'
  },
  {
    id: '3',
    tipo: 'seguranca',
    descricao: 'Falha na autenticação - Tentativa de acesso negada',
    usuario: 'Sistema',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'falha'
  },
  {
    id: '4',
    tipo: 'sistema',
    descricao: 'Backup de dados em andamento',
    usuario: 'Sistema',
    timestamp: '2024-01-15T08:30:00Z',
    status: 'pendente'
  }
];

export function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title={t('dashboard.totalUsers')}
          value={mockStats.totalUsuarios}
          icon={Users}
          change="+12% este mês"
          changeType="positive"
          color="blue"
        />
        <StatsCard
          title={t('dashboard.activeUsers')}
          value={mockStats.usuariosAtivos}
          icon={TrendingUp}
          change="+8% esta semana"
          changeType="positive"
          color="green"
        />
        <StatsCard
          title={t('dashboard.totalResources')}
          value={mockStats.totalRecursos}
          icon={Package}
          change={t('common.stable')}
          changeType="neutral"
          color="purple"
        />
        <StatsCard
          title={t('dashboard.availableResources')}
          value={mockStats.recursosDisponiveis}
          icon={Package}
          change="79% disponível"
          changeType="positive"
          color="green"
        />
        <StatsCard
          title={t('dashboard.securityAreas')}
          value={mockStats.areasSeguranca}
          icon={Shield}
          change={t('common.allActive')}
          changeType="positive"
          color="yellow"
        />
        <StatsCard
          title={t('dashboard.activeAlerts')}
          value={mockStats.alertasAtivos}
          icon={AlertTriangle}
          change="-2 desde ontem"
          changeType="positive"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityList activities={mockActivities} />
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('dashboard.systemStatus')}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900 dark:text-white">{t('dashboard.mainServer')}</span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">{t('common.online')}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900 dark:text-white">{t('dashboard.securitySystem')}</span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">{t('common.active')}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-gray-900 dark:text-white">{t('dashboard.backup')}</span>
              </div>
              <span className="text-sm text-yellow-600 dark:text-yellow-400">{t('common.inProgress')}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-900 dark:text-white">{t('dashboard.lastSync')}</span>
              </div>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                <Clock size={14} className="inline mr-1" />
                há 5 min
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}