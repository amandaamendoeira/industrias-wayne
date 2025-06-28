import React from 'react';
import { Shield, Users, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
import { AreaSeguranca } from '../../types';
import { useTimezone } from '../../contexts/TimezoneContext';

interface SecurityAreaCardProps {
  area: AreaSeguranca;
  onViewDetails: (area: AreaSeguranca) => void;
}

const nivelColors = {
  baixo: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  medio: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  alto: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  restrito: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

const nivelLabels = {
  baixo: 'Baixo',
  medio: 'Médio',
  alto: 'Alto',
  restrito: 'Restrito'
};

const statusIcons = {
  ativo: CheckCircle,
  alerta: AlertTriangle,
  manutencao: Clock
};

const statusColors = {
  ativo: 'text-green-500',
  alerta: 'text-red-500',
  manutencao: 'text-yellow-500'
};

const statusLabels = {
  ativo: 'Ativo',
  alerta: 'Alerta',
  manutencao: 'Manutenção'
};

export function SecurityAreaCard({ area, onViewDetails }: SecurityAreaCardProps) {
  const { formatDate } = useTimezone();
  const StatusIcon = statusIcons[area.status];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-900 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <Shield className="text-yellow-500" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{area.nome}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${nivelColors[area.nivel]}`}>
              Nível {nivelLabels[area.nivel]}
            </span>
          </div>
        </div>
        
        <div className={`${statusColors[area.status]}`}>
          <StatusIcon size={24} />
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Users size={14} className="mr-2 text-yellow-500" />
          <span>{area.acessosPermitidos.length} usuários com acesso</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock size={14} className="mr-2 text-yellow-500" />
          <span>Última vistoria: {formatDate(area.ultimaVistoria)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            area.status === 'ativo' ? 'bg-green-500' :
            area.status === 'alerta' ? 'bg-red-500' :
            'bg-yellow-500'
          }`}></div>
          <span>Status: {statusLabels[area.status]}</span>
        </div>
      </div>
      
      <button
        onClick={() => onViewDetails(area)}
        className="w-full py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 font-medium"
      >
        <Eye size={16} />
        <span>Ver Detalhes</span>
      </button>
    </div>
  );
}