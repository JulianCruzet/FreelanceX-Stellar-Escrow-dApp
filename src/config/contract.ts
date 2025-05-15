import { Networks } from '@stellar/stellar-sdk';

export const CONTRACT_CONFIG = {
  CONTRACT_ID: process.env.REACT_APP_CONTRACT_ID || '',
  RPC_URL: process.env.REACT_APP_RPC_URL || 'https://soroban-testnet.stellar.org',
  NETWORK_PASSPHRASE: process.env.REACT_APP_NETWORK_PASSPHRASE || Networks.TESTNET,
  USDC_TOKEN_ID: process.env.REACT_APP_USDC_TOKEN_ID || '',
} as const;

// Validate required environment variables
const requiredEnvVars = ['REACT_APP_CONTRACT_ID', 'REACT_APP_USDC_TOKEN_ID'];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set in environment variables`);
  }
}); 