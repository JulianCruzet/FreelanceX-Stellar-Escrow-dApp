import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PasskeyKit } from 'passkey-kit';

// TODO: Integrate with Stellar passkey

const Navbar = () => {
  const location = useLocation();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // const passkeyKit = new PasskeyKit({
  //   rpcUrl: 'https://horizon-testnet.stellar.org',
  //   networkPassphrase: 'Test SDF Network ; September 2015',
  //   factoryContractId: 'SMART CONTRACT ADDRESS GOES HERE'
  // })

  const handleRegisterWallet = async () => {
    try {
      // const { walletAddress } = await passkeyKit.createWallet();
      setIsWalletConnected(true);
      setWalletAddress(walletAddress);
    } catch (error) {
      console.error('Wallet registration failed:', error);
    }
  }

  const handleConnectWallet = async () => {
    try {
      //const { walletAddress } = await passkeyKit.connectWallet();
      setIsWalletConnected(true);
      setWalletAddress(walletAddress); 
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

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
            {isWalletConnected ? (
              <>
                <span className="text-sm text-gray-500 truncate max-w-xs">{walletAddress}</span>
                <Link
                  to="/profile"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-orange-500 bg-orange-50 hover:bg-orange-100"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <button
                  // onClick={handleRegisterWallet}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                >
                  Register
                </button>
                <button
                  // onClick={handleConnectWallet}
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