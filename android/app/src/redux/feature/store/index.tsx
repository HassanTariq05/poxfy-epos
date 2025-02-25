import {create} from 'zustand';
interface AuthState {
  isAuthenticated: boolean;
  headerUrl: string;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setIsLoadingTrue: () => void;
  setIsLoadingFalse: () => void;
  setHeaderUrl: (url: string) => void;
}

const useAuthStore = create<AuthState>(set => ({
  headerUrl: '',
  setHeaderUrl: (url: string) => set({headerUrl: url}),
  isAuthenticated: false,
  login: () => set({isAuthenticated: true}),
  logout: () => set({isAuthenticated: false}),
  isLoading: false,
  setIsLoadingTrue: () => set({isLoading: true}),
  setIsLoadingFalse: () => set({isLoading: false}),
}));

export default useAuthStore;
