
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, Match, Screen, FilterState, SmokingHabits, DrinkingHabits, MaritalStatus, WillingToRelocate, ChildrenPreference } from './types';
import { INITIAL_FILTERS, CURRENT_USER } from './constants';
import { db } from './services/databaseService';
import { queryGlobalRegistry } from './services/matchingService';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MatchCard from './components/MatchCard';
import DiscoveryScreen from './components/DiscoveryScreen';
import ProfileDetailScreen from './components/ProfileDetailScreen';
import ChatScreen from './components/ChatScreen';
import VideoCallScreen from './components/VideoCallScreen';
import ProfileCard from './components/ProfileCard';
import VerificationScreen from './components/VerificationScreen';
import EditProfileScreen from './components/EditProfileScreen';
import PhotoManagerScreen from './components/PhotoManagerScreen';
import AuthScreen from './components/AuthScreen';
import LikesScreen from './components/LikesScreen';
import PremiumModal from './components/PremiumModal';
import MessagesScreen from './components/MessagesScreen';
import FilterModal from './components/FilterModal';
import PaymentScreen from './components/PaymentScreen';
import OnboardingFlow from './components/OnboardingFlow';
import AdminScreen from './components/AdminScreen';
import { ToastProvider, useToast } from './components/feedback/useToast';

