import React from 'react';
import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Atividade } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTimezone } from '../../contexts/TimezoneContext';

interface ActivityListProps {
  activities: Atividade[];
}

const statusIcons = {
  sucesso: CheckCircle,
  falha: XCircle,
  pendente: AlertTriangle
};

const statusColors = {
  sucesso: 'text-green-500',
  falha: 'text-red-500',
  pendente: 'text-yellow-500'
};

export function ActivityList({ activities }: ActivityListProps) {
  const { t } = useLanguage();
  const { formatDateTime } = useTimezone();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('dashboard.recentActivities')}
      </h3>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const StatusIcon = statusIcons[activity.status];
          
          return (
            <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className={`${statusColors[activity.status]}`}>
                <StatusIcon size={20} />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.descricao}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Por {activity.usuario}</p>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock size={14} className="mr-1" />
                {formatDateTime(activity.timestamp)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}