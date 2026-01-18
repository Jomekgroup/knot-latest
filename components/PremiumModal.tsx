
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { HeartIcon } from './icons/HeartIcon';
import { VerifiedIcon } from './icons/VerifiedIcon';
import { User } from '../types';
import { formatLocalPrice } from '../services/currencyService';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  user: User;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade, user }) => {
  if (!isOpen) return null;

  const localPrice = formatLocalPrice(7.00, user.residenceCountry);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm m-4 relative animate-slide-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-gray-100 z-10">
            <CloseIcon className="w-6 h-6" />
        </button>
        <div className="p-6 text-center">
            <div className="relative inline-block">
                <HeartIcon className="w-16 h-16 text-brand-primary mx-auto mb-4" />
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-brand-accent text-brand-dark text-xs font-bold shadow-md">★</span>
            </div>
            <h2 className="text-2xl font-bold text-brand-dark">Unlock Premium Features</h2>
            <p className="text-gray-600 mt-2 mb-6 text-sm leading-relaxed">Experience Knot without limits. Connect, chat, and meet your soulmate faster with advanced registry tools.</p>
            
            <ul className="text-left space-y-3 mb-8 bg-gray-50 p-4 rounded-2xl">
                <li className="flex items-center text-xs"><VerifiedIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" /> <span className="font-semibold text-brand-dark">Unlimited Messaging</span> &mdash; Chat freely.</li>
                <li className="flex items-center text-xs"><VerifiedIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" /> <span className="font-semibold text-brand-dark">HD Video Calling</span> &mdash; Face-to-face vows.</li>
                <li className="flex items-center text-xs"><VerifiedIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" /> <span className="font-semibold text-brand-dark">See Who Likes You</span> &mdash; Match instantly.</li>
                <li className="flex items-center text-xs"><VerifiedIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" /> <span className="font-semibold text-brand-dark">Advanced Filters</span> &mdash; Precise values.</li>
            </ul>

            <button onClick={onUpgrade} className="w-full bg-brand-primary text-white font-black py-4 rounded-xl text-lg hover:bg-brand-secondary transition-all shadow-lg active:scale-95">
                Upgrade for {localPrice}/mo
            </button>
            <button onClick={onClose} className="text-xs font-black uppercase tracking-widest text-gray-400 mt-5 hover:text-brand-primary transition-colors">
                Maybe Later
            </button>
        </div>
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

export default PremiumModal;
