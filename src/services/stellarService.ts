import StellarSdk from '@stellar/stellar-sdk';

// Get network passphrase from environment variable
const networkPassphrase = process.env.REACT_APP_STELLAR_NETWORK === 'mainnet' 
  ? 'public'
  : 'testnet';

// Validate escrow contract address
const ESCROW_CONTRACT_ADDRESS = process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS;
if (!ESCROW_CONTRACT_ADDRESS) {
  console.warn('Escrow contract address not found in environment variables');
}

export interface JobDetails {
  title: string;
  description: string;
  budget: string;
  skills: string;
  duration: string;
  milestones: {
    title: string;
    description: string;
    percentage: number;
    dueDate: string;
  }[];
}

interface Balance {
  asset_type: string;
  balance: string;
}

export const createJobEscrow = async (
  clientSecretKey: string,
  budget: number,
  jobId: string
) => {
  const sdk = StellarSdk;

  try {
    // Initialize server
    const server = new sdk.Server(process.env.REACT_APP_HORIZON_URL || 'https://horizon-testnet.stellar.org');

    // Load client account
    const clientKeypair = sdk.Keypair.fromSecret(clientSecretKey);
    const clientAccount = await server.loadAccount(clientKeypair.publicKey());

    // Convert budget to lumens (1 XLM = 1,000,000 stroops)
    const budgetInStroops = Math.floor(budget * 1000000);

    // Create payment operation to escrow contract
    const paymentOp = sdk.Operation.payment({
      destination: ESCROW_CONTRACT_ADDRESS || 'mock-escrow-address',
      asset: sdk.Asset.native(),
      amount: budgetInStroops.toString(),
    });

    // Build and sign transaction
    const transaction = new sdk.TransactionBuilder(clientAccount, {
      fee: '100',
      networkPassphrase,
    })
      .addOperation(paymentOp)
      .setTimeout(30)
      .build();

    transaction.sign(clientKeypair);

    // Submit transaction
    const result = await server.submitTransaction(transaction);
    return result;
  } catch (error) {
    console.error('Error creating job escrow:', error);
    throw error;
  }
};

export const validateSecretKey = (secretKey: string): boolean => {
  const sdk = StellarSdk;

  try {
    sdk.Keypair.fromSecret(secretKey);
    return true;
  } catch (error) {
    return false;
  }
};

export const checkAccountExists = async (publicKey: string): Promise<boolean> => {
  const sdk = StellarSdk;

  try {
    const server = new sdk.Server(process.env.REACT_APP_HORIZON_URL || 'https://horizon-testnet.stellar.org');
    await server.loadAccount(publicKey);
    return true;
  } catch (error) {
    return false;
  }
};

export const getAccountBalance = async (publicKey: string): Promise<number> => {
  const sdk = StellarSdk;

  try {
    const server = new sdk.Server(process.env.REACT_APP_HORIZON_URL || 'https://horizon-testnet.stellar.org');
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find((b: Balance) => b.asset_type === 'native');
    return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
  } catch (error) {
    console.error('Error getting account balance:', error);
    throw error;
  }
}; 