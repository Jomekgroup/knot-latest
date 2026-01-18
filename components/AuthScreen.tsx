
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
        setShowAccountPicker(false);
        if (isLogin) {
            onLogin(account.name, account.email);
        } else {
            onSignUp(account.name, account.email);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(undefined, email);
        } else {
            // Sign up now only requires email and password; name is collected in onboarding
            onSignUp(undefined, email);
        }
    };

    return (
        <div className="min-h-screen bg-brand-light flex flex-col justify-center items-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl"></div>

            <KnotLogo className="text-4xl mb-8 relative z-10" />
            
            <div className="w-full max-w-sm bg-white p-8 rounded-[2.5rem] shadow-2xl relative z-10 border border-white/50">
                <h1 className="text-2xl font-black text-center text-brand-dark mb-6 tracking-tight">
                    {isLogin ? 'Welcome Back' : 'Join Registry'}
                </h1>

                {showEmailForm ? (
                    <form onSubmit={handleFormSubmit} className="space-y-4 animate-fade-in">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block" htmlFor="email">Email Address</label>
                            <input 
                                id="email"
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white text-brand-dark transition-all text-sm"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block" htmlFor="password">Security Password</label>
                            <input 
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white text-brand-dark transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                        {email === 'admin@knot.ai' && (
                            <div className="bg-brand-dark text-brand-accent p-3 rounded-xl flex items-center gap-2 animate-pulse">
                                <ShieldCheckIcon className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Administrator Credentials Detected</span>
                            </div>
                        )}
                         <button 
                            type="submit"
                            className="w-full bg-brand-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-brand-primary/20 hover:bg-brand-secondary transition-all mt-4 active:scale-95"
                        >
                            {isLogin ? 'Log In to Registry' : 'Continue to Onboarding'}
                        </button>
                        <button type="button" onClick={() => setShowEmailForm(false)} className="w-full text-gray-400 text-xs font-bold uppercase tracking-widest py-2">Go Back</button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <button onClick={() => handleSocialClick('Gmail')} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-100 text-brand-dark font-bold py-4 rounded-2xl hover:shadow-md transition-all active:scale-95">
                            <GmailIcon className="w-5 h-5" />
                            Continue with Google
                        </button>
                        <button onClick={() => handleSocialClick('Apple')} className="w-full flex items-center justify-center gap-3 bg-brand-dark text-white font-bold py-4 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-lg">
                            <AppleIcon className="w-5 h-5" />
                            Continue with Apple
                        </button>
                        <div className="relative flex py-4 items-center">
                            <div className="flex-grow border-t border-gray-100"></div>
                            <span className="flex-shrink mx-4 text-gray-300 text-[10px] font-black uppercase tracking-widest">OR</span>
                            <div className="flex-grow border-t border-gray-100"></div>
                        </div>
                        <button onClick={handleEmailContinue} className="w-full flex items-center justify-center gap-3 bg-brand-light text-brand-primary font-bold py-4 rounded-2xl hover:bg-brand-primary hover:text-white transition-all active:scale-95">
                            <EnvelopeIcon className="w-5 h-5" />
                            Continue with Email
                        </button>
                    </div>
                )}

                <p className="text-center text-[10px] font-bold text-gray-400 mt-8 uppercase tracking-widest">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button onClick={toggleAuthMode} className="text-brand-primary underline ml-1">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>

            {showAccountPicker && (
                <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in" onClick={() => setShowAccountPicker(false)}>
                    <div className="w-full max-w-sm bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-black text-brand-dark tracking-tight">Choose Account</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">to continue to Knot</p>
                            </div>
                            <button onClick={() => setShowAccountPicker(false)} className="p-2 bg-white rounded-full shadow-sm text-gray-400">
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {mockAccounts.map((account, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleAccountSelect(account)}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl transition-colors text-left group border hover:bg-brand-light border-transparent hover:border-brand-primary/10"
                                >
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl bg-brand-primary/10 text-brand-primary">
                                        {account.name[0]}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold truncate text-brand-dark">{account.name}</p>
                                        </div>
                                        <p className="text-xs truncate text-gray-400">{account.email}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                            <button onClick={() => setShowAccountPicker(false)} className="w-full p-4 text-brand-primary text-xs font-black uppercase tracking-widest border-t border-gray-50 mt-2">
                                Use another account
                            </button>
                        </div>
                        <div className="bg-gray-50 p-6 text-center">
                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                To continue, Google/Apple will share your name, email address, language preference, and profile picture with Knot.
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
