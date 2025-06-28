import React from 'react';
import { X, Shield, MapPin, Users, Calendar, Clock, AlertTriangle, CheckCircle, Eye, Settings } from 'lucide-react';
import { AreaSeguranca } from '../../types';
import { useTimezone } from '../../contexts/TimezoneContext';

interface SecurityAreaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (area: AreaSeguranca) => void;
  area: AreaSeguranca | null;
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

export function SecurityAreaDetailsModal({ isOpen, onClose, onEdit, area }: SecurityAreaDetailsModalProps) {
  const { formatDateTime } = useTimezone();

  if (!isOpen || !area) return null;

  const StatusIcon = statusIcons[area.status];

  // Dados mockados adicionais para demonstração
  const areaDetails = {
    descricao: 'Área de alta segurança destinada a pesquisas avançadas e desenvolvimento de tecnologias proprietárias. Equipada com sistemas de monitoramento 24/7 e controle de acesso biométrico.',
    localizacao: 'Torre Wayne - Subsolo 3, Setor Alpha',
    responsavel: 'Lucius Fox',
    equipamentos: [
      'Sistema de Monitoramento Quantum',
      'Controle de Acesso Biométrico',
      'Detectores de Movimento Infravermelhos',
      'Câmeras de Segurança 4K',
      'Sistema de Alarme Silencioso'
    ],
    protocolos: [
      'Verificação biométrica obrigatória',
      'Escolta de segurança para visitantes',
      'Registro de todas as atividades',
      'Varredura de segurança na saída',
      'Protocolo de emergência ativado'
    ],
    historico: [
      {
        data: '2024-01-15T10:30:00Z',
        evento: 'Vistoria de segurança realizada',
        usuario: 'Alfred Pennyworth',
        status: 'sucesso'
      },
      {
        data: '2024-01-10T14:30:00Z',
        evento: 'Atualização do sistema de acesso',
        usuario: 'Lucius Fox',
        status: 'sucesso'
      },
      {
        data: '2024-01-05T09:15:00Z',
        evento: 'Tentativa de acesso não autorizado',
        usuario: 'Sistema',
        status: 'alerta'
      }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-900 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Shield className="text-yellow-500" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{area.nome}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${nivelColors[area.nivel]}`}>
                  Nível {nivelLabels[area.nivel]}
                </span>
                <div className={`flex items-center space-x-1 ${statusColors[area.status]}`}>
                  <StatusIcon size={16} />
                  <span className="text-sm font-medium">{statusLabels[area.status]}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(area)}
              className="p-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors"
              title="Editar área"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Informações Gerais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Informações Gerais
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-yellow-500 mt-1" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Localização</p>
                    <p className="text-gray-900 dark:text-white">{areaDetails.localizacao}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="text-yellow-500 mt-1" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Responsável</p>
                    <p className="text-gray-900 dark:text-white">{areaDetails.responsavel}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="text-yellow-500 mt-1" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Última Vistoria</p>
                    <p className="text-gray-900 dark:text-white">{formatDateTime(area.ultimaVistoria)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Controle de Acesso
              </h3>
              
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Usuários Autorizados ({area.acessosPermitidos.length})
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {area.acessosPermitidos.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-black text-xs font-bold">
                          {email.split('@')[0].charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{email}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Descrição
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {areaDetails.descricao}
            </p>
          </div>

          {/* Equipamentos de Segurança */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Equipamentos de Segurança
              </h3>
              <div className="space-y-2">
                {areaDetails.equipamentos.map((equipamento, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="text-green-500" size={16} />
                    <span className="text-sm text-gray-900 dark:text-white">{equipamento}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Protocolos de Segurança
              </h3>
              <div className="space-y-2">
                {areaDetails.protocolos.map((protocolo, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Shield className="text-blue-500" size={16} />
                    <span className="text-sm text-gray-900 dark:text-white">{protocolo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Histórico de Atividades */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Histórico de Atividades
            </h3>
            <div className="space-y-3">
              {areaDetails.historico.map((evento, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className={`p-1 rounded-full ${
                    evento.status === 'sucesso' ? 'bg-green-100 dark:bg-green-900/30' :
                    evento.status === 'alerta' ? 'bg-red-100 dark:bg-red-900/30' :
                    'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    {evento.status === 'sucesso' ? (
                      <CheckCircle className="text-green-500" size={16} />
                    ) : evento.status === 'alerta' ? (
                      <AlertTriangle className="text-red-500" size={16} />
                    ) : (
                      <Clock className="text-yellow-500" size={16} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{evento.evento}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>Por {evento.usuario}</span>
                      <span>{formatDateTime(evento.data)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Eye className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Acessos Hoje</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">12</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-500" size={20} />
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Uptime</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">99.9%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-yellow-500" size={20} />
                <div>
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Alertas</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}