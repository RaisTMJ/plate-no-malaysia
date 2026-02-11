import React from 'react';

interface PlateVisualProps {
  number: string;
  type: 'Standard' | 'Taxi' | 'EV' | 'Diplomatic';
  state?: string;
  className?: string;
  fullscreen?: boolean;
}

const PlateVisual: React.FC<PlateVisualProps> = ({ number, type, state, className = '', fullscreen = false }) => {
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
      containerClasses += ' bg-white text-black border-black pl-16';
      break;
    case 'Diplomatic':
      containerClasses += ' bg-red-700 text-white border-white';
      break;
    default:
      containerClasses += ' bg-black text-white';
  }

  // Helper for Putrajaya stylized text
  const isPutrajaya = number.toUpperCase().startsWith('PUTRAJAYA');

  if (fullscreen) {
    // In fullscreen mode, we use SVG to ensure the text scales to fill the container (screen)
    // We adjust the viewBox based on character length to minimize letterboxing.
    // Approximate aspect ratio per character for Oswald is ~0.5-0.6 width per 1 height.
    const charWidth = 0.55;
    // Add a bit of padding (horizontal) in the viewBox calculation
    const viewBoxWidth = Math.max(number.length * charWidth, 1);
    const viewBoxHeight = 1;

    return (
      <div className={`${containerClasses} ${className} w-full h-full`}>
        {/* EV Green Stripe (JPJePlate) */}
        {type === 'EV' && (
          <div className="absolute left-0 top-0 bottom-0 w-[10%] min-w-[50px] bg-green-600 flex flex-col items-center justify-center text-white text-[2vw] font-bold border-r border-gray-300">
             <span className="mb-[1vh]">MAL</span>
             <div className="w-[50%] h-[2%] min-h-[10px] bg-blue-900 relative overflow-hidden mb-[1vh]">
               <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-yellow-400 rounded-full"></div>
               <div className="absolute bottom-0 right-0 w-full h-[25%] bg-red-600"></div>
             </div>
          </div>
        )}

        <div className={`${textClasses} w-full h-full flex items-center justify-center`}>
           <svg
             viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
             preserveAspectRatio="xMidYMid meet"
             className="w-full h-full p-2"
           >
             <text
               x={viewBoxWidth / 2}
               y={viewBoxHeight / 2}
               fontSize={viewBoxHeight * 0.85}
               fontFamily={isPutrajaya ? 'serif' : 'var(--font-oswald), sans-serif'}
               fontWeight="bold"
               fontStyle={isPutrajaya ? 'italic' : 'normal'}
               textAnchor="middle"
               dominantBaseline="middle"
               fill="currentColor"
             >
               {number}
             </text>
           </svg>
        </div>
      </div>
    );
  }

  // Default non-fullscreen rendering
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
        <span
          className={`text-5xl md:text-7xl ${isPutrajaya ? 'italic font-serif' : ''}`}
          style={{ fontFamily: isPutrajaya ? undefined : 'var(--font-oswald), sans-serif' }}
        >
          {number}
        </span>
      </div>
    </div>
  );
};

export default PlateVisual;
