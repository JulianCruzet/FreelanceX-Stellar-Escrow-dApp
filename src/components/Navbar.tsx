import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Import passkey-kit using dynamic import to avoid TypeScript errors
// We'll initialize these in useEffect instead
let PasskeyKit: any;
let PasskeyServer: any;

// Initialize variables to hold instances
let account: any;
let server: any;

// Helper function to truncate addresses
const truncate = (str: string, length = 5): string => {
  return `${str.slice(0, length)}...${str.slice(-length)}`;
};

const Navbar: React.FC = () => {
  const [keyId, setKeyId] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const location = useLocation();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load the passkey-kit module dynamically
  useEffect(() => {
    const loadPasskeyKit = async () => {
      try {
        const module = await import('passkey-kit');
        PasskeyKit = module.PasskeyKit;
        PasskeyServer = module.PasskeyServer;
        
        // Initialize PasskeyKit with ES256 and RS256 algorithms
        account = new PasskeyKit({
          rpcUrl: process.env.VITE_RPC_URL || "https://soroban-testnet.stellar.org",
          networkPassphrase: process.env.VITE_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
          walletWasmHash: process.env.VITE_WALLET_WASM_HASH || "ecd990f0b45ca6817149b6175f79b32efb442f35731985a084131e8265c4cd90",
          timeoutInSeconds: 29,
        });

        server = new PasskeyServer({
          rpcUrl: process.env.VITE_RPC_URL || "https://soroban-testnet.stellar.org",
          launchtubeUrl: process.env.VITE_LAUNCHTUBE_URL || "https://testnet.launchtube.xyz",
          launchtubeJwt: process.env.VITE_LAUNCHTUBE_JWT || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5ZWJlOGNiMTIwYTQ1ZmJmMGU4YmMzZGYzODgxOTc2MGRhMWJlZDFjYTc3ZWYyMzk3YzYzNjY0ODk0NTdmNjc2IiwiZXhwIjoxNzUyNTA0NzMzLCJjcmVkaXRzIjoxMDAwMDAwMDAwLCJpYXQiOjE3NDUyNDcxMzN9.WSwj28KvHvd1xIzhdCY98HuJJZ_0329kRLbUn7wDDDA",
        });
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading passkey-kit:', error);
        setError('Failed to load authentication module');
      }
    };
    
    loadPasskeyKit();
  }, []);

  // Helper function to check if a route is active
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  useEffect(() => {
    // Check for existing keyId in localStorage on component mount
    if (localStorage.hasOwnProperty('ssd:keyId')) {
      const storedKeyId = localStorage.getItem('ssd:keyId');
      if (storedKeyId) {
        setKeyId(storedKeyId);
      }
    }
  }, []);

  useEffect(() => {
    // Connect wallet when keyId changes and module is loaded
    const connectWallet = async () => {
      if (keyId && isLoaded && account) {
        try {
          const { contractId: cid } = await account.connectWallet({
            keyId: keyId,
          });
          setContractId(cid);
          setIsWalletConnected(true);
          setWalletAddress(truncate(cid));
        } catch (error) {
          console.error('Error connecting wallet:', error);
          setError('Failed to connect wallet. Please try again.');
        }
      }
    };

    connectWallet();
  }, [keyId, isLoaded]);

  const handleLogin = async () => {
    if (!isLoaded || !account) {
      setError('Authentication module not loaded yet');
      return;
    }
    
    try {
      setError(null);
      const { keyIdBase64, contractId: cid } = await account.connectWallet();
      
      setKeyId(keyIdBase64);
      localStorage.setItem('ssd:keyId', keyIdBase64);
      
      setContractId(cid);
      setIsWalletConnected(true);
      setWalletAddress(truncate(cid));
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  const handleSignUp = async () => {
    if (!isLoaded || !account || !server) {
      setError('Authentication module not loaded yet');
      return;
    }
    
    setCreating(true);
    setError(null);

    try {
      const {
        keyIdBase64,
        contractId: cid,
        signedTx,
      } = await account.createWallet('FreelanceX', 'FreelanceX User');

      // Wait for server response
      const response = await server.send(signedTx);
      console.log('Wallet creation response:', response);

      setKeyId(keyIdBase64);
      localStorage.setItem('ssd:keyId', keyIdBase64);

      setContractId(cid);
      setIsWalletConnected(true);
      setWalletAddress(truncate(cid));
    } catch (error) {
      console.error('Sign up error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    setKeyId(null);
    setContractId(null);
    setIsWalletConnected(false);
    setWalletAddress('');
    setError(null);

    // Clear local storage items with ssd: prefix
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('ssd:')) {
        localStorage.removeItem(key);
      }
    });

    // Clear session storage items with ssd: prefix
    Object.keys(sessionStorage).forEach((key) => {
      if (key.includes('ssd:')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                FreelanceX
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/')
                    ? 'border-orange-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/jobs')
                    ? 'border-orange-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Find Work
              </Link>
              <Link
                to="/create-job"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/create-job')
                    ? 'border-orange-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Post a Job
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {error && (
              <span className="text-sm text-red-500">{error}</span>
            )}
            {isWalletConnected || contractId ? (
              <>
                <span className="text-sm text-gray-500 truncate max-w-xs">
                  {walletAddress || (contractId ? truncate(contractId, 4) : '')}
                </span>
                <Link
                  to="/profile"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-orange-500 bg-orange-50 hover:bg-orange-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSignUp}
                  disabled={creating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Register"}
                </button>
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 