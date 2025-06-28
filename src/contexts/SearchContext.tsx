import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Recurso, AreaSeguranca, Atividade } from '../types';

interface SearchResult {
  id: string;
  type: 'user' | 'resource' | 'security' | 'activity';
  title: string;
  subtitle: string;
  description: string;
  data: any;
}

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  clearSearch: () => void;
  performSearch: (term: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Dados mockados para busca
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
  }
];

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
  }
];

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
  }
];

const mockActivities: Atividade[] = [
  {
    id: '1',
    tipo: 'acesso',
    descricao: 'Acesso autorizado à Área de Pesquisa',
    usuario: 'Lucius Fox',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'sucesso'
  },
  {
    id: '2',
    tipo: 'recurso',
    descricao: 'Batmóvel adicionado ao inventário',
    usuario: 'Alfred Pennyworth',
    timestamp: '2024-01-15T09:45:00Z',
    status: 'sucesso'
  },
  {
    id: '3',
    tipo: 'seguranca',
    descricao: 'Falha na autenticação - Tentativa de acesso negada',
    usuario: 'Sistema',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'falha'
  }
];

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];
    const searchLower = term.toLowerCase();

    // Buscar usuários
    mockUsers.forEach(user => {
      if (
        user.nome.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.cargo.toLowerCase().includes(searchLower)
      ) {
        results.push({
          id: `user-${user.id}`,
          type: 'user',
          title: user.nome,
          subtitle: user.cargo,
          description: user.email,
          data: user
        });
      }
    });

    // Buscar recursos
    mockRecursos.forEach(recurso => {
      if (
        recurso.nome.toLowerCase().includes(searchLower) ||
        recurso.descricao.toLowerCase().includes(searchLower) ||
        recurso.localizacao.toLowerCase().includes(searchLower) ||
        recurso.responsavel.toLowerCase().includes(searchLower)
      ) {
        results.push({
          id: `resource-${recurso.id}`,
          type: 'resource',
          title: recurso.nome,
          subtitle: `${recurso.categoria} - ${recurso.status}`,
          description: recurso.localizacao,
          data: recurso
        });
      }
    });

    // Buscar áreas de segurança
    mockAreas.forEach(area => {
      if (
        area.nome.toLowerCase().includes(searchLower) ||
        area.nivel.toLowerCase().includes(searchLower)
      ) {
        results.push({
          id: `security-${area.id}`,
          type: 'security',
          title: area.nome,
          subtitle: `Nível ${area.nivel}`,
          description: `${area.acessosPermitidos.length} usuários com acesso`,
          data: area
        });
      }
    });

    // Buscar atividades
    mockActivities.forEach(activity => {
      if (
        activity.descricao.toLowerCase().includes(searchLower) ||
        activity.usuario.toLowerCase().includes(searchLower) ||
        activity.tipo.toLowerCase().includes(searchLower)
      ) {
        results.push({
          id: `activity-${activity.id}`,
          type: 'activity',
          title: activity.descricao,
          subtitle: `${activity.tipo} - ${activity.status}`,
          description: `Por ${activity.usuario}`,
          data: activity
        });
      }
    });

    // Simular delay de busca
    setTimeout(() => {
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      searchResults,
      isSearching,
      clearSearch,
      performSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}