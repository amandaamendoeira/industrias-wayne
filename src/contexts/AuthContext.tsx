import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (nivel: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('wayne-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    // Simulação de autenticação
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && senha === '123456') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('wayne-user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('wayne-user');
  };

  const hasPermission = (nivel: string): boolean => {
    if (!user) return false;
    
    const nivelHierarquia = {
      'funcionario': 1,
      'gerente': 2,
      'admin': 3
    };
    
    return nivelHierarquia[user.nivel] >= nivelHierarquia[nivel as keyof typeof nivelHierarquia];
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}