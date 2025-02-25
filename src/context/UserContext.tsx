import React, { createContext, useState, useContext, ReactNode } from 'react';
import { getData, setData } from '../hooks/localStorage';

interface UserContextProps {
  token: string | null;
  user: string | null;
  clearToken: () => void
  setUserAndToken: (accessToken:string|null, accessUser:string|null) => void
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {accessToken, accessUser} = getData();
  const [token, setToken] = useState<string | null>(accessToken);
  const [user, setUser] = useState<string | null>(accessUser);

  const clearToken = () => {
    setToken(null)
    setUser(null)
    setData({accessToken: '', accessUser: ''})
  }

  const setUserAndToken = (accessToken:string|null, accessUser:string|null) => {
    setToken(accessToken)
    setUser(accessUser)
  }

  return (
    <UserContext.Provider value={{ token, user, setUserAndToken, clearToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};