const AppContent: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeScreen, setActiveScreen] = useState<Screen>('home');
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const { addToast } = useToast();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            const userData = await db.getUser();
            const matchesData = await db.getMatches();
            setUser(userData);
            setMatches(matchesData);
        };
        loadData();
    }, []);

    const fetchMoreFromGlobalRegistry = useCallback(async (isSilent = false) => {
        if (isSyncing) return;
        setIsSyncing(true);
        if (!isSilent) addToast("Syncing Registry...", "info");
        
        try {
            const newMatches = await queryGlobalRegistry(6);
            if (newMatches.length > 0) {
                await db.addGlobalMatches(newMatches);
                const updatedMatches = await db.getMatches();
                setMatches(updatedMatches);
            }
        } catch (e) {
            if (!isSilent) addToast("Update Failed.", "error");
        } finally {
            setIsSyncing(false);
        }
    }, [isSyncing, addToast]);

    // Infinite Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            if (activeScreen !== 'home') return;
            
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight - 300 && !isSyncing) {
                fetchMoreFromGlobalRegistry(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeScreen, isSyncing, fetchMoreFromGlobalRegistry]);

    useEffect(() => {
        if (isLoggedIn && activeScreen === 'home' && matches.length < 5) {
            fetchMoreFromGlobalRegistry(true);
        }
    }, [isLoggedIn, activeScreen, matches.length, fetchMoreFromGlobalRegistry]);

    const handleLogin = (isNewUser: boolean = false, name?: string, email?: string) => {
        if (isNewUser) {
            const newUserTemplate: User = {
                ...CURRENT_USER,
                id: `user_${Date.now()}`,
                name: name || '', 
                email: email,
                bio: '',
                age: 25,
                isVerified: false,
                isPremium: false,
                profileImageUrls: [],
                personalValues: [],
                occupation: '',
                marriageTimeline: '1-2 years',
                maritalStatus: MaritalStatus.NeverMarried,
                childrenPreference: ChildrenPreference.OpenToChildren,
                willingToRelocate: WillingToRelocate.Maybe,
                residenceCountry: '',
                residenceState: '',
                residenceCity: '',
                originCountry: '',
                originState: '',
                originCity: '',
                culturalBackground: '',
                city: '',
                country: ''
            };
            setUser(newUserTemplate);
            db.saveUser(newUserTemplate);
            setIsLoggedIn(true);
            setActiveScreen('onboarding');
        } else {
            const isAdmin = email === 'admin@knot.ai';
            if (isAdmin) {
                setUser(CURRENT_USER);
                db.saveUser(CURRENT_USER);
                addToast("Admin Dashboard Authorized", "success");
                setIsLoggedIn(true);
                setActiveScreen('admin');
            } else {
                setIsLoggedIn(true);
                setActiveScreen('home');
                addToast("Directory Access Granted", "success");
            }
        }
    };

    const handleNavigate = (screen: Screen) => {
        if (screen === 'likes' && user && !user.isPremium) {
            setIsPremiumModalOpen(true);
        } else {
            setActiveScreen(screen);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    const handleCardClick = (match: Match) => {
        setSelectedMatch(match);
        setActiveScreen('profileDetail');
    };

    const handleStartChat = (match: Match) => {
        if (user && !user.isPremium) {
            setIsPremiumModalOpen(true);
            return;
        }
        setSelectedMatch(match);
        setActiveScreen('chat');
    };

    const handleStartCall = (match: Match) => {
        if (user && !user.isPremium) {
            setIsPremiumModalOpen(true);
            return;
        }
        setSelectedMatch(match);
        setActiveScreen('videoCall');
    };

    const handleBack = () => {
        if (activeScreen === 'chat' || activeScreen === 'videoCall') {
            setActiveScreen('profileDetail');
        } else if (activeScreen === 'profileDetail' || activeScreen === 'payment') {
            setActiveScreen('home');
            setSelectedMatch(null);
        } else if (['verification', 'editProfile', 'managePhotos', 'admin'].includes(activeScreen)) {
            setActiveScreen('profile');
            setSelectedMatch(null);
        } else {
            setActiveScreen('home');
            setSelectedMatch(null);
        }
    };
    
    const handleUpgradeClick = () => {
        setIsPremiumModalOpen(false);
        setActiveScreen('payment');
    };

    const handleSubscribe = () => {
        if (user) {
            const updated: User = { 
                ...user, 
                isPremium: true,
                subscriptionAmount: 7.00,
                subscriptionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                subscriptionPeriod: 'Custom'
            };
            setUser(updated);
            db.saveUser(updated);
        }
        addToast('Welcome to Premium!', 'success');
        setActiveScreen('likes'); 
    };

    const handleSaveProfile = (updatedUser: User) => {
        setUser(updatedUser);
        db.saveUser(updatedUser);
        addToast('Directory Updated', 'success');
        if (activeScreen === 'onboarding') {
            setActiveScreen('home');
        } else {
            handleBack();
        }
    };

    const handleCancelOnboarding = () => {
        if (window.confirm("Exit registry activation?")) {
            setIsLoggedIn(false);
            setUser(null);
            setActiveScreen('home');
        }
    };

    const handleVerificationComplete = () => {
        if (user) {
            const updated = {...user, isVerified: true};
            setUser(updated);
            db.saveUser(updated);
        }
        setActiveScreen('profile');
    };

    const handleUpdatePhotos = (photos: string[]) => {
        if (user) {
            const updated = {...user, profileImageUrls: photos};
            setUser(updated);
            db.saveUser(updated);
        }
        addToast('Photos Updated', 'success');
        handleBack();
    };
    
    const filteredMatches = matches.filter(match => {
        const ageMatch = match.age >= filters.ageRange[0] && match.age <= filters.ageRange[1];
        const locationMatch = filters.location ? (match.city?.toLowerCase().includes(filters.location.toLowerCase()) || match.country?.toLowerCase().includes(filters.location.toLowerCase())) : true;
        const verifiedMatch = filters.showVerifiedOnly ? match.isVerified : true;
        return ageMatch && locationMatch && verifiedMatch;
    });

    if (!isLoggedIn) {
        return <AuthScreen onLogin={(name, email) => handleLogin(false, name, email)} onSignUp={(name, email) => handleLogin(true, name, email)} />;
    }

    if (!user) return <div className="h-screen flex items-center justify-center bg-brand-dark text-brand-accent font-black animate-pulse">KNOT INITIALIZING...</div>;

    const renderScreen = () => {
        if (selectedMatch) {
            switch(activeScreen) {
                case 'profileDetail':
                    return <ProfileDetailScreen match={selectedMatch} user={user} onBack={handleBack} onStartChat={handleStartChat} onStartCall={handleStartCall} />;
                case 'chat':
                    return <ChatScreen match={selectedMatch} user={user} onBack={handleBack} onStartCall={handleStartCall} />;
                case 'videoCall':
                    return <VideoCallScreen match={selectedMatch} user={user} onEndCall={handleBack} />;
            }
        }

        switch (activeScreen) {
            case 'onboarding':
                return <OnboardingFlow user={user} onComplete={handleSaveProfile} onCancel={handleCancelOnboarding} />;
            case 'home':
                return (
                    <div className="p-4 space-y-4 pb-32">
                        {filteredMatches.length > 0 ? (
                            filteredMatches.map(match => (
                                <MatchCard key={match.id} match={match} user={user} onCardClick={handleCardClick} />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 m-2">
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs px-10">No matches found in this criteria.</p>
                                <button onClick={() => setFilters(INITIAL_FILTERS)} className="mt-4 text-brand-primary font-black uppercase text-[10px] tracking-widest underline">Reset Filters</button>
                            </div>
                        )}
                        
                        {isSyncing && (
                            <div className="pt-6 pb-4 flex flex-col items-center">
                                <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[10px] font-black uppercase text-brand-primary mt-2">Loading more...</span>
                            </div>
                        )}
                    </div>
                );
            case 'discovery':
                return <DiscoveryScreen matches={matches} user={user} onMatchClick={handleCardClick} onOpenFilters={() => setIsFilterModalOpen(true)} />;
            case 'likes':
                 return <LikesScreen likedMatches={[]} onMatchClick={handleCardClick} />;
            case 'messages':
                return <MessagesScreen onChatSelect={handleStartChat} user={user} />;
            case 'profile':
                return <ProfileCard 
                    user={user} 
                    onEditProfile={() => setActiveScreen('editProfile')} 
                    onManagePhotos={() => setActiveScreen('managePhotos')}
                    onVerifyProfile={() => setActiveScreen('verification')}
                    onOpenAdmin={() => setActiveScreen('admin')}
                />;
            case 'verification':
                return <VerificationScreen onVerificationComplete={handleVerificationComplete} onBack={handleBack} />;
            case 'editProfile':
                return <EditProfileScreen user={user} onBack={handleBack} onSave={handleSaveProfile} />;
            case 'managePhotos':
                return <PhotoManagerScreen user={user} onBack={handleBack} onUpdatePhotos={handleUpdatePhotos} />;
            case 'payment':
                return <PaymentScreen onBack={handleBack} onSubscribe={handleSubscribe} user={user} />;
            case 'admin':
                return <AdminScreen onBack={handleBack} />;
            default:
                return <div className="p-10 text-center">Screen Not Found</div>;
        }
    };
    
    const showHeader = ['home', 'discovery', 'likes', 'messages', 'profile'].includes(activeScreen);
    const showBottomNav = ['home', 'discovery', 'likes', 'messages', 'profile'].includes(activeScreen);

    return (
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen font-sans shadow-2xl overflow-x-hidden">
            {showHeader && (
                <div className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50">
                    <Header onOpenFilters={() => setIsFilterModalOpen(true)} />
                    {isSyncing && (
                        <div className="h-0.5 w-full bg-brand-light relative overflow-hidden">
                            <div className="absolute inset-0 bg-brand-primary animate-progress-ind"></div>
                        </div>
                    )}
                </div>
            )}
            
            <main className={`${showHeader ? 'pt-[6rem]' : ''}`}>
                {renderScreen()}
            </main>

            {showBottomNav && (
                <BottomNav activeScreen={activeScreen} onNavigate={handleNavigate} />
            )}

            <FilterModal 
                isOpen={isFilterModalOpen} 
                onClose={() => setIsFilterModalOpen(false)}
                currentFilters={filters}
                onApplyFilters={(newFilters) => {
                    setFilters(newFilters);
                    addToast('Filters Applied', 'info');
                }}
                initialFilters={INITIAL_FILTERS}
            />
            
            <PremiumModal 
                isOpen={isPremiumModalOpen}
                onClose={() => setIsPremiumModalOpen(false)}
                onUpgrade={handleUpgradeClick}
                user={user}
            />
            
            <style>{`
                @keyframes progress-ind {
                    0% { left: -100%; width: 100%; }
                    100% { left: 100%; width: 100%; }
                }
                .animate-progress-ind { animation: progress-ind 1.5s infinite linear; }
                body { background-color: #f3f4f6; }
            `}</style>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ToastProvider>
            <AppContent />
        </ToastProvider>
    );
};

const AppWithAuth: React.FC = () => {
    return <App />;
}

export default AppWithAuth;
