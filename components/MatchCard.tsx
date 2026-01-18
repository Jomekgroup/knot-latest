
import React, { useState, useMemo } from 'react';
import { Match, User } from '../types';
import { VerifiedIcon } from './icons/VerifiedIcon';
import { calculateMatchScore } from '../services/matchingService';

interface MatchCardProps {
  match: Match;
  user: User;
  onCardClick: (match: Match) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, user, onCardClick }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  const score = useMemo(() => calculateMatchScore(user, match), [user, match]);
  
  const photos = match.profileImageUrls && match.profileImageUrls.length > 0 
    ? match.profileImageUrls 
    : ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'];

  const handlePhotoTap = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); 
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const isRightSide = clientX > left + width / 2;

    if (isRightSide) {
      setCurrentPhotoIndex(prev => Math.min(prev + 1, photos.length - 1));
    } else {
      setCurrentPhotoIndex(prev => Math.max(prev - 1, 0));
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-800"
    >
      <div
        className="relative aspect-square bg-gray-200 dark:bg-gray-800 cursor-pointer"
        onClick={() => onCardClick(match)}
      >
        <img
          src={photos[currentPhotoIndex]}
          alt={`${match.name}'s photo`}
          className="w-full h-full object-cover"
        />

        {/* Compatibility Badge - Top Right */}
        <div className="absolute top-4 right-4 z-20">
            <div className="bg-brand-primary/90 dark:bg-brand-accent/90 backdrop-blur-md text-brand-accent dark:text-brand-primary px-3 py-1.5 rounded-full shadow-lg border border-white/20 dark:border-black/10 flex flex-col items-center">
                <span className="text-[14px] font-black leading-none">{score}%</span>
                <span className="text-[7px] font-black uppercase tracking-tighter mt-0.5">Match</span>
            </div>
        </div>

        {/* Gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

        {/* Indicators */}
        {photos.length > 1 && (
          <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5">
            {photos.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-5 rounded-full transition-colors duration-300 ${
                  index === currentPhotoIndex ? 'bg-white shadow-sm' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute inset-0" onClick={handlePhotoTap} />
        
        {/* Member Info Overlay - Positioned for instant visibility */}
        <div className="absolute bottom-5 left-6 right-6 text-white pointer-events-none">
            <div className="flex items-center">
                <h3 className="text-2xl font-black tracking-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                    {match.name}, {match.age}
                </h3>
                {match.isVerified && (
                  <div className="bg-white rounded-full p-0.5 ml-2 shadow-sm">
                    <VerifiedIcon className="w-4 h-4 text-brand-primary" />
                  </div>
                )}
            </div>
            <div className="mt-1 space-y-0.5">
              <p className="text-[11px] font-bold text-white/95 uppercase tracking-wider" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {match.occupation}
              </p>
              <p className="text-[10px] font-medium text-white/80 uppercase tracking-widest" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {match.city}, {match.country}
              </p>
            </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <p className="text-xs text-gray-600 dark:text-gray-400 italic line-clamp-2 leading-relaxed">
          "{match.marriageExpectations || match.bio}"
        </p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">Marriage Timeline</span>
            <span className="text-[10px] text-brand-primary dark:text-brand-accent font-black uppercase tracking-wider">{match.marriageTimeline}</span>
          </div>
          <button 
            onClick={() => onCardClick(match)}
            className="bg-brand-primary dark:bg-brand-accent text-white dark:text-brand-dark font-black px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-brand-secondary transition-all shadow-lg active:scale-95"
          >
            Review Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;