'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PlateForm from '@/components/PlateForm';
import PlateList from '@/components/PlateList';
import { getPlates, deletePlate, Plate } from '@/lib/db';

export default function Home() {
  const [plates, setPlates] = useState<Plate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlates = useCallback(async () => {
    try {
      const p = await getPlates();
      setPlates(p);
    } catch (error) {
      console.error('Failed to fetch plates', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlates();
  }, [fetchPlates]);

  const handlePlateAdded = () => {
    fetchPlates();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this plate?')) {
      await deletePlate(id);
      fetchPlates();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Malaysia Plate Creator</h1>
        <p className="text-center text-gray-600">Mobile-first Malaysian vehicle registration plate generator</p>
      </div>

      <PlateForm onPlateAdded={handlePlateAdded} />

      {loading ? (
        <div className="text-center mt-10">Loading plates...</div>
      ) : (
        <PlateList plates={plates} onDelete={handleDelete} />
      )}
    </div>
  );
}
