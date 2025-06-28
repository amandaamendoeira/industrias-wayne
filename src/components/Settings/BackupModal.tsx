import React, { useState } from 'react';
import { X, Upload, AlertTriangle, CheckCircle, Clock, Database, FileText, Download } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { validateBackupFile, applyBackupData, BackupData } from '../../utils/backupUtils';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (backupData: BackupData) => void;
}

const mockBackupFiles = [
  {
    id: '1',
    name: 'wayne_backup_2024-01-15T02-30-00.json',
    date: '2024-01-15T02:30:00Z',
    size: '2.4 MB',
    type: 'Backup Automático',
    description: 'Backup completo do sistema incluindo usuários, recursos e configurações'
  },
  {
    id: '2',
    name: 'wayne_backup_2024-01-14T02-30-00.json',
    date: '2024-01-14T02:30:00Z',
    size: '2.3 MB',
    type: 'Backup Automático',
    description: 'Backup diário automático'
  },
  {
    id: '3',
    name: 'wayne_backup_manual_2024-01-13T16-45-00.json',
    date: '2024-01-13T16:45:00Z',
    size: '2.2 MB',
    type: 'Backup Manual',
    description: 'Backup manual antes da atualização do sistema'
  }
];

export function BackupModal({ isOpen, onClose, onRestore }: BackupModalProps) {
  const { addNotification } = useNotifications();
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      try {
        const fileContent = await file.text();
        const validation = validateBackupFile(fileContent);
        
        if (validation.isValid) {
          setUploadedFile(file);
          addNotification({
            title: 'Arquivo Validado',
            message: `Arquivo "${file.name}" carregado e validado com sucesso.`,
            type: 'success'
          });
        } else {
          addNotification({
            title: 'Arquivo Inválido',
            message: validation.error || 'Arquivo de backup inválido.',
            type: 'error'
          });
        }
      } catch (error) {
        addNotification({
          title: 'Erro no Arquivo',
          message: 'Não foi possível ler o arquivo selecionado.',
          type: 'error'
        });
      }
    } else {
      addNotification({
        title: 'Formato Inválido',
        message: 'Por favor, selecione um arquivo de backup válido (.json).',
        type: 'error'
      });
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const simulateRestore = async (backupData: BackupData) => {
    setIsRestoring(true);
    setRestoreProgress(0);

    const steps = [
      { message: 'Validando integridade do backup...', progress: 15 },
      { message: 'Preparando restauração...', progress: 25 },
      { message: 'Restaurando dados de usuários...', progress: 45 },
      { message: 'Restaurando recursos do sistema...', progress: 65 },
      { message: 'Aplicando configurações...', progress: 80 },
      { message: 'Finalizando processo...', progress: 95 },
      { message: 'Restauração concluída!', progress: 100 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setRestoreProgress(step.progress);
      
      addNotification({
        title: 'Progresso da Restauração',
        message: step.message,
        type: 'info'
      });
    }

    // Aplicar dados do backup
    applyBackupData(backupData);
    onRestore(backupData);
    
    addNotification({
      title: 'Backup Restaurado com Sucesso',
      message: `Sistema restaurado a partir do backup de ${new Date(backupData.metadata.timestamp).toLocaleString('pt-BR')}.`,
      type: 'success'
    });

    setIsRestoring(false);
    setRestoreProgress(0);
    onClose();

    // Recarregar a página para aplicar as mudanças
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const generateMockBackupData = (backupId: string): BackupData => {
    const backup = mockBackupFiles.find(b => b.id === backupId);
    return {
      metadata: {
        version: '1.0.0',
        timestamp: backup?.date || new Date().toISOString(),
        type: backup?.type.includes('Manual') ? 'manual' : 'automatic',
        description: backup?.description || 'Backup do sistema'
      },
      users: [
        {
          id: '1',
          nome: 'Bruce Wayne (Restaurado)',
          email: 'bruce@wayneind.com',
          cargo: 'CEO',
          nivel: 'admin',
          ativo: true,
          ultimoAcesso: backup?.date || new Date().toISOString()
        },
        {
          id: '2',
          nome: 'Lucius Fox (Restaurado)',
          email: 'lucius@wayneind.com',
          cargo: 'CTO',
          nivel: 'gerente',
          ativo: true,
          ultimoAcesso: backup?.date || new Date().toISOString()
        }
      ],
      resources: [
        {
          id: '1',
          nome: 'Batmóvel (Dados Restaurados)',
          categoria: 'veiculo',
          status: 'disponivel',
          localizacao: 'Batcaverna - Garagem Principal',
          responsavel: 'Alfred Pennyworth',
          dataAquisicao: '2020-06-15T00:00:00Z',
          valor: 50000000,
          descricao: 'Veículo blindado - Dados restaurados do backup'
        }
      ],
      settings: {
        language: 'pt-BR',
        theme: 'dark',
        notifications: {
          email: true,
          desktop: true,
          security: true,
          resources: false
        },
        security: {
          twoFactor: true,
          sessionTimeout: 30,
          passwordPolicy: 'strong'
        }
      },
      activities: [
        {
          id: '1',
          tipo: 'backup',
          descricao: 'Dados restaurados do backup',
          usuario: 'Sistema',
          timestamp: new Date().toISOString(),
          status: 'sucesso'
        }
      ]
    };
  };

  const handleRestoreFromList = async (backupId: string) => {
    const backup = mockBackupFiles.find(b => b.id === backupId);
    if (!backup) return;

    if (confirm(`⚠️ ATENÇÃO: OPERAÇÃO IRREVERSÍVEL\n\nTem certeza que deseja restaurar o backup "${backup.name}"?\n\nEsta ação irá:\n• Sobrescrever TODOS os dados atuais\n• Restaurar usuários, recursos e configurações\n• Reiniciar o sistema automaticamente\n\nClique OK para confirmar ou Cancelar para abortar.`)) {
      const backupData = generateMockBackupData(backupId);
      await simulateRestore(backupData);
    }
  };

  const handleRestoreFromFile = async () => {
    if (!uploadedFile) return;

    if (confirm(`⚠️ ATENÇÃO: OPERAÇÃO IRREVERSÍVEL\n\nTem certeza que deseja restaurar o backup do arquivo "${uploadedFile.name}"?\n\nEsta ação irá:\n• Sobrescrever TODOS os dados atuais\n• Restaurar usuários, recursos e configurações\n• Reiniciar o sistema automaticamente\n\nClique OK para confirmar ou Cancelar para abortar.`)) {
      try {
        const fileContent = await uploadedFile.text();
        const validation = validateBackupFile(fileContent);
        
        if (validation.isValid && validation.data) {
          await simulateRestore(validation.data);
        } else {
          addNotification({
            title: 'Erro na Restauração',
            message: validation.error || 'Arquivo de backup inválido.',
            type: 'error'
          });
        }
      } catch (error) {
        addNotification({
          title: 'Erro na Restauração',
          message: 'Não foi possível processar o arquivo de backup.',
          type: 'error'
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Database className="text-yellow-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Restaurar Backup do Sistema
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isRestoring}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {isRestoring ? (
            <div className="text-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 dark:border-gray-700 border-t-yellow-500 mx-auto mb-6"></div>
                <Database className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Restaurando Sistema...
              </h3>
              <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${restoreProgress}%` }}
                ></div>
              </div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {restoreProgress}% concluído
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Por favor, não feche esta janela durante o processo
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Aviso de Segurança */}
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-red-800 dark:text-red-200 text-lg">
                      ⚠️ OPERAÇÃO CRÍTICA - LEIA COM ATENÇÃO
                    </h3>
                    <div className="text-red-700 dark:text-red-300 mt-2 space-y-2">
                      <p className="font-medium">A restauração de backup é uma operação IRREVERSÍVEL que irá:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Sobrescrever TODOS os dados atuais do sistema</li>
                        <li>Restaurar usuários, recursos, configurações e atividades</li>
                        <li>Reiniciar automaticamente o sistema após a conclusão</li>
                        <li>Perder qualquer alteração não salva em backup</li>
                      </ul>
                      <p className="font-bold mt-3">
                        Certifique-se de ter um backup atual antes de prosseguir!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload de Arquivo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Upload className="mr-2" size={20} />
                  Carregar Arquivo de Backup
                </h3>
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 transition-all ${
                    dragOver 
                      ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <FileText className="text-gray-400" size={32} />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Arraste um arquivo aqui ou clique para selecionar
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Apenas arquivos .json de backup são aceitos
                    </p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 transition-colors shadow-lg">
                        <Upload className="mr-2" size={20} />
                        Selecionar Arquivo
                      </span>
                    </label>
                  </div>
                  
                  {uploadedFile && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="text-green-500" size={20} />
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-200">
                              {uploadedFile.name}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Arquivo validado
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRestoreFromFile}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Database size={16} />
                          <span>Restaurar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lista de Backups Disponíveis */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Clock className="mr-2" size={20} />
                  Backups Disponíveis no Sistema
                </h3>
                <div className="space-y-3">
                  {mockBackupFiles.map((backup) => (
                    <div
                      key={backup.id}
                      className={`border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${
                        selectedBackup === backup.id
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedBackup(backup.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            checked={selectedBackup === backup.id}
                            onChange={() => setSelectedBackup(backup.id)}
                            className="text-yellow-500 focus:ring-yellow-500 w-4 h-4"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                              {backup.name}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                              {backup.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {new Date(backup.date).toLocaleString('pt-BR')}
                              </span>
                              <span>{backup.size}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                backup.type.includes('Manual') 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {backup.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedBackup && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleRestoreFromList(selectedBackup)}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center space-x-2 transition-colors shadow-lg"
                    >
                      <Database size={20} />
                      <span>Restaurar Backup Selecionado</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}