export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  nivel: 'funcionario' | 'gerente' | 'admin';
  ativo: boolean;
  ultimoAcesso: string;
  foto?: string;
}

export interface Recurso {
  id: string;
  nome: string;
  categoria: 'equipamento' | 'veiculo' | 'seguranca';
  status: 'disponivel' | 'em_uso' | 'manutencao' | 'inativo';
  localizacao: string;
  responsavel: string;
  dataAquisicao: string;
  valor: number;
  descricao: string;
}

export interface AreaSeguranca {
  id: string;
  nome: string;
  nivel: 'baixo' | 'medio' | 'alto' | 'restrito';
  acessosPermitidos: string[];
  ultimaVistoria: string;
  status: 'ativo' | 'alerta' | 'manutencao';
}

export interface Atividade {
  id: string;
  tipo: 'acesso' | 'recurso' | 'seguranca' | 'sistema';
  descricao: string;
  usuario: string;
  timestamp: string;
  status: 'sucesso' | 'falha' | 'pendente';
}

export interface DashboardStats {
  totalUsuarios: number;
  usuariosAtivos: number;
  totalRecursos: number;
  recursosDisponiveis: number;
  areasSeguranca: number;
  alertasAtivos: number;
}