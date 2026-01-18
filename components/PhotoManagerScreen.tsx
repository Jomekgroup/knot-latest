
import React, { useState, useRef } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CloseIcon } from './icons/CloseIcon';
import { User } from '../types';

interface PhotoManagerScreenProps {
  user: User;
  onBack: () => void;
  onUpdatePhotos: (photos: string[]) => void;
}

const PhotoManagerScreen: React.FC<PhotoManagerScreenProps> = ({ user, onBack, onUpdatePhotos }) => {
  const [photos, setPhotos] = useState<string[]>(user.profileImageUrls);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (photos.length >= 6) {
      alert("Maximum 6 photos allowed in the registry.");
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPhotos([...photos, result]);
      }
      setIsProcessing(false);
      // Reset input so the same file can be picked again if deleted
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      alert("Failed to read image file.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    if (photos.length <= 1) {
      alert("Knot requires at least one primary identity photo.");
      return;
    }
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
  };

  const handleDone = () => {
    onUpdatePhotos(photos);
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col font-sans">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <h1 className="text-xl font-black text-brand-dark uppercase tracking-tight">Manage Photos</h1>
        <button onClick={onBack} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
          <CloseIcon className="w-6 h-6" />
        </button>
      </header>
      
      <main className="flex-1 p-6">
        <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Your Registry Photos</h2>
            <p className="text-xs text-gray-500 leading-relaxed">The first photo is shown to potential matches. You can have up to 6 high-quality images.</p>
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square group shadow-sm">
              <img src={photo} alt={`User photo ${index + 1}`} className="w-full h-full object-cover rounded-2xl" />
              {index === 0 && (
                  <div className="absolute top-2 left-2 bg-brand-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Main</div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="p-3 bg-white text-red-600 rounded-full shadow-xl hover:scale-110 transition-transform"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          
          {photos.length < 6 && (
            <button
              onClick={handleAddPhotoClick}
              disabled={isProcessing}
              className={`aspect-square bg-white border-2 border-dashed ${isProcessing ? 'border-gray-200' : 'border-brand-light'} rounded-2xl flex flex-col items-center justify-center text-brand-primary hover:bg-brand-light transition-all active:scale-95 shadow-sm`}
            >
              {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                  <>
                    <PlusIcon className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                  </>
              )}
            </button>
          )}
        </div>
      </main>

      <footer className="p-6 bg-white border-t border-gray-200">
        <button 
            onClick={handleDone} 
            className="w-full bg-brand-primary text-white font-black py-4 rounded-2xl text-lg shadow-xl shadow-brand-primary/20 hover:bg-brand-secondary transition-all active:scale-[0.98]"
        >
          Update Registry
        </button>
      </footer>
    </div>
  );
};

export default PhotoManagerScreen;
