
import React from 'react';
import { KnotLogo } from './KnotLogo';
import { SlidersIcon } from './icons/SlidersIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface HeaderProps {
  onOpenFilters?: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenFilters, isDarkMode, toggleTheme }) => {
  return (
    <header className="h-24 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 flex flex-col px-6 pt-4 pb-2 relative z-50 shadow-sm transition-colors">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start">
          <KnotLogo className="text-3xl leading-none dark:text-white" />
          <div className="flex items-center gap-3 mt-1.5">
            <button 
                onClick={onOpenFilters}
                className="p-1 text-gray-400 hover:text-brand-primary dark:hover:text-brand-accent active:scale-90 transition-all"
                aria-label="Filter Registry"
            >
                <SlidersIcon className="w-4 h-4" />
            </button>
            <button 
                onClick={toggleTheme}
                className="p-1 text-gray-400 hover:text-brand-primary dark:hover:text-brand-accent active:scale-90 transition-all"
                aria-label="Toggle Theme"
            >
                {isDarkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <div className="flex -space-x-2.5">
            <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover shadow-md" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop" alt="Member 1" />
            <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover shadow-md" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=128&auto=format&fit=crop" alt="Member 2" />
            <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover shadow-md" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop" alt="Member 3" />
        </div>
      </div>
      
      <div className="w-full flex justify-center mt-1">
        <p className="text-sm font-black text-brand-secondary dark:text-brand-accent italic tracking-tight text-center leading-none">
          Where true relationship leads to vow
        </p>
      </div>
    </header>
  );
};

export default Header;