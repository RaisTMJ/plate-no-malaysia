'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPlate, Plate } from '@/lib/db';
import PlateVisual from '@/components/PlateVisual';

export default function ViewPlate() {
  const [plate, setPlate] = useState<Plate | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (!id) return;

    const fetchPlate = async () => {
      try {
        const plateData = await getPlate(parseInt(Array.isArray(id) ? id[0] : id));
        setPlate(plateData);
      } catch (error) {
        console.error('Failed to fetch plate', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlate();
  }, [id]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-100">Loading...</div>;
  }

  if (!plate) {
    return <div className="flex h-screen items-center justify-center bg-gray-100">Plate not found.</div>;
  }

  return (
    <div className="fixed inset-0 bg-gray-200 p-[10px] flex items-center justify-center">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
        aria-label="Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Full Screen Plate */}
      <PlateVisual
        number={plate.number}
        type={plate.type}
        state={plate.state}
        className="w-full h-full"
      />
    </div>
  );
}
