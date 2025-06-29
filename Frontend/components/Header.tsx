'use client';

import { useEffect, useState } from 'react';
import { ethers, BrowserProvider } from 'ethers';

export default function Header() {
  const [network, setNetwork] = useState<string>('Not connected');

  useEffect(() => {
    async function fetchNetwork() {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const net = await provider.getNetwork();
          setNetwork(`${net.name} (${net.chainId})`);
        } catch (err) {
          console.error('Network error:', err);
        }
      }
    }

    fetchNetwork();

    // Update network on chain change
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        fetchNetwork();
      });
    }
  }, []);

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-green-700">🌍 Land NFT DApp</h1>
      <div className="text-sm text-gray-700">
        Network: <span className="font-medium">{network}</span>
      </div>
    </header>
  );
}
