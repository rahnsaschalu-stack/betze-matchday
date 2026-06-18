import { create } from 'zustand';
import { Achievement, Leaderboard } from '@types/index';
import * as gamificationService from '@services/gamification';

interface GamificationState {
  leaderboard: Leaderboard[];
  userRank: number;
  userPoints: number;
  userLevel: number;
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;

  fetchLeaderboard: (limit?: number, offset?: number) => Promise<void>;
  fetchUserStats: (userId: string) => Promise<void>;
  fetchAchievements: (userId: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  leaderboard: [],
  userRank: 0,
  userPoints: 0,
  userLevel: 0,
  achievements: [],
  isLoading: false,
  error: null,

  fetchLeaderboard: async (limit = 50, offset = 0) => {
    set({ isLoading: true, error: null });
    const { leaderboard, error } = await gamificationService.getLeaderboard(limit, offset);

    if (error) {
      set({ error: 'Failed to fetch leaderboard', isLoading: false });
      return;
    }

    set({ leaderboard, isLoading: false });
  },

  fetchUserStats: async (userId) => {
    set({ isLoading: true, error: null });
    const { rank, points, level, error } = await gamificationService.getUserRank(userId);

    if (error) {
      set({ error: 'Failed to fetch user stats', isLoading: false });
      return;
    }

    set({ userRank: rank, userPoints: points, userLevel: level, isLoading: false });
  },

  fetchAchievements: async (userId) => {
    set({ isLoading: true, error: null });
    const { achievements, error } = await gamificationService.getUserAchievements(userId);

    if (error) {
      set({ error: 'Failed to fetch achievements', isLoading: false });
      return;
    }

    set({ achievements, isLoading: false });
  },

  setError: (error) => set({ error }),
}));
