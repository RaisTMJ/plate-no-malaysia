import React from 'react';
import Link from 'next/link';
import { Plate } from '@/lib/db';

interface PlateListProps {
  plates: Plate[];
  onDelete: (id: number) => void;
}

const PlateList: React.FC<PlateListProps> = ({ plates, onDelete }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Plates</h2>

      {plates.length === 0 ? (
        <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          No plates created yet. Create one above!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plates.map((plate) => (
            <div key={plate.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
              {/* Mini Preview */}
              <div className="h-24 bg-gray-100 flex items-center justify-center p-2 relative overflow-hidden">
                <div className={`
                  px-3 py-1 rounded border-2 text-sm font-bold uppercase tracking-wide
                  ${plate.type === 'Standard' ? 'bg-black text-white border-gray-600' : ''}
                  ${plate.type === 'Taxi' ? 'bg-white text-black border-black' : ''}
                  ${plate.type === 'EV' ? 'bg-white text-black border-black pl-8 relative' : ''}
                  ${plate.type === 'Diplomatic' ? 'bg-red-700 text-white border-red-800' : ''}
                `}>
                  {plate.type === 'EV' && (
                     <div className="absolute left-0 top-0 bottom-0 w-6 bg-green-600 border-r border-gray-300"></div>
                  )}
                  {plate.number}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{plate.number}</h3>
                    <p className="text-xs text-gray-500">{plate.type}</p>
                    {plate.state !== 'None' && (
                      <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs font-semibold text-gray-600 mt-1">
                        {plate.state}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/view/${plate.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-3 rounded text-center transition-colors"
                  >
                    View Full
                  </Link>
                  <button
                    onClick={() => onDelete(plate.id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold py-2 px-3 rounded transition-colors border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlateList;
