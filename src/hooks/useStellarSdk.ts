import { useState, useEffect } from 'react';
import { getStellarSdk } from '../utils/getStellarSdk';

export const useStellarSdk = () => {
  const [sdk, setSdk] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [escrowStatus, setEscrowStatus] = useState<{
    balance: string;
    sequence: string;
    isFunded: boolean;
  } | null>(null);

  useEffect(() => {
    const loadSdk = async () => {
      try {
        setIsLoading(true);

        const StellarSdk = await getStellarSdk();
        if (!StellarSdk.Server) {
          throw new Error('StellarSdk.Server is undefined after dynamic import');
        }

        const server = new StellarSdk.Server(
          process.env.REACT_APP_HORIZON_URL || 'https://horizon-testnet.stellar.org'
        );

        const escrowAddress = process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS;
        if (!escrowAddress) {
          throw new Error('Escrow contract address is not configured');
        }

        try {
          const account = await server.loadAccount(escrowAddress);
          const nativeBalance = account.balances.find((b: any) => b.asset_type === 'native');
          setEscrowStatus({
            balance: nativeBalance ? nativeBalance.balance : '0',
            sequence: account.sequence,
            isFunded: nativeBalance ? parseFloat(nativeBalance.balance) > 0 : false,
          });
        } catch (err) {
          setEscrowStatus({
            balance: '0',
            sequence: '0',
            isFunded: false,
          });
        }

        setSdk(StellarSdk);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load Stellar SDK'));
        setSdk(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSdk();
  }, []);

  return { sdk, error, isLoading, escrowStatus };
}; 