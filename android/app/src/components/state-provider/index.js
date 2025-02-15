import React, {createContext, useState, useContext} from 'react';

const StateContext = createContext();

export const StateProvider = ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('Dashboard');

  return (
    <StateContext.Provider
      value={{
        collapsed,
        setCollapsed,
        selectedComponent,
        setSelectedComponent,
      }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
