import { create } from 'zustand';
import type { User } from '../types';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set: (partial: Partial<AuthState>) => void) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  setUser: (user: User | null) => set({ user, isAuthenticated: !!user, loading: false }),
  setLoading: (loading: boolean) => set({ loading }),
  logout: async () => {
    const {authService } = await import('../services/authService');
    await (authService as { logout: () => Promise<void> }).logout();
    set({ user: null, isAuthenticated: false, loading: false });
  },
}));
