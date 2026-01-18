import React, { useState } from 'react';
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

  const handleAddPhoto = () => {
    // In a real app, this would open a file picker or camera
    alert("This would open a file picker to add a new photo.");
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    if (photos.length <= 1) {
      alert("You must have at least one photo.");
      return;
    }
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
  };

  const handleDone = () => {
    onUpdatePhotos(photos);
    onBack();
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-brand-dark">Manage Photos</h1>
        <button onClick={onBack} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
          <CloseIcon className="w-6 h-6" />
        </button>
      </header>
      <main className="flex-1 p-4">
        <p className="text-sm text-gray-600 mb-4">Drag and drop to reorder. The first photo is your main profile picture.</p>
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square group">
              <img src={photo} alt={`User photo ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="p-2 bg-white/80 text-red-600 rounded-full hover:bg-white"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {photos.length < 5 && (
            <button
              onClick={handleAddPhoto}
              className="aspect-square bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-300 hover:border-gray-400"
            >
              <PlusIcon className="w-8 h-8" />
              <span className="text-xs mt-1">Add Photo</span>
            </button>
          )}
        </div>
      </main>
      <footer className="p-4 bg-white border-t border-gray-200">
        <button onClick={handleDone} className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-brand-secondary transition-colors">
          Done
        </button>
      </footer>
    </div>
  );
};

export default PhotoManagerScreen;