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
  loginAsGuest: () => void;
  setGuestRole: (role: Role) => void;
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

  const getGuestUser = (role: Role): User => ({
    id: 'guest-id',
    email: 'gu***@ex***.com',
    role,
    orgName: 'Gue*** Org***tion',
    verified: true,
    active: true,
    phone: '+91 99***00',
    address: '123 Gue*** St',
    city: 'Gue***ity',
    createdAt: new Date().toISOString()
  });

  // On mount, verify stored token or guest session
  useEffect(() => {
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isGuest) {
      const guestRole = (localStorage.getItem('guestRole') as Role) || 'DONOR';
      setUser(getGuestUser(guestRole));
      setLoading(false);
      return;
    }

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
    localStorage.removeItem('isGuest');
    localStorage.removeItem('guestRole');
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const register = async (data: RegisterData) => {
    localStorage.removeItem('isGuest');
    localStorage.removeItem('guestRole');
    const res = await api.post('/auth/register', data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('guestRole');
    setUser(null);
  };

  const refresh = async () => {
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isGuest) return;
    const { data } = await api.get('/auth/me');
    setUser(data);
  };

  const loginAsGuest = () => {
    localStorage.removeItem('token');
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('guestRole', 'DONOR');
    setUser(getGuestUser('DONOR'));
  };

  const setGuestRole = (role: Role) => {
    localStorage.setItem('guestRole', role);
    setUser(getGuestUser(role));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, loginAsGuest, setGuestRole }}>
      {children}
    </AuthContext.Provider>
  );
}
