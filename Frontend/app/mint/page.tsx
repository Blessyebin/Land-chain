// app/mint/page.tsx
'use client';

import { useState } from 'react';
import UploadForm from '../../components/UploadForm';
import MetadataCard from '../../components/MetadataCard';
import MetadataPreview from '../../components/MetadataPreview';
import MintButton from '../../components/MintButton';
import ConnectWallet from '../../components/ConnectWallet';
import ManualMint from '../../components/ManualMint';
import LandUploader from '../../components/LandUploader';

export default function MintPage() {
  const [metadataUrl, setMetadataUrl] = useState('');

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Mint Land NFT</h1>
      <ConnectWallet /> {/* 👈 Add this line */}
      <UploadForm onSuccess={setMetadataUrl} />
      {metadataUrl && (
        <>
          <MetadataCard url={metadataUrl} />
          <MetadataPreview metadataUrl={metadataUrl} />
          <MintButton metadataUrl={metadataUrl} />
        </>
      )}
      <MintButton />
    </div>
  );
}