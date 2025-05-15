import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    freighterApi?: {
      isConnected: () => Promise<boolean>;
      connect: () => Promise<string>;
      disconnect: () => Promise<void>;
      getPublicKey: () => Promise<string>;
    };
  }
}

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    try {
      if (!window.freighterApi) {
        throw new Error('Freighter wallet not found. Please install Freighter extension.');
      }

      const connected = await window.freighterApi.isConnected();
      setIsConnected(connected);

      if (connected) {
        const key = await window.freighterApi.getPublicKey();
        setPublicKey(key);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check wallet connection');
      setIsConnected(false);
      setPublicKey(null);
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      if (!window.freighterApi) {
        throw new Error('Freighter wallet not found. Please install Freighter extension.');
      }

      const key = await window.freighterApi.connect();
      setPublicKey(key);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      setIsConnected(false);
      setPublicKey(null);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (!window.freighterApi) {
        throw new Error('Freighter wallet not found. Please install Freighter extension.');
      }

      await window.freighterApi.disconnect();
      setIsConnected(false);
      setPublicKey(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    isConnected,
    publicKey,
    error,
    connect,
    disconnect,
  };
} 