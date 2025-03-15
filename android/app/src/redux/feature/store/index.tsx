import {create} from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  headerUrl: string;
  isLoading: boolean;
  outletChange: boolean;
  redirectToProcessSales: boolean;
  login: () => void;
  logout: () => void;
  setIsLoadingTrue: () => void;
  setIsLoadingFalse: () => void;
  setHeaderUrl: (url: string) => void;
  toggleOutletChange: () => void;
  setRedirectToProcessSalesTrue: () => void;
  setRedirectToProcessSalesFalse: () => void;
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
  outletChange: false,
  toggleOutletChange: () => set(state => ({outletChange: !state.outletChange})),
  redirectToProcessSales: false,
  setRedirectToProcessSalesTrue: () => set({redirectToProcessSales: true}),
  setRedirectToProcessSalesFalse: () => set({redirectToProcessSales: false}),
}));

export default useAuthStore;
