'use client';

import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';

export default function ConnectWallet() {
  const [account, setAccount] = useState<string>('');
  const [connected, setConnected] = useState(false);

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setConnected(true);
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnected(true);
        }
      }
    };

    checkConnection();

    // Listen for account change
    window.ethereum?.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount('');
        setConnected(false);
      } else {
        setAccount(accounts[0]);
        setConnected(true);
      }
    });
  }, []);

  return (
    <div className="mb-6">
      {connected ? (
        <div className="text-green-700 font-semibold">
          ✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      ) : (
        <button
          onClick={connect}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}