
import React, { useState, useEffect } from 'react';
import { FilterState } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  initialFilters: FilterState;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, currentFilters, onApplyFilters, initialFilters }) => {
  const [tempFilters, setTempFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    // Sync with parent state when modal opens
    if (isOpen) {
      setTempFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleReset = () => {
    setTempFilters(initialFilters);
  };
  
  const handleAgeChange = (index: 0 | 1, value: string) => {
    const newAgeRange = [...tempFilters.ageRange] as [number, number];
    newAgeRange[index] = parseInt(value, 10);
    // Basic validation
    if (index === 0 && newAgeRange[0] > newAgeRange[1]) newAgeRange[1] = newAgeRange[0];
    if (index === 1 && newAgeRange[1] < newAgeRange[0]) newAgeRange[0] = newAgeRange[1];
    setTempFilters({ ...tempFilters, ageRange: newAgeRange });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-11/12 max-sm:max-w-[320px] m-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-brand-primary">Filter Matches</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <main className="p-6 space-y-6">
          {/* Age Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Age Range</label>
            <div className="flex items-center justify-between gap-4">
              <input type="number" value={tempFilters.ageRange[0]} onChange={e => handleAgeChange(0, e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-center text-black" min="18" max="99" />
              <span className="text-gray-500">-</span>
              <input type="number" value={tempFilters.ageRange[1]} onChange={e => handleAgeChange(1, e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-center text-black" min="18" max="99" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input 
              id="location"
              type="text" 
              placeholder="e.g., New York, London, Tokyo"
              value={tempFilters.location}
              onChange={e => setTempFilters({...tempFilters, location: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg text-black" 
            />
          </div>

          {/* Verified Only */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 text-brand-primary mr-2" />
                <span className="text-sm font-semibold text-gray-700">Show Verified Profiles Only</span>
              </span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={tempFilters.showVerifiedOnly}
                  onChange={e => setTempFilters({...tempFilters, showVerifiedOnly: e.target.checked})}
                />
                <div className={`block w-12 h-6 rounded-full transition-colors ${tempFilters.showVerifiedOnly ? 'bg-brand-primary' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${tempFilters.showVerifiedOnly ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>
        </main>
        
        <footer className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <button onClick={handleReset} className="text-sm font-semibold text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200">
            Reset
          </button>
          <button onClick={handleApply} className="text-sm font-bold text-white bg-brand-primary px-6 py-2 rounded-lg hover:bg-brand-secondary shadow">
            Apply Filters
          </button>
        </footer>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0.8; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default FilterModal;
