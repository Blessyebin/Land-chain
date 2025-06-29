// components/UploadForm.tsx
'use client';

import { useState } from 'react';

export default function UploadForm({ onSuccess }: { onSuccess: (url: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    coordinates: '',
    landDocument: null as File | null,
  });

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('coordinates', form.coordinates);
    if (form.landDocument) {
      formData.append('landDocument', form.landDocument);
    }

    try {
      const res = await fetch('http://localhost:4000/create-land-dnft', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      onSuccess(data.metadata);
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Error uploading data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" placeholder="Land Name" onChange={handleChange} className="w-full border p-2" required />
      <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2" required />
      <input type="text" name="price" placeholder="Price" onChange={handleChange} className="w-full border p-2" required />
      <input type="text" name="coordinates" placeholder="4 Coordinates (JSON format)" onChange={handleChange} className="w-full border p-2" required />
      <input type="file" name="landDocument" onChange={handleChange} className="w-full" required />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 px-4 rounded">
        {loading ? 'Uploading...' : 'Generate Metadata'}
      </button>
    </form>
  );
}