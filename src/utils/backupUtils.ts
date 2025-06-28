export interface BackupData {
  metadata: {
    version: string;
    timestamp: string;
    type: 'manual' | 'automatic';
    description: string;
  };
  users: any[];
  resources: any[];
  settings: any;
  activities: any[];
}

export const generateBackupData = (): BackupData => {
  // Obter dados do localStorage ou estado atual
  const savedUser = localStorage.getItem('wayne-user');
  const savedLanguage = localStorage.getItem('wayne-language');
  const savedTheme = localStorage.getItem('wayne-theme');

  // Dados mockados que seriam obtidos do estado real da aplicação
  const mockUsers = [
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
    }
  ];

  const mockResources = [
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
    }
  ];

  const mockActivities = [
    {
      id: '1',
      tipo: 'backup',
      descricao: 'Backup manual criado pelo usuário',
      usuario: savedUser ? JSON.parse(savedUser).nome : 'Sistema',
      timestamp: new Date().toISOString(),
      status: 'sucesso'
    }
  ];

  return {
    metadata: {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      type: 'manual',
      description: 'Backup completo do sistema Wayne Industries'
    },
    users: mockUsers,
    resources: mockResources,
    settings: {
      language: savedLanguage || 'pt-BR',
      theme: savedTheme || 'dark',
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
    activities: mockActivities
  };
};

export const downloadBackup = (backupData: BackupData): void => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `wayne_backup_${timestamp}.json`;
  
  const dataStr = JSON.stringify(backupData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const validateBackupFile = (fileContent: string): { isValid: boolean; data?: BackupData; error?: string } => {
  try {
    const data = JSON.parse(fileContent);
    
    // Validar estrutura básica
    if (!data.metadata || !data.users || !data.resources || !data.settings) {
      return {
        isValid: false,
        error: 'Estrutura de backup inválida. Arquivo não contém todos os dados necessários.'
      };
    }
    
    // Validar metadados
    if (!data.metadata.version || !data.metadata.timestamp) {
      return {
        isValid: false,
        error: 'Metadados do backup inválidos.'
      };
    }
    
    // Validar arrays
    if (!Array.isArray(data.users) || !Array.isArray(data.resources)) {
      return {
        isValid: false,
        error: 'Dados de usuários ou recursos inválidos.'
      };
    }
    
    return {
      isValid: true,
      data: data as BackupData
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Arquivo JSON inválido ou corrompido.'
    };
  }
};

export const applyBackupData = (backupData: BackupData): void => {
  // Aplicar configurações
  if (backupData.settings.language) {
    localStorage.setItem('wayne-language', backupData.settings.language);
  }
  
  if (backupData.settings.theme) {
    localStorage.setItem('wayne-theme', backupData.settings.theme);
  }
  
  // Salvar dados do backup no localStorage para simulação
  localStorage.setItem('wayne-backup-data', JSON.stringify(backupData));
  localStorage.setItem('wayne-backup-restored', 'true');
  localStorage.setItem('wayne-backup-timestamp', backupData.metadata.timestamp);
};

export const getStoredBackupData = (): BackupData | null => {
  const backupData = localStorage.getItem('wayne-backup-data');
  return backupData ? JSON.parse(backupData) : null;
};

export const clearBackupData = (): void => {
  localStorage.removeItem('wayne-backup-data');
  localStorage.removeItem('wayne-backup-restored');
  localStorage.removeItem('wayne-backup-timestamp');
};