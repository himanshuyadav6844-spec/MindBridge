import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, UserRole } from '../types';
import api from '../services/api';

interface AuthContextType extends AuthState {
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  registerPatient: (data: any) => Promise<void>;
  registerDoctor: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('mindbridge_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDoctorVerified, setIsDoctorVerified] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('mindbridge_user');
      const storedToken = localStorage.getItem('mindbridge_token');
      const storedVerified = localStorage.getItem('mindbridge_doc_verified');

      if (
        storedUser && 
        storedToken && 
        storedUser !== 'undefined' && 
        storedToken !== 'undefined' &&
        storedUser !== 'null' && 
        storedToken !== 'null'
      ) {
        const parsed = JSON.parse(storedUser);
        if (parsed && typeof parsed === 'object' && parsed.id) {
          setUser(parsed);
          setToken(storedToken);
          setIsDoctorVerified(storedVerified === 'true');
        } else {
          localStorage.removeItem('mindbridge_user');
          localStorage.removeItem('mindbridge_token');
          setUser(null);
          setToken(null);
        }
      } else {
        localStorage.removeItem('mindbridge_user');
        localStorage.removeItem('mindbridge_token');
        setUser(null);
        setToken(null);
      }
    } catch (e) {
      localStorage.removeItem('mindbridge_user');
      localStorage.removeItem('mindbridge_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res: any = await api.post('/auth/login', credentials);
      const data = res.data?.data || res.data;
      const currentUser: User = {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role as UserRole,
      };

      setUser(currentUser);
      setToken(data.token);
      setIsDoctorVerified(data.doctorVerified ?? true);

      localStorage.setItem('mindbridge_token', data.token);
      localStorage.setItem('mindbridge_user', JSON.stringify(currentUser));
      localStorage.setItem('mindbridge_doc_verified', String(data.doctorVerified ?? true));
      return currentUser;
    } finally {
      setIsLoading(false);
    }
  };

  const registerPatient = async (formData: any) => {
    setIsLoading(true);
    try {
      const res: any = await api.post('/auth/register/patient', formData);
      const data = res.data?.data || res.data;
      const currentUser: User = {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role as UserRole,
      };

      setUser(currentUser);
      setToken(data.token);
      setIsDoctorVerified(true);

      localStorage.setItem('mindbridge_token', data.token);
      localStorage.setItem('mindbridge_user', JSON.stringify(currentUser));
      localStorage.setItem('mindbridge_doc_verified', 'true');
    } finally {
      setIsLoading(false);
    }
  };

  const registerDoctor = async (formData: any) => {
    setIsLoading(true);
    try {
      const res: any = await api.post('/auth/register/doctor', formData);
      const data = res.data?.data || res.data;
      const currentUser: User = {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role as UserRole,
      };

      setUser(currentUser);
      setToken(data.token);
      setIsDoctorVerified(false);

      localStorage.setItem('mindbridge_token', data.token);
      localStorage.setItem('mindbridge_user', JSON.stringify(currentUser));
      localStorage.setItem('mindbridge_doc_verified', 'false');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsDoctorVerified(true);
    localStorage.removeItem('mindbridge_token');
    localStorage.removeItem('mindbridge_user');
    localStorage.removeItem('mindbridge_doc_verified');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        loading: isLoading,
        isDoctorVerified,
        login,
        registerPatient,
        registerDoctor,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
