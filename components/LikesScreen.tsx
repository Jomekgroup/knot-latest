
import React from 'react';
import { Match } from '../types';

interface LikesScreenProps {
  likedMatches: Match[];
  onMatchClick: (match: Match) => void;
}

const LikesScreen: React.FC<LikesScreenProps> = ({ likedMatches, onMatchClick }) => {
  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold text-brand-dark mb-4">Who Likes You</h1>
      {likedMatches.length === 0 ? (
        <div className="text-center py-20">
            <p className="text-gray-600">No one has liked your profile yet.</p>
            <p className="text-sm text-gray-500">Keep exploring and check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {likedMatches.map((match) => (
            <div key={match.id} onClick={() => onMatchClick(match)} className="cursor-pointer group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <img src={match.profileImageUrls[0]} alt={match.name} className="w-full h-56 object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-2 text-white">
                <p className="font-bold text-sm truncate">{match.name}, {match.age}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikesScreen;