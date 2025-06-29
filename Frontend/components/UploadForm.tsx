'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [metadataUri, setMetadataUri] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMetadataUri('');

    if (!file) {
      setError('Please upload a land document.');
      return;
    }

    let parsedCoords;
    try {
      parsedCoords = JSON.parse(coordinates);
      if (!Array.isArray(parsedCoords) || parsedCoords.length !== 4) {
        throw new Error('Coordinates must be a valid array of 4 points');
      }
    } catch (err) {
      setError('Invalid coordinates JSON format.');
      return;
    } 

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('coordinates', coordinates);
    formData.append('landDocument', file);

    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/create-land-dnft', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const data = await res.json();
      const uri = data.metadataUri || data.gateway?.metadata;
      if (!uri) throw new Error('No metadata URI returned');

      setMetadataUri(uri);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow space-y-6">
      <h2 className="text-xl font-semibold">Upload Land Metadata</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Price in USD"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <textarea
          placeholder='Coordinates (JSON) — Example: [[6.42,3.43],[6.42,3.43],[6.42,3.43],[6.42,3.43]]'
          value={coordinates}
          onChange={(e) => setCoordinates(e.target.value)}
          required
          className="border p-2 w-full h-28 font-mono text-sm"
        />
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          className="border p-2 w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          {loading ? 'Uploading...' : 'Upload & Generate Metadata'}
        </button>
      </form>

      {metadataUri && (
        <div className="bg-green-50 border border-green-300 p-4 rounded">
          <p className="text-green-700 font-semibold">✅ Metadata URI:</p>
          <p className="break-all text-sm mb-2">{metadataUri}</p>
          <p className="text-green-700 font-semibold">🌐 Gateway:</p>
          <a
            href={metadataUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
            target="_blank"
            className="text-blue-700 underline break-all text-sm"
          >
            {metadataUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
          </a>
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-100 border border-red-300 p-3 rounded">
          ❌ {error}
        </div>
      )}
    </div>
  );
}