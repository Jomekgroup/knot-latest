
import React from 'react';
import { User } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { CameraIcon } from './icons/CameraIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { VerifiedIcon } from './icons/VerifiedIcon';

interface ProfileCardProps {
  user: User;
  onEditProfile: () => void;
  onManagePhotos: () => void;
  onVerifyProfile: () => void;
  onOpenAdmin?: () => void;
}

interface ProfileSectionProps {
    title: string;
    children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div className="py-5 text-left">
            <h3 className="font-black text-lg text-brand-dark dark:text-white uppercase tracking-tight">{title}</h3>
        </div>
        <div className="pb-6 space-y-5 animate-fade-in">
            {children}
        </div>
    </div>
);

const ProfileDataItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">{label}</p>
        <div className="text-sm text-black dark:text-gray-200 font-medium leading-relaxed">
            {value || <span className="text-gray-300 dark:text-gray-600 italic">Not specified</span>}
        </div>
    </div>
);


const ProfileCard: React.FC<ProfileCardProps> = ({ user, onEditProfile, onManagePhotos, onVerifyProfile, onOpenAdmin }) => {
  // Only user_0 (super-admin) sees the command center
  const isAdmin = user.id === 'user_0';

  return (
    <div className="bg-white dark:bg-brand-dark min-h-screen transition-colors">
        <div className="relative">
            <img className="h-64 w-full object-cover" src={user.profileImageUrls[0]} alt={user.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-10 left-6 right-6 text-white">
                <div className="flex items-center gap-2">
                    <h1 className="text-4xl font-black tracking-tighter">{user.name}, {user.age}</h1>
                    {user.isVerified && (
                        <div className="bg-brand-accent rounded-full p-1 shadow-lg">
                            <VerifiedIcon className="w-5 h-5 text-brand-dark" />
                        </div>
                    )}
                </div>
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest mt-1">
                  {user.residenceCity && user.residenceCountry ? `${user.residenceCity}, ${user.residenceCountry}` : `${user.city}, ${user.country}`}
                </p>
            </div>
        </div>

        <div className="px-6 pb-24">
            {/* Quick Actions */}
            <div className="flex justify-around items-center text-center -mt-8 mb-10 relative z-20">
                 <button onClick={onManagePhotos} className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-20 h-20 text-gray-400 dark:text-gray-500 hover:text-brand-primary dark:hover:text-brand-accent transition-all active:scale-95 border border-gray-100 dark:border-gray-700">
                    <CameraIcon className="w-6 h-6 mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Gallery</span>
                </button>
                 <button onClick={onEditProfile} className="flex flex-col items-center justify-center bg-brand-primary dark:bg-brand-accent rounded-3xl shadow-2xl w-28 h-28 text-white dark:text-brand-dark hover:bg-brand-secondary dark:hover:bg-brand-accent/90 transition-all active:scale-95 scale-110">
                    <PencilIcon className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Edit Profile</span>
                </button>
                 <button 
                    onClick={onVerifyProfile} 
                    disabled={user.isVerified} 
                    className={`flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-20 h-20 transition-all active:scale-95 border ${user.isVerified ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-100 dark:border-gray-700 overflow-hidden'}`}
                >
                    {!user.isVerified && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent animate-shimmer pointer-events-none"></div>}
                    {user.isVerified ? <VerifiedIcon className="w-6 h-6 mb-1 text-green-600 dark:text-green-400" /> : <ShieldCheckIcon className="w-6 h-6 mb-1 text-brand-secondary dark:text-gray-500" />}
                    <span className={`text-[8px] font-black uppercase tracking-widest ${user.isVerified ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        {user.isVerified ? 'Verified' : 'Verify ID'}
                    </span>
                </button>
            </div>

            {/* Admin Exclusive Action */}
            {isAdmin && onOpenAdmin && (
                <div className="mb-8 animate-fade-in">
                    <button 
                        onClick={onOpenAdmin}
                        className="w-full flex items-center justify-center gap-3 bg-brand-dark dark:bg-gray-900 text-white p-5 rounded-[2rem] shadow-xl hover:bg-black transition-all active:scale-[0.98] border border-white/10"
                    >
                        <ShieldCheckIcon className="w-6 h-6 text-brand-accent" />
                        <span className="font-black uppercase tracking-widest text-sm text-brand-accent">Registry Command Center</span>
                    </button>
                </div>
            )}

            {/* Profile Content */}
            <div className="space-y-2">
                <ProfileSection title="Identity & Roots">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <ProfileDataItem label="Marital Status" value={user.maritalStatus} />
                        <ProfileDataItem label="Occupation" value={user.occupation} />
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-[9px] font-black text-brand-primary dark:text-brand-accent uppercase tracking-widest">Current Residence</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <ProfileDataItem label="Country" value={user.residenceCountry} />
                                <ProfileDataItem label="State" value={user.residenceState} />
                                <ProfileDataItem label="City" value={user.residenceCity} />
                            </div>
                        </div>
                        
                        <div className="h-[1px] bg-gray-200 dark:bg-gray-800 w-full"></div>
                        
                        <div className="space-y-2">
                            <h4 className="text-[9px] font-black text-brand-primary dark:text-brand-accent uppercase tracking-widest">Heritage & Origin</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <ProfileDataItem label="Country" value={user.originCountry} />
                                <ProfileDataItem label="State" value={user.originState} />
                                <ProfileDataItem label="City" value={user.originCity} />
                            </div>
                            <div className="pt-2">
                                <ProfileDataItem label="Cultural Identity" value={user.culturalBackground} />
                            </div>
                        </div>
                    </div>

                    <ProfileDataItem label="Registry Bio" value={user.bio} />
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-2">
                        <ProfileDataItem label="Nationality" value={user.nationality} />
                        <ProfileDataItem label="Languages" value={user.languages.join(', ')} />
                    </div>
                </ProfileSection>

                <ProfileSection title="Lifestyle & Beliefs">
                    <div className="grid grid-cols-2 gap-8">
                        <ProfileDataItem label="Faith/Religion" value={user.religion} />
                        <ProfileDataItem label="Smoking" value={user.smoking} />
                        <ProfileDataItem label="Drinking" value={user.drinking} />
                        <ProfileDataItem label="Children" value={user.childrenStatus || 'None'} />
                    </div>
                    <ProfileDataItem label="Core Life Values" value={
                        <div className="flex flex-wrap gap-2 mt-2">
                            {user.personalValues.length > 0 ? (
                                user.personalValues.map(v => (
                                    <span key={v} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                        {v}
                                    </span>
                                ))
                            ) : 'Not listed'}
                        </div>
                    } />
                </ProfileSection>

                <ProfileSection title="Marriage Expectations">
                    <div className="grid grid-cols-2 gap-8">
                        <ProfileDataItem label="Vow Timeline" value={user.marriageTimeline} />
                        <ProfileDataItem label="Relocation" value={user.willingToRelocate} />
                        <ProfileDataItem label="Children Intent" value={user.childrenPreference} />
                    </div>
                    <ProfileDataItem label="Ideal Partner Traits" value={
                        <div className="flex flex-wrap gap-2 mt-2">
                            {user.idealPartnerTraits.length > 0 ? (
                                user.idealPartnerTraits.map(t => (
                                    <span key={t} className="bg-brand-light dark:bg-brand-accent/10 text-brand-primary dark:text-brand-accent text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-brand-primary/10 dark:border-brand-accent/20">
                                        {t}
                                    </span>
                                ))
                            ) : 'Not listed'}
                        </div>
                    } />
                    <ProfileDataItem label="Registry Expectations" value={user.marriageExpectations} />
                </ProfileSection>
            </div>
        </div>

        <style>{`
            @keyframes shimmer {
                0% { transform: translateX(-150%); }
                100% { transform: translateX(150%); }
            }
            .animate-shimmer { animation: shimmer 3s infinite linear; }
            .animate-fade-in { animation: fadeIn 0.4s ease-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
    </div>
  );
};

export default ProfileCard;