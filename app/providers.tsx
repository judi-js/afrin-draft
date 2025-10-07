import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/app/store/context/theme-provider';

interface ProviderWrapperProps {
  children: ReactNode;
}

const Providers: React.FC<ProviderWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

export default Providers;