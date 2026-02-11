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
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (!plate) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Plate not found.</div>;
  }

  return (
    <div className="w-screen h-screen bg-gray-900 overflow-hidden relative">
      <style jsx global>{`
        .landscape-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }
        @media screen and (orientation: portrait) {
          .landscape-container {
            width: 100vh;
            height: 100vw;
            transform: translate(-50%, -50%) rotate(90deg);
            transform-origin: center;
            position: absolute;
            top: 50%;
            left: 50%;
          }
        }
      `}</style>

      {/* Back Button - Minimalist and floating */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-50 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
        aria-label="Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Full Screen Content */}
      <div className="landscape-container">
        <PlateVisual
          number={plate.number}
          type={plate.type}
          state={plate.state}
          fullscreen={true}
        />
      </div>
    </div>
  );
}
