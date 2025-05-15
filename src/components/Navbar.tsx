import React, { useState, useEffect, useCallback } from 'react';
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

// Type for account data
interface AccountData {
  keyId: string;
  contractId: string;
  displayName?: string;
}

const Navbar: React.FC = () => {
  const [PasskeyKit, setPasskeyKit] = useState<any>(null);
  const [PasskeyServer, setPasskeyServer] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const [server, setServer] = useState<any>(null);
  
  const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [showAccountSelector, setShowAccountSelector] = useState<boolean>(false);
  
  const location = useLocation();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Load the passkey-kit module dynamically
  useEffect(() => {
    const loadPasskeyKit = async () => {
      try {
        const module = await import('passkey-kit');
        setPasskeyKit(module.PasskeyKit);
        setPasskeyServer(module.PasskeyServer);
        
        // Initialize PasskeyKit and PasskeyServer
        const passkeyKit = new module.PasskeyKit({
          rpcUrl: process.env.PUBLIC_RPC_URL || "",
          networkPassphrase: process.env.PUBLIC_NETWORK_PASSPHRASE || "",
          walletWasmHash: process.env.PUBLIC_WALLET_WASM_HASH || "",
          timeoutInSeconds: 30,
        });

        const passkeyServer = new module.PasskeyServer({
          rpcUrl: process.env.PUBLIC_RPC_URL || "",
          launchtubeUrl: process.env.PUBLIC_LAUNCHTUBE_URL || "",
          launchtubeJwt: process.env.PUBLIC_LAUNCHTUBE_JWT || "",
        });
        
        setAccount(passkeyKit);
        setServer(passkeyServer);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading passkey-kit:', error);
      }
    };
    
    loadPasskeyKit();
  }, []);

  // Helper function to check if a route is active
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Load saved accounts from localStorage
  useEffect(() => {
    const loadSavedAccounts = () => {
      try {
        const savedAccountsJson = localStorage.getItem('freelanceX:accounts');
        if (savedAccountsJson) {
          const savedAccounts = JSON.parse(savedAccountsJson) as AccountData[];
          setAccounts(savedAccounts);
          
          // Get the last active account
          const lastActiveKeyId = localStorage.getItem('freelanceX:lastActiveKeyId');
          if (lastActiveKeyId && savedAccounts.some(acc => acc.keyId === lastActiveKeyId)) {
            setActiveKeyId(lastActiveKeyId);
          } else if (savedAccounts.length > 0) {
            // Default to first account if no active account is set
            setActiveKeyId(savedAccounts[0].keyId);
          }
        }
      } catch (error) {
        console.error('Error loading saved accounts:', error);
      }
    };
    
    loadSavedAccounts();
  }, []);

  // Save accounts to localStorage when they change
  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem('freelanceX:accounts', JSON.stringify(accounts));
    }
  }, [accounts]);

  // Connect wallet when activeKeyId changes and module is loaded
  useEffect(() => {
    const connectWallet = async () => {
      if (activeKeyId && isLoaded && account) {
        try {
          setLoginError(null);
          const { contractId: cid } = await account.connectWallet({
            keyId: activeKeyId,
          });
          
          setContractId(cid);
          setIsWalletConnected(true);
          setWalletAddress(truncate(cid));
          
          // Save the last active key ID
          localStorage.setItem('freelanceX:lastActiveKeyId', activeKeyId);
        } catch (error) {
          console.error('Error connecting wallet:', error);
          setLoginError('Failed to connect wallet. Please try again.');
          setIsWalletConnected(false);
        }
      }
    };

    connectWallet();
  }, [activeKeyId, isLoaded, account]);

  // Add a new account to the accounts list
  const addAccount = useCallback((keyId: string, contractId: string, displayName?: string) => {
    setAccounts(prevAccounts => {
      // Check if account already exists
      const existingAccount = prevAccounts.find(acc => acc.keyId === keyId);
      if (existingAccount) {
        return prevAccounts;
      }
      
      // Add new account
      return [...prevAccounts, { keyId, contractId, displayName }];
    });
  }, []);

  const handleLogin = async () => {
    if (!isLoaded || !account) {
      console.error('PasskeyKit not loaded yet');
      return;
    }
    
    try {
      setLoginError(null);
      const { keyIdBase64, contractId: cid } = await account.connectWallet();
      
      // Add the account to our list if it's new
      addAccount(keyIdBase64, cid);
      
      // Set as active account
      setActiveKeyId(keyIdBase64);
      localStorage.setItem('freelanceX:lastActiveKeyId', keyIdBase64);
      
      setContractId(cid);
      setIsWalletConnected(true);
      setWalletAddress(truncate(cid));
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleSignUp = async () => {
    if (!isLoaded || !account || !server) {
      console.error('PasskeyKit not loaded yet');
      return;
    }
    
    setCreating(true);
    setLoginError(null);

    try {
      const {
        keyIdBase64,
        contractId: cid,
        signedTx,
      } = await account.createWallet('FreelanceX', 'FreelanceX User');

      await server.send(signedTx);

      // Add the new account
      addAccount(keyIdBase64, cid, 'FreelanceX User');
      
      // Set as active account
      setActiveKeyId(keyIdBase64);
      localStorage.setItem('freelanceX:lastActiveKeyId', keyIdBase64);

      setContractId(cid);
      setIsWalletConnected(true);
      setWalletAddress(truncate(cid));
    } catch (error) {
      console.error('Sign up error:', error);
      setLoginError('Registration failed. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    setActiveKeyId(null);
    setContractId(null);
    setIsWalletConnected(false);
    setWalletAddress('');
    localStorage.removeItem('freelanceX:lastActiveKeyId');
  };

  const switchAccount = (keyId: string) => {
    setActiveKeyId(keyId);
    setShowAccountSelector(false);
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
            {loginError && (
              <div className="text-red-500 text-sm">{loginError}</div>
            )}
            
            {isWalletConnected || contractId ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => setShowAccountSelector(!showAccountSelector)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    <span className="text-sm text-gray-500 truncate max-w-xs">
                      {walletAddress || (contractId ? truncate(contractId, 4) : '')}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showAccountSelector && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b">
                          Your Accounts
                        </div>
                        {accounts.map((acc) => (
                          <button
                            key={acc.keyId}
                            onClick={() => switchAccount(acc.keyId)}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              activeKeyId === acc.keyId ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            role="menuitem"
                          >
                            {truncate(acc.contractId, 4)}
                          </button>
                        ))}
                        <div className="border-t">
                          <button
                            onClick={() => {
                              setShowAccountSelector(false);
                              handleSignUp();
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-orange-500 hover:bg-gray-50"
                            role="menuitem"
                          >
                            Add New Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
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