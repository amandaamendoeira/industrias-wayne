import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { SecurityAreaCard } from '../components/Security/SecurityAreaCard';
import { SecurityAreaModal } from '../components/Security/SecurityAreaModal';
import { SecurityAreaDetailsModal } from '../components/Security/SecurityAreaDetailsModal';
import { AreaSeguranca } from '../types';
import { useSearch } from '../contexts/SearchContext';
import { useNotifications } from '../contexts/NotificationContext';

const mockAreas: AreaSeguranca[] = [
  {
    id: '1',
    nome: 'Laboratório de Pesquisa',
    nivel: 'restrito',
    acessosPermitidos: ['bruce@wayneind.com', 'lucius@wayneind.com'],
    ultimaVistoria: '2024-01-10T14:30:00Z',
    status: 'ativo'
  },
  {
    id: '2',
    nome: 'Garagem de Veículos',
    nivel: 'alto',
    acessosPermitidos: ['bruce@wayneind.com', 'alfred@wayneind.com'],
    ultimaVistoria: '2024-01-12T09:15:00Z',
    status: 'ativo'
  },
  {
    id: '3',
    nome: 'Sala de Servidores',
    nivel: 'alto',
    acessosPermitidos: ['lucius@wayneind.com', 'admin@wayneind.com'],
    ultimaVistoria: '2024-01-14T16:45:00Z',
    status: 'alerta'
  },
  {
    id: '4',
    nome: 'Escritório Executivo',
    nivel: 'medio',
    acessosPermitidos: ['bruce@wayneind.com', 'secretaria@wayneind.com'],
    ultimaVistoria: '2024-01-08T11:20:00Z',
    status: 'ativo'
  },
  {
    id: '5',
    nome: 'Armory',
    nivel: 'restrito',
    acessosPermitidos: ['bruce@wayneind.com'],
    ultimaVistoria: '2024-01-13T18:00:00Z',
    status: 'manutencao'
  },
  {
    id: '6',
    nome: 'Recepção',
    nivel: 'baixo',
    acessosPermitidos: ['todos'],
    ultimaVistoria: '2024-01-15T08:30:00Z',
    status: 'ativo'
  }
];

export function Security() {
  const { searchTerm } = useSearch();
  const { addNotification } = useNotifications();
  const [areas, setAreas] = useState(mockAreas);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<AreaSeguranca | null>(null);
  const [selectedArea, setSelectedArea] = useState<AreaSeguranca | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Usar busca global se estiver ativa, senão usar busca local
  const activeSearchTerm = searchTerm || localSearchTerm;

  const filteredAreas = areas.filter(area => {
    const matchesSearch = !activeSearchTerm || 
      area.nome.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      area.nivel.toLowerCase().includes(activeSearchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'todos' || area.nivel === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateNew = () => {
    setEditingArea(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (area: AreaSeguranca) => {
    setEditingArea(area);
    setModalMode('edit');
    setIsModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleViewDetails = (area: AreaSeguranca) => {
    setSelectedArea(area);
    setIsDetailsModalOpen(true);
  };

  const handleSaveArea = (areaData: Omit<AreaSeguranca, 'id'>) => {
    if (modalMode === 'create') {
      const newArea: AreaSeguranca = {
        ...areaData,
        id: Date.now().toString()
      };
      setAreas([...areas, newArea]);
      addNotification({
        title: 'Área de Segurança Criada',
        message: `A área "${areaData.nome}" foi criada com sucesso.`,
        type: 'success'
      });
    } else if (editingArea) {
      const updatedArea: AreaSeguranca = {
        ...areaData,
        id: editingArea.id
      };
      setAreas(areas.map(a => a.id === editingArea.id ? updatedArea : a));
      addNotification({
        title: 'Área de Segurança Atualizada',
        message: `A área "${areaData.nome}" foi atualizada com sucesso.`,
        type: 'success'
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArea(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedArea(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Controle de Segurança</h2>
          <p className="text-gray-600 dark:text-gray-400">Gerencie áreas restritas e controle de acesso</p>
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
          <span>Nova Área</span>
        </button>
      </div>

      {!searchTerm && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar áreas de segurança..."
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
              <option value="todos">Todos os Níveis</option>
              <option value="baixo">Nível Baixo</option>
              <option value="medio">Nível Médio</option>
              <option value="alto">Nível Alto</option>
              <option value="restrito">Restrito</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAreas.map((area) => (
          <SecurityAreaCard
            key={area.id}
            area={area}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {filteredAreas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {activeSearchTerm || selectedFilter !== 'todos' 
              ? 'Nenhuma área encontrada com os filtros aplicados.'
              : 'Nenhuma área cadastrada. Clique em "Nova Área" para começar.'
            }
          </p>
        </div>
      )}

      <SecurityAreaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveArea}
        area={editingArea}
        mode={modalMode}
      />

      <SecurityAreaDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        onEdit={handleEdit}
        area={selectedArea}
      />
    </div>
  );
}