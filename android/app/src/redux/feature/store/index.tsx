import {create} from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  headerUrl: string;
  salesId: string;
  salesFlag: boolean;
  isLoading: boolean;
  outletChange: boolean;
  redirectToProcessSales: boolean;
  customerId: string;
  login: () => void;
  logout: () => void;
  setIsLoadingTrue: () => void;
  setIsLoadingFalse: () => void;
  setHeaderUrl: (url: string) => void;
  setSalesId: (id: string) => void;
  setSalesFlag: (flag: boolean) => void;
  toggleOutletChange: () => void;
  setRedirectToProcessSalesTrue: () => void;
  setRedirectToProcessSalesFalse: () => void;
  setCustomerId: (id: string) => void;
}

const useAuthStore = create<AuthState>(set => ({
  headerUrl: '',
  salesId: '',
  salesFlag: false,
  customerId: '',
  setSalesFlag: (flag: boolean) => set({salesFlag: flag}),
  setSalesId: (id: string) => set({salesId: id}),
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
  setCustomerId: (id: string) => set({customerId: id}),
}));

export default useAuthStore;
