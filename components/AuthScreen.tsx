import React, { useState } from 'react';
import { KnotLogo } from './KnotLogo';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { GmailIcon } from './icons/GmailIcon';
import { AppleIcon } from './icons/AppleIcon';
import { CloseIcon } from './icons/CloseIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface AuthScreenProps {
    onLogin: (name?: string, email?: string) => void;
    onSignUp: (name?: string, email?: string) => void;
}

interface MockAccount {
    name: string;
    email: string;
    role?: string;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onSignUp }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showAccountPicker, setShowAccountPicker] = useState(false);
    const [pickerType, setPickerType] = useState<'Gmail' | 'Apple' | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const mockAccounts: MockAccount[] = [
        { name: 'Sofia Ricci', email: 'sofia.r@gmail.com' },
        { name: 'Liam Wilson', email: 'liam.w@outlook.com' },
    ];

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setShowEmailForm(false);
        setShowAccountPicker(false);
    };
    
    const handleEmailContinue = () => {
        setShowEmailForm(true);
    };

    const handleSocialClick = (type: 'Gmail' | 'Apple') => {
        setPickerType(type);
        setShowAccountPicker(true);
    };
    
    const handleAccountSelect = (account: MockAccount) => {
        setIsLoading(true);
        // Simulate a small delay for "Registry Verification"
        setTimeout(() => {
            setShowAccountPicker(false);
            if (isLogin) {
                onLogin(account.name, account.email);
            } else {
                onSignUp(account.name, account.email);
            }
            setIsLoading(false);
        }, 1200);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        setTimeout(() => {
            if (isLogin) {
                onLogin(undefined, email);
            } else {
                onSignUp(undefined, email);
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col justify-center items-center p-6 relative overflow-hidden transition-colors duration-500">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl"></div>

            <KnotLogo className="text-4xl mb-8 relative z-10 text-brand-primary dark:text-brand-accent" />
            
            <div className="w-full max-w-sm bg-white dark:bg-gray-900/50 p-8 rounded-[2.5rem] shadow-2xl relative z-10 border border-white/50 dark:border-gray-800 backdrop-blur-xl">
                <h1 className="text-2xl font-black text-center text-brand-dark dark:text-white mb-6 tracking-tight">
                    {isLogin ? 'Welcome Back' : 'Join Registry'}
                </h1>

                {showEmailForm ? (
                    <form onSubmit={handleFormSubmit} className="space-y-4 animate-fade-in">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 block" htmlFor="email">Email Address</label>
                            <input 
                                id="email"
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white dark:focus:bg-gray-700 text-brand-dark dark:text-white transition-all text-sm"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 block" htmlFor="password">Security Password</label>
                            <input 
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white dark:focus:bg-gray-700 text-brand-dark dark:text-white transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        {email === 'admin@knot.ai' && (
                            <div className="bg-brand-dark dark:bg-brand-accent/10 text-brand-accent p-3 rounded-xl flex items-center gap-2 animate-pulse">
                                <ShieldCheckIcon className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Administrator Credentials Detected</span>
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-primary dark:bg-brand-accent text-white dark:text-brand-dark font-black py-4 rounded-2xl shadow-xl shadow-brand-primary/20 dark:shadow-brand-accent/10 hover:bg-brand-secondary transition-all mt-4 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                isLogin ? 'Log In to Registry' : 'Continue to Onboarding'
                            )}
                        </button>
                        <button type="button" onClick={() => setShowEmailForm(false)} className="w-full text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest py-2 hover:text-brand-primary transition-colors">Go Back</button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <button onClick={() => handleSocialClick('Gmail')} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-brand-dark dark:text-white font-bold py-4 rounded-2xl hover:shadow-md transition-all active:scale-95">
                            <GmailIcon className="w-5 h-5" />
                            Continue with Google
                        </button>
                        <button onClick={() => handleSocialClick('Apple')} className="w-full flex items-center justify-center gap-3 bg-brand-dark dark:bg-white text-white dark:text-brand-dark font-bold py-4 rounded-2xl hover:bg-black dark:hover:bg-gray-100 transition-all active:scale-95 shadow-lg">
                            <AppleIcon className="w-5 h-5" />
                            Continue with Apple
                        </button>
                        <div className="relative flex py-4 items-center">
                            <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
                            <span className="flex-shrink mx-4 text-gray-300 dark:text-gray-600 text-[10px] font-black uppercase tracking-widest">OR</span>
                            <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
                        </div>
                        <button onClick={handleEmailContinue} className="w-full flex items-center justify-center gap-3 bg-brand-light dark:bg-brand-primary/10 text-brand-primary dark:text-brand-accent font-bold py-4 rounded-2xl hover:bg-brand-primary hover:text-white transition-all active:scale-95">
                            <EnvelopeIcon className="w-5 h-5" />
                            Continue with Email
                        </button>
                    </div>
                )}

                <p className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-8 uppercase tracking-widest">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button onClick={toggleAuthMode} className="text-brand-primary dark:text-brand-accent underline ml-1 font-black">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>

            {/* Account Picker Modal */}
            {showAccountPicker && (
                <div className="fixed inset-0 bg-brand-dark/40 dark:bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in" onClick={() => setShowAccountPicker(false)}>
                    <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <div>
                                <h3 className="text-lg font-black text-brand-dark dark:text-white tracking-tight">Choose Account</h3>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">to continue to Knot</p>
                            </div>
                            <button onClick={() => setShowAccountPicker(false)} className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm text-gray-400">
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {mockAccounts.map((account, idx) => (
                                <button 
                                    key={idx}
                                    disabled={isLoading}
                                    onClick={() => handleAccountSelect(account)}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl transition-colors text-left group border hover:bg-brand-light dark:hover:bg-brand-primary/5 border-transparent hover:border-brand-primary/10"
                                >
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl bg-brand-primary/10 text-brand-primary dark:text-brand-accent">
                                        {account.name[0]}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold truncate text-brand-dark dark:text-white">{account.name}</p>
                                        </div>
                                        <p className="text-xs truncate text-gray-400 dark:text-gray-500">{account.email}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary dark:text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                            <button onClick={() => setShowAccountPicker(false)} className="w-full p-4 text-brand-primary dark:text-brand-accent text-xs font-black uppercase tracking-widest border-t border-gray-50 dark:border-gray-800 mt-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                Use another account
                            </button>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 text-center">
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
                                To continue, {pickerType} will share your name, email address, language preference, and profile picture with Knot.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default AuthScreen;