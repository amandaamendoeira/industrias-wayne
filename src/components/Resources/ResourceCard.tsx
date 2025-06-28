import React from 'react';
import { MoreVertical, MapPin, User, Calendar, Edit, Trash2 } from 'lucide-react';
import { Recurso } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ResourceCardProps {
  resource: Recurso;
  onEdit: (resource: Recurso) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  disponivel: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  em_uso: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  manutencao: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  inativo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
};

const statusLabels = {
  disponivel: 'Disponível',
  em_uso: 'Em Uso',
  manutencao: 'Manutenção',
  inativo: 'Inativo'
};

const categoryLabels = {
  equipamento: 'Equipamento',
  veiculo: 'Veículo',
  seguranca: 'Segurança'
};

const categoryColors = {
  equipamento: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  veiculo: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  seguranca: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

export function ResourceCard({ resource, onEdit, onDelete }: ResourceCardProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-black font-bold text-lg">
              {resource.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{resource.nome}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[resource.categoria]}`}>
              {categoryLabels[resource.categoria]}
            </span>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[resource.status]}`}>
          {statusLabels[resource.status]}
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin size={14} className="mr-2 text-yellow-500" />
          <span className="truncate">{resource.localizacao}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <User size={14} className="mr-2 text-yellow-500" />
          <span>{resource.responsavel}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar size={14} className="mr-2 text-yellow-500" />
          <span>Adquirido em {new Date(resource.dataAquisicao).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {resource.descricao}
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          {resource.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(resource)}
            className="p-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors group"
            title="Editar recurso"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(resource.id)}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors group"
            title="Excluir recurso"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}