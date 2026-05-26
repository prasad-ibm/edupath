import { create } from 'zustand';
import { User } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  selectedGrade: number | null; // can override OneRoster grade via dropdown
  selectedSubject: string | null;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setSelectedGrade: (grade: number) => void;
  setSelectedSubject: (subject: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  selectedGrade: null,
  selectedSubject: null,

  setAuth: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
      selectedGrade: user.grade,
      selectedSubject: null,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      selectedGrade: null,
      selectedSubject: null,
    }),

  setSelectedGrade: (grade) => set({ selectedGrade: grade }),
  setSelectedSubject: (subject: string | null) => set({ selectedSubject: subject }),
}));
