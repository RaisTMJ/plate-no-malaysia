import React, { useState, useEffect } from 'react';
import { addPlate, Plate } from '@/lib/db';

interface PlateFormProps {
  onPlateAdded: () => void;
}

const states = [
  'None', 'Putrajaya', 'Kuala Lumpur', 'Johor', 'Sabah', 'Sarawak', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Selangor', 'Terengganu'
];

const plateTypes = ['Standard', 'Taxi', 'EV', 'Diplomatic'];

// Random plate generator
const generateRandomPlate = () => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
  const randomNum = () => Math.floor(Math.random() * 9999) + 1;

  // Standard format: ABC 1234
  return `${randomLetter()}${randomLetter()} ${randomNum()}`;
};

const PlateForm: React.FC<PlateFormProps> = ({ onPlateAdded }) => {
  const [number, setNumber] = useState('');
  const [type, setType] = useState('Standard');
  const [state, setState] = useState('None');

  // Load a recommendation on mount
  useEffect(() => {
    setNumber(generateRandomPlate());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) return;

    try {
      await addPlate({
        number: number.toUpperCase(),
        type: type as any,
        state,
      });
      // Reset form (generate new recommendation)
      setNumber(generateRandomPlate());
      setState('None');
      onPlateAdded();
    } catch (error) {
      console.error('Failed to add plate', error);
      alert('Failed to add plate. Please try again.');
    }
  };

  // Handle State selection effect on Number
  // e.g. selecting "Putrajaya" -> Suggest "PUTRAJAYA 1234" format?
  // Or just leave it as metadata.
  // For now, let's keep it simple: State is metadata, unless it's Putrajaya special.
  const handleStateChange = (newState: string) => {
    setState(newState);
    if (newState === 'Putrajaya') {
       // Suggest Putrajaya format if not already typed
       if (!number.startsWith('PUTRAJAYA')) {
         setNumber(`PUTRAJAYA ${Math.floor(Math.random() * 9999) + 1}`);
       }
    } else if (newState === 'Kuala Lumpur') {
       if (!number.startsWith('W') && !number.startsWith('V')) {
          setNumber(`V ${Math.floor(Math.random() * 9999) + 1}`);
       }
    } else if (newState === 'Johor') {
       if (!number.startsWith('J')) {
          setNumber(`J${generateRandomPlate().substring(2)}`); // Keep random letters after J
       }
    }
    // ... other states ...
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create New Plate</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="number">
          Plate Number
        </label>
        <input
          id="number"
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value.toUpperCase())}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline uppercase font-mono"
          placeholder="W 1234 A"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Recommended format pre-filled.</p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="type">
          Plate Style
        </label>
        <div className="flex flex-wrap gap-2">
           {plateTypes.map((t) => (
             <button
               key={t}
               type="button"
               onClick={() => setType(t)}
               className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                 type === t
                   ? 'bg-blue-600 text-white'
                   : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
               }`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="state">
          State / Region
        </label>
        <select
          id="state"
          value={state}
          onChange={(e) => handleStateChange(e.target.value)}
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Add Plate
        </button>
      </div>
    </form>
  );
};

export default PlateForm;
