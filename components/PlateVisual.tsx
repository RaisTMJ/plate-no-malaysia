import React from 'react';

interface PlateVisualProps {
  number: string;
  type: 'Standard' | 'Taxi' | 'EV' | 'Diplomatic';
  state?: string;
  className?: string;
}

const PlateVisual: React.FC<PlateVisualProps> = ({ number, type, className = '' }) => {
  // Base styles
  let containerClasses = 'relative flex items-center justify-center border-4 border-gray-300 rounded-lg shadow-lg font-bold uppercase tracking-wider overflow-hidden';
  // Use container-type for fluid sizing relative to this box
  containerClasses += ' [container-type:size]';

  const textClasses = 'text-center z-10 w-full h-full flex flex-col items-center justify-center';

  // Type-specific styles
  switch (type) {
    case 'Standard':
      containerClasses += ' bg-black text-white';
      break;
    case 'Taxi':
      containerClasses += ' bg-white text-black border-black';
      break;
    case 'EV':
      // EV style: White with green stripe on left
      containerClasses += ' bg-white text-black border-black';
      break;
    case 'Diplomatic':
      containerClasses += ' bg-red-700 text-white border-white';
      break;
    default:
      containerClasses += ' bg-black text-white';
  }

  // Calculate dynamic font size
  // Base logic:
  // If height constrained: 75% of container height (75cqh)
  // If width constrained: (Container Width / Char Count) * Aspect Ratio Factor
  // Font Aspect Ratio for Oswald is roughly 0.5 (width/height). So char width ~ 0.5em.
  // We want Total Width = CharCount * 0.5 * FontSize <= ContainerWidth
  // So FontSize <= ContainerWidth / (CharCount * 0.5) = 2 * ContainerWidth / CharCount
  // We use 1.6 factor to be safe.

  const charCount = number.length || 1;
  const isEV = type === 'EV';

  // Dynamic font size logic using CQ units
  // EV loses ~15% width to stripe
  const availableWidthFactor = isEV ? 85 : 100;
  // We calculate width constraint carefully to maximize size
  const widthConstraint = `${(availableWidthFactor * 1.6) / charCount}cqw`;
  const heightConstraint = '75cqh'; // Leave some vertical padding

  const dynamicFontSize = `min(${heightConstraint}, ${widthConstraint})`;

  const isPutrajaya = number.toUpperCase().startsWith('PUTRAJAYA');

  return (
    <div className={`${containerClasses} ${className}`} style={{ width: '100%', height: '100%' }}>
      {/* EV Green Stripe (JPJePlate) */}
      {isEV && (
        <div className="absolute left-0 top-0 bottom-0 w-[15cqw] bg-green-600 flex flex-col items-center justify-center text-white font-bold border-r border-gray-300 z-20">
           <span className="mb-[1cqh]" style={{ fontSize: '3cqw' }}>MAL</span>
           {/* Simple representation of flag/emblem */}
           <div className="bg-blue-900 relative overflow-hidden mb-[1cqh]" style={{ width: '8cqw', height: '4cqw' }}>
             <div className="absolute top-0 left-0 bg-yellow-400 rounded-full" style={{ width: '4cqw', height: '2cqw' }}></div>
             <div className="absolute bottom-0 right-0 w-full bg-red-600" style={{ height: '1cqw' }}></div>
           </div>
        </div>
      )}

      {/* Plate Text Container */}
      <div
        className={`${textClasses}`}
        style={{
          paddingLeft: isEV ? '15cqw' : '0'
        }}
      >
        <span
          className={`${isPutrajaya ? 'italic font-serif' : ''}`}
          style={{
            fontFamily: isPutrajaya ? undefined : 'var(--font-oswald), sans-serif',
            fontSize: dynamicFontSize,
            lineHeight: 1,
            whiteSpace: 'nowrap'
          }}
        >
          {number}
        </span>
      </div>
    </div>
  );
};

export default PlateVisual;
