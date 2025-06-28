import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Shield, UserCheck, UserX } from 'lucide-react';
import { UserModal } from '../components/Users/UserModal';
import { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTimezone } from '../contexts/TimezoneContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useSearch } from '../contexts/SearchContext';

const mockUsers: User[] = [
  {
    id: '1',
    nome: 'Bruce Wayne',
    email: 'bruce@wayneind.com',
    cargo: 'CEO',
    nivel: 'admin',
    ativo: true,
    ultimoAcesso: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    nome: 'Lucius Fox',
    email: 'lucius@wayneind.com',
    cargo: 'CTO',
    nivel: 'gerente',
    ativo: true,
    ultimoAcesso: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    nome: 'Alfred Pennyworth',
    email: 'alfred@wayneind.com',
    cargo: 'Gerente de Segurança',
    nivel: 'gerente',
    ativo: true,
    ultimoAcesso: '2024-01-15T08:45:00Z'
  },
  {
    id: '4',
    nome: 'Selina Kyle',
    email: 'selina@wayneind.com',
    cargo: 'Analista de Sistemas',
    nivel: 'funcionario',
    ativo: true,
    ultimoAcesso: '2024-01-14T17:20:00Z'
  },
  {
    id: '5',
    nome: 'Harvey Dent',
    email: 'harvey@wayneind.com',
    cargo: 'Diretor Jurídico',
    nivel: 'gerente',
    ativo: false,
    ultimoAcesso: '2024-01-10T14:30:00Z'
  }
];

const nivelLabels = {
  admin: 'Administrador',
  gerente: 'Gerente',
  funcionario: 'Funcionário'
};

const nivelColors = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  gerente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  funcionario: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
};

export function Users() {
  const { t } = useLanguage();
  const { formatDate } = useTimezone();
  const { addNotification } = useNotifications();
  const { searchTerm } = useSearch();
  const [users, setUsers] = useState(mockUsers);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Usar busca global se estiver ativa, senão usar busca local
  const activeSearchTerm = searchTerm || localSearchTerm;

  const filteredUsers = users.filter(user => {
    const matchesSearch = !activeSearchTerm || 
      user.nome.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      user.cargo.toLowerCase().includes(activeSearchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'todos' || user.nivel === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateNew = () => {
    setEditingUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const user = users.find(u => u.id === id);
    if (confirm(`Tem certeza que deseja excluir o usuário "${user?.nome}"?`)) {
      setUsers(users.filter(u => u.id !== id));
      addNotification({
        title: 'Usuário Excluído',
        message: `O usuário "${user?.nome}" foi removido com sucesso.`,
        type: 'success'
      });
    }
  };

  const toggleUserStatus = (id: string) => {
    const user = users.find(u => u.id === id);
    const newStatus = !user?.ativo;
    
    setUsers(users.map(u => 
      u.id === id ? { ...u, ativo: newStatus } : u
    ));

    addNotification({
      title: newStatus ? 'Usuário Ativado' : 'Usuário Desativado',
      message: `O usuário "${user?.nome}" foi ${newStatus ? 'ativado' : 'desativado'} com sucesso.`,
      type: 'success'
    });
  };

  const handleSaveUser = (userData: Omit<User, 'id' | 'ultimoAcesso'>) => {
    if (modalMode === 'create') {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        ultimoAcesso: new Date().toISOString()
      };
      setUsers([...users, newUser]);
      addNotification({
        title: 'Usuário Criado',
        message: `O usuário "${userData.nome}" foi criado com sucesso.`,
        type: 'success'
      });
    } else if (editingUser) {
      const updatedUser: User = {
        ...userData,
        id: editingUser.id,
        ultimoAcesso: editingUser.ultimoAcesso
      };
      setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
      addNotification({
        title: 'Usuário Atualizado',
        message: `O usuário "${userData.nome}" foi atualizado com sucesso.`,
        type: 'success'
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('users.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('users.subtitle')}</p>
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
          <span>{t('users.newUser')}</span>
        </button>
      </div>

      {!searchTerm && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('users.searchUsers')}
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
              <option value="todos">{t('users.allLevels')}</option>
              <option value="admin">{t('users.administrators')}</option>
              <option value="gerente">{t('users.managers')}</option>
              <option value="funcionario">{t('users.employees')}</option>
            </select>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('users.user')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('users.position')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('users.level')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('users.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('users.lastAccess')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('users.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-black font-bold text-sm">
                          {user.nome.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.nome}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.cargo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${nivelColors[user.nivel]}`}>
                      {nivelLabels[user.nivel]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        user.ativo
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                      }`}
                    >
                      {user.ativo ? t('users.active') : t('users.inactive')}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.ultimoAcesso)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                        title="Editar usuário"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.ativo
                            ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                        title={user.ativo ? 'Desativar usuário' : 'Ativar usuário'}
                      >
                        {user.ativo ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Excluir usuário"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {activeSearchTerm || selectedFilter !== 'todos' 
              ? 'Nenhum usuário encontrado com os filtros aplicados.'
              : 'Nenhum usuário cadastrado. Clique em "Novo Usuário" para começar.'
            }
          </p>
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={editingUser}
        mode={modalMode}
      />
    </div>
  );
}