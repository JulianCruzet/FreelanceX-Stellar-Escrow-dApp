import React, { createContext, useContext, useState, ReactNode } from 'react';

type WalletContextType = {
  contractId: string | null;
  setContractId: (id: string | null) => void;
  isWalletConnected: boolean;
  setIsWalletConnected: (connected: boolean) => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [contractId, setContractId] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <WalletContext.Provider value={{ contractId, setContractId, isWalletConnected, setIsWalletConnected }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
};
