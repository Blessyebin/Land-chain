'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import issuerAbi from '@/abi/Issuer.json';

const ISSUER_CONTRACT = process.env.NEXT_PUBLIC_ISSUER_CONTRACT!;
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT!;
const DON_ID = process.env.NEXT_PUBLIC_DON_ID!;
const SUBSCRIPTION_ID = Number(process.env.NEXT_PUBLIC_SUBSCRIPTION_ID!);
const GAS_LIMIT = 300000;

export default function MintButton() {
  const [amount, setAmount] = useState(1000);
  const [metadataUrl, setMetadataUrl] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [minting, setMinting] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setToAddress(accounts[0]);
      }
    };
    fetchAddress();
  }, []);

  const handleMint = async () => {
    try {
      setMinting(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(ISSUER_CONTRACT, issuerAbi, signer);

      const tx = await contract.issue(
        toAddress,
        amount,
        metadataUrl,
        SUBSCRIPTION_ID,
        GAS_LIMIT,
        DON_ID
      );

      await tx.wait();
      alert('✅ Minting transaction sent!');
    } catch (err: any) {
      console.error(err);
      alert(`❌ ${err.message || 'Error occurred during mint'}`);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="mt-6">
      <label className="block mb-2">Mint To Address:</label>
      <input
        type="text"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        className="border p-2 mb-4 w-full"
        placeholder="0xYourAddress"
      />

      <label className="block mb-2">Amount to Mint:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border p-2 mb-4 w-full"
      />

      <label className="block mb-2">Metadata URL:</label>
      <input
        type="text"
        value={metadataUrl}
        onChange={(e) => setMetadataUrl(e.target.value)}
        className="border p-2 mb-4 w-full"
        placeholder="https://gateway.pinata.cloud/ipfs/..."
      />

      <button
        onClick={handleMint}
        disabled={minting || !metadataUrl || !toAddress}
        className="bg-green-600 text-white py-2 px-4 rounded"
      >
        {minting ? 'Minting...' : 'Mint NFT'}
      </button>
    </div>
  );
}