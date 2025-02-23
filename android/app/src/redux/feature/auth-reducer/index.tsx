import {createContext, useReducer, useContext, Dispatch} from 'react';

type AuthState = {
  isAuthenticated: boolean;
};

type AuthAction = {type: 'SIGN_OUT'} | {type: 'SIGN_IN'};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}>({
  state: {isAuthenticated: true},
  dispatch: () => undefined,
});

const initialState: AuthState = {
  isAuthenticated: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {...state, isAuthenticated: true};
    case 'SIGN_OUT':
      return {...state, isAuthenticated: false};
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{state, dispatch}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
