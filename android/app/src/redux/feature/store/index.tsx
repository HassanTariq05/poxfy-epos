import {create} from 'zustand';
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean
  login: () => void;
  logout: () => void;
  setIsLoadingTrue: () => void;
  setIsLoadingFalse: () => void;
}

const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  login: () => set({isAuthenticated: true}),
  logout: () => set({isAuthenticated: false}),
  isLoading:false,
  setIsLoadingTrue: () => set({isLoading: true}),
  setIsLoadingFalse: () => set({isLoading: false}),
}));

export default useAuthStore;
