import { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar } from '../shared/SnackBar';

interface SnackbarContextProps {
  showSnackbar: (message: string, type?: 'success' | 'error' ) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const useSnackbar = (): SnackbarContextProps => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<'success' | 'error' | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const showSnackbar = (message: string, type: 'error' | 'success' = 'success') => {
    setMessage(message);
    setType(type);
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
      setMessage(null);
      setType(null);
    }, 3000); // Hide the snackbar after 3 seconds
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar message={message} type={type} isVisible={isVisible} />
    </SnackbarContext.Provider>
  );
};
