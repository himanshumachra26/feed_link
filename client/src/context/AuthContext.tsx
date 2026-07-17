import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import type { User, Role } from '../types';
import type { ReactNode } from 'react';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  role: Extract<Role, 'DONOR' | 'NGO'>;
  orgName: string;
  phone?: string;
  city?: string;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, verify stored token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then((r) => setUser(r.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const register = async (data: RegisterData) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refresh = async () => {
    const { data } = await api.get('/auth/me');
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
