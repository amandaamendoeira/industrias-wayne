import React, { useState, useEffect } from 'react';
import { X, Save, Shield, MapPin, Users, Calendar, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { AreaSeguranca } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface SecurityAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (area: Omit<AreaSeguranca, 'id'>) => void;
  area?: AreaSeguranca | null;
  mode: 'create' | 'edit';
}

const nivelOptions = [
  { value: 'baixo', label: 'Baixo', description: 'Acesso público ou com restrições mínimas', color: 'bg-green-100 text-green-800' },
  { value: 'medio', label: 'Médio', description: 'Acesso restrito a funcionários autorizados', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'alto', label: 'Alto', description: 'Acesso limitado a gerentes e supervisores', color: 'bg-orange-100 text-orange-800' },
  { value: 'restrito', label: 'Restrito', description: 'Acesso apenas para pessoal de alta segurança', color: 'bg-red-100 text-red-800' }
];

const statusOptions = [
  { value: 'ativo', label: 'Ativo', description: 'Sistema funcionando normalmente', color: 'bg-green-100 text-green-800' },
  { value: 'alerta', label: 'Alerta', description: 'Requer atenção ou monitoramento', color: 'bg-red-100 text-red-800' },
  { value: 'manutencao', label: 'Manutenção', description: 'Sistema temporariamente indisponível', color: 'bg-yellow-100 text-yellow-800' }
];

const mockUsuarios = [
  'bruce@wayneind.com',
  'lucius@wayneind.com',
  'alfred@wayneind.com',
  'selina@wayneind.com',
  'harvey@wayneind.com',
  'admin@wayneind.com',
  'secretaria@wayneind.com',
  'seguranca@wayneind.com'
];

export function SecurityAreaModal({ isOpen, onClose, onSave, area, mode }: SecurityAreaModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nome: '',
    nivel: 'baixo' as AreaSeguranca['nivel'],
    status: 'ativo' as AreaSeguranca['status'],
    acessosPermitidos: [] as string[],
    ultimaVistoria: '',
    descricao: '',
    localizacao: '',
    responsavel: '',
    equipamentos: [] as string[],
    protocolos: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  useEffect(() => {
    if (area && mode === 'edit') {
      setFormData({
        nome: area.nome,
        nivel: area.nivel,
        status: area.status,
        acessosPermitidos: area.acessosPermitidos,
        ultimaVistoria: area.ultimaVistoria.split('T')[0],
        descricao: (area as any).descricao || '',
        localizacao: (area as any).localizacao || '',
        responsavel: (area as any).responsavel || '',
        equipamentos: (area as any).equipamentos || [],
        protocolos: (area as any).protocolos || []
      });
    } else {
      setFormData({
        nome: '',
        nivel: 'baixo',
        status: 'ativo',
        acessosPermitidos: [],
        ultimaVistoria: new Date().toISOString().split('T')[0],
        descricao: '',
        localizacao: '',
        responsavel: '',
        equipamentos: [],
        protocolos: []
      });
    }
    setErrors({});
  }, [area, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da área é obrigatório';
    }
    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    }
    if (!formData.responsavel.trim()) {
      newErrors.responsavel = 'Responsável é obrigatório';
    }
    if (!formData.ultimaVistoria) {
      newErrors.ultimaVistoria = 'Data da última vistoria é obrigatória';
    }
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }
    if (formData.acessosPermitidos.length === 0) {
      newErrors.acessosPermitidos = 'Pelo menos um usuário deve ter acesso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const areaData = {
      ...formData,
      ultimaVistoria: new Date(formData.ultimaVistoria).toISOString()
    };

    onSave(areaData);
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddUser = (email: string) => {
    if (!formData.acessosPermitidos.includes(email)) {
      handleInputChange('acessosPermitidos', [...formData.acessosPermitidos, email]);
    }
    setShowUserDropdown(false);
    setUserSearchTerm('');
  };

  const handleRemoveUser = (email: string) => {
    handleInputChange('acessosPermitidos', formData.acessosPermitidos.filter(u => u !== email));
  };

  const filteredUsers = mockUsuarios.filter(user => 
    user.toLowerCase().includes(userSearchTerm.toLowerCase()) &&
    !formData.acessosPermitidos.includes(user)
  );

  const selectedNivel = nivelOptions.find(n => n.value === formData.nivel);
  const selectedStatus = statusOptions.find(s => s.value === formData.status);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Shield className="text-yellow-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? 'Nova Área de Segurança' : 'Editar Área de Segurança'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informações Básicas
                </h3>
                
                {/* Nome */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Shield size={16} className="inline mr-2" />
                    Nome da Área *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.nome ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Ex: Laboratório de Pesquisa Avançada"
                  />
                  {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
                </div>

                {/* Localização */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Localização *
                  </label>
                  <input
                    type="text"
                    value={formData.localizacao}
                    onChange={(e) => handleInputChange('localizacao', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.localizacao ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Ex: Torre Wayne - Subsolo 3"
                  />
                  {errors.localizacao && <p className="text-red-500 text-sm mt-1">{errors.localizacao}</p>}
                </div>

                {/* Responsável */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Responsável pela Área *
                  </label>
                  <input
                    type="text"
                    value={formData.responsavel}
                    onChange={(e) => handleInputChange('responsavel', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.responsavel ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Ex: Lucius Fox"
                  />
                  {errors.responsavel && <p className="text-red-500 text-sm mt-1">{errors.responsavel}</p>}
                </div>

                {/* Data da Última Vistoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Última Vistoria *
                  </label>
                  <input
                    type="date"
                    value={formData.ultimaVistoria}
                    onChange={(e) => handleInputChange('ultimaVistoria', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.ultimaVistoria ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.ultimaVistoria && <p className="text-red-500 text-sm mt-1">{errors.ultimaVistoria}</p>}
                </div>
              </div>
            </div>

            {/* Configurações de Segurança */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Configurações de Segurança
                </h3>

                {/* Nível de Segurança */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nível de Segurança *
                  </label>
                  <select
                    value={formData.nivel}
                    onChange={(e) => handleInputChange('nivel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {nivelOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {selectedNivel && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedNivel.color}`}>
                          Nível {selectedNivel.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedNivel.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status da Área *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {selectedStatus && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedStatus.color}`}>
                          {selectedStatus.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedStatus.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controle de Acesso */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <Users size={20} className="inline mr-2" />
              Controle de Acesso
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Usuários com Acesso *
              </label>
              
              {/* Lista de usuários selecionados */}
              <div className="mb-3 space-y-2">
                {formData.acessosPermitidos.map((email) => (
                  <div key={email} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-900 dark:text-white">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(email)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Adicionar usuário */}
              <div className="relative">
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  onFocus={() => setShowUserDropdown(true)}
                  placeholder="Buscar usuário para adicionar..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                
                {showUserDropdown && filteredUsers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredUsers.map((email) => (
                      <button
                        key={email}
                        type="button"
                        onClick={() => handleAddUser(email)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                      >
                        {email}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.acessosPermitidos && <p className="text-red-500 text-sm mt-1">{errors.acessosPermitidos}</p>}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição da Área *
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
                errors.descricao ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Descreva o propósito, características e medidas de segurança da área..."
            />
            {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save size={20} />
              <span>{mode === 'create' ? 'Criar Área' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}