
import React, { useState, useEffect } from 'react';
import { Match, User } from '../types';
import { VerifiedIcon } from './icons/VerifiedIcon';
import { MessageIcon } from './icons/MessageIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';

interface ProfileDetailScreenProps {
  match: Match;
  user: User;
  onBack: () => void;
  onStartChat: (match: Match) => void;
  onStartCall: (match: Match) => void;
}

interface ProfileSectionProps {
    title: string;
    children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
    <div className="border-b border-gray-100 last:border-0">
        <div className="py-5 text-left">
            <h3 className="font-black text-lg text-brand-dark uppercase tracking-tight">{title}</h3>
        </div>
        <div className="pb-6 space-y-5 animate-fade-in">
            {children}
        </div>
    </div>
);

const ProfileDataItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{label}</p>
        <div className="text-sm text-black font-medium leading-relaxed">
            {value || <span className="text-gray-300 italic">Not specified</span>}
        </div>
    </div>
);


const ProfileDetailScreen: React.FC<ProfileDetailScreenProps> = ({ match, user, onBack, onStartChat, onStartCall }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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
    <div className="w-full h-screen bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Image Carousel */}
        <div className="relative aspect-square w-full flex-shrink-0">
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-1.5">
            {photos.map((_, index) => (
              <div key={index} className={`h-1 flex-1 rounded-full ${index === currentPhotoIndex ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
          <button onClick={onBack} className="absolute top-8 left-4 z-30 text-white bg-black/40 backdrop-blur-sm p-3 rounded-full shadow-lg active:scale-90 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="absolute inset-0" onClick={handlePhotoTap}>
              <img 
                  src={photos[currentPhotoIndex]} 
                  alt={`${match.name}'s photo ${currentPhotoIndex + 1}`} 
                  className="w-full h-full object-cover" 
              />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
        </div>

        {/* Profile Info */}
        <div className="bg-white -mt-12 rounded-t-[3rem] z-10 relative">
          <div className="p-8 pb-4">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black text-brand-dark tracking-tighter">{match.name}, {match.age}</h1>
                        {match.isVerified && (
                             <div className="bg-brand-accent rounded-full p-1 shadow-md">
                                <VerifiedIcon className="w-4 h-4 text-brand-dark" />
                            </div>
                        )}
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {match.residenceCity && match.residenceCountry ? `${match.residenceCity}, ${match.residenceCountry}` : `${match.city}, ${match.country}`}
                    </p>
                </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="px-8 space-y-2">
              <ProfileSection title={`Identity & Roots`}>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <ProfileDataItem label="Marital Status" value={match.maritalStatus} />
                      <ProfileDataItem label="Occupation" value={match.occupation} />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Current Residence</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <ProfileDataItem label="Country" value={match.residenceCountry} />
                                <ProfileDataItem label="State" value={match.residenceState} />
                                <ProfileDataItem label="City" value={match.residenceCity} />
                            </div>
                        </div>
                        
                        <div className="h-[1px] bg-gray-200 w-full"></div>
                        
                        <div className="space-y-2">
                            <h4 className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Heritage & Origin</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <ProfileDataItem label="Country" value={match.originCountry} />
                                <ProfileDataItem label="State" value={match.originState} />
                                <ProfileDataItem label="City" value={match.originCity} />
                            </div>
                            <div className="pt-2">
                                <ProfileDataItem label="Cultural Identity" value={match.culturalBackground} />
                            </div>
                        </div>
                    </div>

                  <ProfileDataItem label="Registry Bio" value={match.bio} />
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-2">
                        <ProfileDataItem label="Nationality" value={match.nationality} />
                        <ProfileDataItem label="Languages" value={match.languages.join(', ')} />
                  </div>
              </ProfileSection>

              <ProfileSection title="Lifestyle & Beliefs">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <ProfileDataItem label="Faith/Religion" value={match.religion} />
                      <ProfileDataItem label="Smoking" value={match.smoking} />
                      <ProfileDataItem label="Drinking" value={match.drinking} />
                      <ProfileDataItem label="Children" value={match.childrenStatus || 'None'} />
                  </div>
                  <ProfileDataItem label="Core Life Values" value={
                      <div className="flex flex-wrap gap-2 mt-2">
                          {match.personalValues.map(v => (
                               <span key={v} className="bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                    {v}
                               </span>
                          ))}
                      </div>
                  } />
              </ProfileSection>

              <ProfileSection title="Marriage Expectations">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <ProfileDataItem label="Vow Timeline" value={match.marriageTimeline} />
                      <ProfileDataItem label="Relocation" value={match.willingToRelocate} />
                      <ProfileDataItem label="Children Intent" value={match.childrenPreference} />
                  </div>
                  <ProfileDataItem label="Ideal Partner Traits" value={
                      <div className="flex flex-wrap gap-2 mt-2">
                          {match.idealPartnerTraits.map(t => (
                               <span key={t} className="bg-brand-light text-brand-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-brand-primary/10">
                                    {t}
                               </span>
                          ))}
                      </div>
                  } />
                   <ProfileDataItem label="Registry Expectations" value={match.marriageExpectations} />
              </ProfileSection>
          </div>
        </div>
      </div>
      
       {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white border-t border-gray-100 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => onStartChat(match)} className="flex-1 flex items-center justify-center gap-3 bg-brand-primary text-white font-black py-4 rounded-2xl text-lg hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 active:scale-95">
              <MessageIcon className="w-6 h-6" />
              <span>Chats</span>
          </button>
           <button onClick={() => onStartCall(match)} className="p-4 bg-brand-secondary text-white rounded-2xl shadow-xl hover:bg-purple-800 transition-all active:scale-95">
              <VideoCameraIcon className="w-8 h-8" />
          </button>
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default ProfileDetailScreen;
