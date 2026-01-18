import React, { useState } from 'react';
import { Match } from '../types';
import { VerifiedIcon } from './icons/VerifiedIcon';

interface MatchCardProps {
  match: Match;
  onCardClick: (match: Match) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onCardClick }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handlePhotoTap = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent card click when changing photos
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const isRightSide = clientX > left + width / 2;

    if (isRightSide) {
      setCurrentPhotoIndex(prev => Math.min(prev + 1, match.profileImageUrls.length - 1));
    } else {
      setCurrentPhotoIndex(prev => Math.max(prev - 1, 0));
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
    >
      {/* Image Container with Overlay */}
      <div
        className="relative aspect-[4/5] bg-gray-200 cursor-pointer"
        onClick={() => onCardClick(match)}
      >
        <img
          src={match.profileImageUrls[currentPhotoIndex]}
          alt={`${match.name}'s photo`}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>

        {/* Photo Carousel Indicators */}
        {match.profileImageUrls.length > 1 && (
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center gap-1.5">
            {match.profileImageUrls.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Tappable areas to navigate photos */}
        <div className="absolute inset-0" onClick={handlePhotoTap} />
        
        {/* Information overlaid on image */}
        <div className="absolute bottom-0 left-0 p-4 text-white w-full">
            <div className="flex items-center">
                <h3 className="text-2xl font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{match.name}, {match.age}</h3>
                {match.isVerified && <VerifiedIcon className="w-6 h-6 ml-2 text-white" />}
            </div>
            <p className="text-sm font-light" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{match.occupation}</p>
            <p className="text-sm font-light" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{match.city}, {match.country}</p>
        </div>
      </div>

      {/* Section below the image for marriage expectations and connect button */}
      <div className="p-4">
        <p className="text-sm text-gray-700 italic">
          "{match.marriageExpectations}"
        </p>
        <div className="flex justify-end mt-4">
          <button 
            onClick={() => onCardClick(match)}
            className="bg-brand-primary text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-brand-secondary transition-colors shadow hover:shadow-md"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;