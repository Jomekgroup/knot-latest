
import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { MessageIcon } from './icons/MessageIcon';
import { UserIcon } from './icons/UserIcon';
import { HeartIcon } from './icons/HeartIcon';
import { DiscoveryIcon } from './icons/DiscoveryIcon';
import { Screen } from '../types';

interface BottomNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NavItem: React.FC<{
  label: string;
  screen: Screen;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (screen: Screen) => void;
}> = ({ label, screen, icon, isActive, onClick }) => {
  const activeColor = 'text-brand-primary dark:text-brand-accent';
  const inactiveColor = 'text-gray-400 dark:text-gray-500';

  return (
    <button
      onClick={() => onClick(screen)}
      className="flex flex-col items-center justify-center w-1/5 h-full transition-colors duration-200"
    >
      <div className={`w-6 h-6 ${isActive ? activeColor : inactiveColor}`}>{icon}</div>
      <span className={`text-[10px] mt-1 uppercase font-black tracking-tighter ${isActive ? activeColor : inactiveColor}`}>
        {label}
      </span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const navItems = [
    { label: 'Matches', screen: 'home' as Screen, icon: <HomeIcon /> },
    { label: 'Discovery', screen: 'discovery' as Screen, icon: <DiscoveryIcon /> },
    { label: 'Likes', screen: 'likes' as Screen, icon: <HeartIcon /> },
    { label: 'Chats', screen: 'messages' as Screen, icon: <MessageIcon /> },
    { label: 'Profile', screen: 'profile' as Screen, icon: <UserIcon /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex items-center justify-around z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] transition-colors">
      {navItems.map(item => (
        <NavItem
          key={item.screen}
          label={item.label}
          screen={item.screen}
          icon={item.icon}
          isActive={activeScreen === item.screen}
          onClick={onNavigate}
        />
      ))}
    </nav>
  );
};

export default BottomNav;