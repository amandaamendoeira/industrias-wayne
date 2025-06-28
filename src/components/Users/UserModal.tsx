import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Briefcase, Shield, Calendar } from 'lucide-react';
import { User as UserType } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<UserType, 'id' | 'ultimoAcesso'>) => void;
  user?: UserType | null;
  mode: 'create' | 'edit';
}

const nivelOptions = [
  { value: 'funcionario', label: 'Funcionário', description: 'Acesso básico ao sistema' },
  { value: 'gerente', label: 'Gerente', description: 'Acesso a recursos e segurança' },
  { value: 'admin', label: 'Administrador', description: 'Acesso total ao sistema' }
];

const cargoOptions = [
  'CEO',
  'CTO',
  'Diretor de Operações',
  'Gerente de Segurança',
  'Gerente de TI',
  'Gerente de Recursos',
  'Analista de Sistemas',
  'Especialista em Segurança',
  'Técnico de TI',
  'Assistente Administrativo',
  'Coordenador de Projetos',
  'Desenvolvedor',
  'Analista de Dados'
];

export function UserModal({ isOpen, onClose, onSave, user, mode }: UserModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo: '',
    nivel: 'funcionario' as UserType['nivel'],
    ativo: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        nome: user.nome,
        email: user.email,
        cargo: user.cargo,
        nivel: user.nivel,
        ativo: user.ativo
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        cargo: '',
        nivel: 'funcionario',
        ativo: true
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }
    
    if (!formData.cargo.trim()) {
      newErrors.cargo = 'Cargo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User size={16} className="inline mr-2" />
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.nome ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Ex: Bruce Wayne"
              />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Corporativo *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="usuario@wayneind.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Cargo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Briefcase size={16} className="inline mr-2" />
                Cargo *
              </label>
              <select
                value={formData.cargo}
                onChange={(e) => handleInputChange('cargo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.cargo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Selecione um cargo</option>
                {cargoOptions.map(cargo => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>
              {errors.cargo && <p className="text-red-500 text-sm mt-1">{errors.cargo}</p>}
            </div>

            {/* Nível de Acesso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Shield size={16} className="inline mr-2" />
                Nível de Acesso *
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
            </div>

            {/* Descrição do Nível */}
            <div className="md:col-span-2">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Permissões do {nivelOptions.find(n => n.value === formData.nivel)?.label}:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {nivelOptions.find(n => n.value === formData.nivel)?.description}
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  {formData.nivel === 'funcionario' && (
                    <div className="space-y-1">
                      <p className="text-green-600 dark:text-green-400">✓ Acesso ao Dashboard</p>
                      <p className="text-green-600 dark:text-green-400">✓ Visualizar Recursos</p>
                      <p className="text-red-600 dark:text-red-400">✗ Gerenciar Segurança</p>
                      <p className="text-red-600 dark:text-red-400">✗ Gerenciar Usuários</p>
                    </div>
                  )}
                  {formData.nivel === 'gerente' && (
                    <div className="space-y-1">
                      <p className="text-green-600 dark:text-green-400">✓ Acesso ao Dashboard</p>
                      <p className="text-green-600 dark:text-green-400">✓ Gerenciar Recursos</p>
                      <p className="text-green-600 dark:text-green-400">✓ Controle de Segurança</p>
                      <p className="text-red-600 dark:text-red-400">✗ Gerenciar Usuários</p>
                    </div>
                  )}
                  {formData.nivel === 'admin' && (
                    <div className="space-y-1">
                      <p className="text-green-600 dark:text-green-400">✓ Acesso Total ao Sistema</p>
                      <p className="text-green-600 dark:text-green-400">✓ Gerenciar Todos os Recursos</p>
                      <p className="text-green-600 dark:text-green-400">✓ Controle Total de Segurança</p>
                      <p className="text-green-600 dark:text-green-400">✓ Gerenciar Usuários e Configurações</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) => handleInputChange('ativo', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Usuário ativo no sistema
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Usuários inativos não conseguem fazer login no sistema
              </p>
            </div>
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
              <span>{mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}