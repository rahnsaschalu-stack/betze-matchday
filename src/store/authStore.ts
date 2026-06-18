import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import * as authService from '@services/auth';

interface AuthState {
  session: Session | null;
  user: User | null;
  userId: string | null;
  isLoading: boolean;
  error: string | null;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  register: (credentials: authService.RegisterCredentials) => Promise<boolean>;
  login: (credentials: authService.LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  getCurrentSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  userId: null,
  isLoading: true,
  error: null,

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user, userId: user?.id || null }),
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    const { data, error } = await authService.register(credentials);

    if (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }

    if (data.user) {
      set({ user: data.user, userId: data.user.id, isLoading: false });
      return true;
    }

    set({ error: 'Registration failed', isLoading: false });
    return false;
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    const { data, error } = await authService.login(credentials);

    if (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }

    if (data.session && data.user) {
      set({ session: data.session, user: data.user, userId: data.user.id, isLoading: false });
      return true;
    }

    set({ error: 'Login failed', isLoading: false });
    return false;
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.logout();
    set({ session: null, user: null, userId: null, isLoading: false });
  },

  getCurrentSession: async () => {
    const { session, error } = await authService.getCurrentSession();

    if (session) {
      set({ session, user: session.user, userId: session.user.id });
    }

    set({ isLoading: false });
  },
}));
