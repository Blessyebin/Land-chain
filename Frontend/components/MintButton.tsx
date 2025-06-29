'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import issuerAbi from '@/abi/Issuer.json';

const ISSUER_CONTRACT = process.env.NEXT_PUBLIC_ISSUER_CONTRACT!;
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT!;
const DON_ID = process.env.NEXT_PUBLIC_DON_ID!;
const SUBSCRIPTION_ID = Number(process.env.NEXT_PUBLIC_SUBSCRIPTION_ID!);
const GAS_LIMIT = 300000;

export default function MintButton() {
  const [toAddress, setToAddress] = useState('');
  const [metadataUrl, setMetadataUrl] = useState('');
  const [amount, setAmount] = useState(1000);
  const [minting, setMinting] = useState(false);

  const handleMint = async () => {
    try {
      setMinting(true);

      if (!window.ethereum) {
        alert('Please install MetaMask');
        return;
      }

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
    <div className="mt-6 border p-4 rounded shadow">
      <label className="block mb-2 font-semibold">Recipient Address (`to`):</label>
      <input
        type="text"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        placeholder="0xRecipientAddress"
        className="border p-2 mb-4 w-full"
      />

      <label className="block mb-2 font-semibold">Metadata URL:</label>
      <input
        type="text"
        value={metadataUrl}
        onChange={(e) => setMetadataUrl(e.target.value)}
        placeholder="https://gateway.pinata.cloud/ipfs/..."
        className="border p-2 mb-4 w-full"
      />

      <label className="block mb-2 font-semibold">Amount to Mint:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border p-2 mb-4 w-full"
      />

      <button
        onClick={handleMint}
        disabled={minting || !toAddress || !metadataUrl || amount <= 0}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {minting ? 'Minting...' : 'Mint NFT'}
      </button>
    </div>
  );
}