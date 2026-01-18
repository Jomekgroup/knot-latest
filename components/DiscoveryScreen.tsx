
import React, { useMemo } from 'react';
import { Match, User } from '../types';
import { VerifiedIcon } from './icons/VerifiedIcon';
import { calculateMatchScore } from '../services/matchingService';

interface DiscoveryScreenProps {
  matches: Match[];
  user: User;
  onMatchClick: (match: Match) => void;
  onOpenFilters: () => void;
}

const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({ matches, user, onMatchClick, onOpenFilters }) => {
  const processedMatches = useMemo(() => {
    const scored = matches.map(m => ({
        ...m,
        localScore: calculateMatchScore(user, m)
    }));
    return scored.sort((a, b) => b.localScore - a.localScore);
  }, [matches, user]);

  return (
    <div className="p-0 pb-24 bg-gray-50 min-h-screen">
      <div className="p-4 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {processedMatches.map((match) => {
            const profileImage = match.profileImageUrls?.[0] || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop';
            
            return (
              <div
                key={match.id}
                onClick={() => onMatchClick(match)}
                className="relative aspect-[3/4] bg-white rounded-[1.5rem] overflow-hidden cursor-pointer group shadow-sm active:scale-95 transition-all hover:shadow-xl border border-gray-100"
              >
                <img
                  src={profileImage}
                  alt={match.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                
                <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                  <div className="flex items-center gap-1 overflow-hidden">
                    <p className="text-[11px] font-black truncate drop-shadow-md">{match.name}, {match.age}</p>
                    {match.isVerified && (
                      <div className="bg-white rounded-full p-0.5 shadow-sm flex-shrink-0">
                        <VerifiedIcon className="w-2.5 h-2.5 text-brand-primary" />
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] font-bold opacity-70 truncate uppercase tracking-tighter mt-0.5">{match.city}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {processedMatches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center px-8 bg-white rounded-[2.5rem] mt-4 border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Updating directory records...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryScreen;
