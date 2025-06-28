import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { ResourceCard } from '../components/Resources/ResourceCard';
import { ResourceModal } from '../components/Resources/ResourceModal';
import { Recurso } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useSearch } from '../contexts/SearchContext';

const mockRecursos: Recurso[] = [
  {
    id: '1',
    nome: 'Batmóvel',
    categoria: 'veiculo',
    status: 'disponivel',
    localizacao: 'Batcaverna - Garagem Principal',
    responsavel: 'Alfred Pennyworth',
    dataAquisicao: '2020-06-15T00:00:00Z',
    valor: 50000000,
    descricao: 'Veículo blindado de alta performance'
  },
  {
    id: '2',
    nome: 'Sistema de Segurança Quantum',
    categoria: 'seguranca',
    status: 'em_uso',
    localizacao: 'Torre Wayne - Andar 50',
    responsavel: 'Lucius Fox',
    dataAquisicao: '2023-03-20T00:00:00Z',
    valor: 15000000,
    descricao: 'Sistema avançado de monitoramento'
  },
  {
    id: '3',
    nome: 'Computador Quântico',
    categoria: 'equipamento',
    status: 'disponivel',
    localizacao: 'Laboratório de Pesquisa',
    responsavel: 'Lucius Fox',
    dataAquisicao: '2023-01-10T00:00:00Z',
    valor: 25000000,
    descricao: 'Processamento de dados avançado'
  },
  {
    id: '4',
    nome: 'Batwing',
    categoria: 'veiculo',
    status: 'manutencao',
    localizacao: 'Hangar Subterrâneo',
    responsavel: 'Alfred Pennyworth',
    dataAquisicao: '2021-08-12T00:00:00Z',
    valor: 75000000,
    descricao: 'Aeronave de combate avançada'
  },
  {
    id: '5',
    nome: 'Escudo de Energia',
    categoria: 'seguranca',
    status: 'disponivel',
    localizacao: 'Depósito Blindado',
    responsavel: 'Bruce Wayne',
    dataAquisicao: '2022-11-05T00:00:00Z',
    valor: 8000000,
    descricao: 'Proteção contra ataques energéticos'
  },
  {
    id: '6',
    nome: 'Servidor Central',
    categoria: 'equipamento',
    status: 'em_uso',
    localizacao: 'Sala de Servidores',
    responsavel: 'Lucius Fox',
    dataAquisicao: '2023-05-18T00:00:00Z',
    valor: 5000000,
    descricao: 'Infraestrutura de dados principal'
  }
];

export function Resources() {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const { searchTerm } = useSearch();
  const [recursos, setRecursos] = useState(mockRecursos);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Recurso | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Usar busca global se estiver ativa, senão usar busca local
  const activeSearchTerm = searchTerm || localSearchTerm;

  const filteredRecursos = recursos.filter(recurso => {
    const matchesSearch = !activeSearchTerm || 
      recurso.nome.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      recurso.descricao.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      recurso.localizacao.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      recurso.responsavel.toLowerCase().includes(activeSearchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'todos' || recurso.categoria === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateNew = () => {
    setEditingResource(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (recurso: Recurso) => {
    setEditingResource(recurso);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const recurso = recursos.find(r => r.id === id);
    if (confirm(`Tem certeza que deseja excluir o recurso "${recurso?.nome}"?`)) {
      setRecursos(recursos.filter(r => r.id !== id));
      addNotification({
        title: 'Recurso Excluído',
        message: `O recurso "${recurso?.nome}" foi removido com sucesso.`,
        type: 'success'
      });
    }
  };

  const handleSaveResource = (resourceData: Omit<Recurso, 'id'>) => {
    if (modalMode === 'create') {
      const newResource: Recurso = {
        ...resourceData,
        id: Date.now().toString()
      };
      setRecursos([...recursos, newResource]);
      addNotification({
        title: 'Recurso Criado',
        message: `O recurso "${resourceData.nome}" foi criado com sucesso.`,
        type: 'success'
      });
    } else if (editingResource) {
      const updatedResource: Recurso = {
        ...resourceData,
        id: editingResource.id
      };
      setRecursos(recursos.map(r => r.id === editingResource.id ? updatedResource : r));
      addNotification({
        title: 'Recurso Atualizado',
        message: `O recurso "${resourceData.nome}" foi atualizado com sucesso.`,
        type: 'success'
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('resources.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('resources.subtitle')}</p>
          {searchTerm && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
              Mostrando resultados para: "{searchTerm}"
            </p>
          )}
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>{t('resources.newResource')}</span>
        </button>
      </div>

      {!searchTerm && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('resources.searchResources')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="todos">{t('resources.allCategories')}</option>
              <option value="equipamento">{t('resources.equipment')}</option>
              <option value="veiculo">{t('resources.vehicles')}</option>
              <option value="seguranca">{t('resources.security')}</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecursos.map((recurso) => (
          <ResourceCard
            key={recurso.id}
            resource={recurso}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredRecursos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {activeSearchTerm || selectedFilter !== 'todos' 
              ? 'Nenhum recurso encontrado com os filtros aplicados.'
              : 'Nenhum recurso cadastrado. Clique em "Novo Recurso" para começar.'
            }
          </p>
        </div>
      )}

      <ResourceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveResource}
        resource={editingResource}
        mode={modalMode}
      />
    </div>
  );
}