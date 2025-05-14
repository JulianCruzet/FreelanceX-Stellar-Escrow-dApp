import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnectWallet = async () => {
    // TODO: Integrate with Freighter wallet
    setIsWalletConnected(true);
    setWalletAddress('GABC...1234'); // Mock address
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="w-full px-12">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                FreelanceX
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <div className="hidden sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/')
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-500 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/jobs')
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-500 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                Find Work
              </Link>
              <Link
                to="/create-job"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/create-job')
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-500 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                Post a Job
              </Link>
            </div>
            <div className="flex items-center">
              {isWalletConnected ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{walletAddress}</span>
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-orange-500 bg-orange-50 hover:bg-orange-100"
                  >
                    Profile
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleConnectWallet}
                  className="inline-flex items-center px-4 py-2 border-none text-sm font-medium rounded-xl text-white bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 