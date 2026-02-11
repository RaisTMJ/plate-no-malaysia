import React from 'react';

interface PlateVisualProps {
  number: string;
  type: 'Standard' | 'Taxi' | 'EV' | 'Diplomatic';
  state?: string;
  className?: string;
}

const PlateVisual: React.FC<PlateVisualProps> = ({ number, type, state, className = '' }) => {
  // Base styles
  let containerClasses = 'relative flex items-center justify-center border-4 border-gray-300 rounded-lg shadow-lg font-bold uppercase tracking-wider overflow-hidden';
  let textClasses = 'text-center z-10';

  // Type-specific styles
  switch (type) {
    case 'Standard':
      containerClasses += ' bg-black text-white';
      break;
    case 'Taxi':
      containerClasses += ' bg-white text-black border-black';
      break;
    case 'EV':
      // JPJePlate style: White with green stripe on left
      // Wait, wiki says: "white reflective background and a green stripe... show the international oval code 'MAL' and the Malaysian Flag".
      // But user also mentioned "standard, Taxi, Ev...".
      // Let's go with the new JPJePlate style as it's distinctive for EV.
      containerClasses += ' bg-white text-black border-black pl-16';
      break;
    case 'Diplomatic':
      containerClasses += ' bg-red-700 text-white border-white';
      break;
    default:
      containerClasses += ' bg-black text-white';
  }

  // Helper for Putrajaya stylized text
  // If the number starts with "PUTRAJAYA", we can style that part differently if needed,
  // but for now, we'll just render the text.
  // Many Putrajaya plates use a specific italic font for the word "Putrajaya".
  const isPutrajaya = number.toUpperCase().startsWith('PUTRAJAYA');

  return (
    <div className={`${containerClasses} ${className}`} style={{ minHeight: '120px', minWidth: '300px' }}>
      {/* EV Green Stripe (JPJePlate) */}
      {type === 'EV' && (
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-green-600 flex flex-col items-center justify-center text-white text-xs font-bold border-r border-gray-300">
           <span className="mb-1">MAL</span>
           {/* Simple representation of flag/emblem */}
           <div className="w-8 h-4 bg-blue-900 relative overflow-hidden mb-1">
             <div className="absolute top-0 left-0 w-4 h-2 bg-yellow-400 rounded-full"></div>
             <div className="absolute bottom-0 right-0 w-full h-1 bg-red-600"></div>
           </div>
        </div>
      )}

      {/* Plate Text */}
      <div className={`${textClasses} flex flex-col items-center justify-center w-full h-full`}>
        {/* If Putrajaya, maybe use a different font for the word? */}
        <span
          className={`text-5xl md:text-7xl ${isPutrajaya ? 'italic font-serif' : ''}`}
          style={{ fontFamily: isPutrajaya ? undefined : 'var(--font-oswald), sans-serif' }}
        >
          {number}
        </span>

        {/* Optional State Label (small at bottom, mostly for dealer plates, but can be nice) */}
        {/*
        {state && state !== 'None' && (
           <span className="text-xs absolute bottom-1 right-2 opacity-70">{state}</span>
        )}
        */}
      </div>
    </div>
  );
};

export default PlateVisual;
