import React, { useState, useEffect } from 'react';
import { supabase } from '../services/databaseService';
import { KnotLogo } from './KnotLogo';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { GmailIcon } from './icons/GmailIcon';
import { AppleIcon } from './icons/AppleIcon';
import axios from 'axios';

interface AuthScreenProps {
    onLogin: (name?: string, email?: string) => void;
    onSignUp: (name?: string, email?: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onSignUp }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- BACKEND SYNC LOGIC ---
    // This ensures that when a user logs in via Google, your Render database gets the record
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                const user = session.user;
                
                try {
                    // Replace with your actual Render Backend URL
                    await axios.post('https://your-backend-on-render.com/api/users/sync', {
                        id: user.id,
                        email: user.email,
                        name: user.user_metadata?.full_name || user.user_metadata?.name,
                        avatar_url: user.user_metadata?.avatar_url,
                    });
                    
                    // Trigger the app's internal login state
                    onLogin(user.user_metadata?.full_name, user.email);
                } catch (error) {
                    console.error("Registry Sync Error:", error);
                    // Still log them in locally even if sync fails temporarily
                    onLogin(user.user_metadata?.full_name, user.email);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [onLogin]);

    // --- REAL AUTH ACTIONS ---

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin, 
            },
        });

        if (error) {
            alert(error.message);
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (isLogin) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                alert(error.message);
            } else {
                onLogin(data.user?.user_metadata?.full_name, email);
            }
        } else {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) {
                alert(error.message);
            } else {
                onSignUp(undefined, email);
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col justify-center items-center p-6 relative overflow-hidden transition-colors duration-500">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl"></div>

            <KnotLogo className="text-4xl mb-8 relative z-10 text-brand-primary dark:text-brand-accent" />
            
            <div className="w-full max-w-sm bg-white dark:bg-gray-900/50 p-8 rounded-[2.5rem] shadow-2xl relative z-10 border border-white/50 dark:border-gray-800 backdrop-blur-xl">
                <h1 className="text-2xl font-black text-center text-brand-dark dark:text-white mb-6 tracking-tight">
                    {isLogin ? 'Welcome Back' : 'Join Registry'}
                </h1>

                {showEmailForm ? (
                    <form onSubmit={handleEmailAuth} className="space-y-4 animate-fade-in">
                        <div>
                             <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
                             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm" placeholder="name@example.com" required />
                        </div>
                        <div>
                             <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 block">Security Password</label>
                             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm" placeholder="••••••••" required />
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full bg-brand-primary dark:bg-brand-accent text-white dark:text-brand-dark font-black py-4 rounded-2xl shadow-xl mt-4 active:scale-95 flex items-center justify-center">
                            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (isLogin ? 'Log In to Registry' : 'Continue to Onboarding')}
                        </button>
                        <button type="button" onClick={() => setShowEmailForm(false)} className="w-full text-gray-400 text-xs font-bold uppercase tracking-widest py-2">Go Back</button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <button onClick={() => handleSocialLogin('google')} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-brand-dark dark:text-white font-bold py-4 rounded-2xl hover:shadow-md transition-all active:scale-95">
                            <GmailIcon className="w-5 h-5" />
                            Continue with Google
                        </button>

                        <button onClick={() => handleSocialLogin('apple')} className="w-full flex items-center justify-center gap-3 bg-brand-dark dark:bg-white text-white dark:text-brand-dark font-bold py-4 rounded-2xl hover:bg-black dark:hover:bg-gray-100 transition-all active:scale-95 shadow-lg">
                            <AppleIcon className="w-5 h-5" />
                            Continue with Apple
                        </button>

                        <div className="relative flex py-4 items-center">
                            <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
                            <span className="flex-shrink mx-4 text-gray-300 dark:text-gray-600 text-[10px] font-black uppercase tracking-widest">OR</span>
                            <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
                        </div>

                        <button onClick={() => setShowEmailForm(true)} className="w-full flex items-center justify-center gap-3 bg-brand-light dark:bg-brand-primary/10 text-brand-primary dark:text-brand-accent font-bold py-4 rounded-2xl hover:bg-brand-primary hover:text-white transition-all active:scale-95">
                            <EnvelopeIcon className="w-5 h-5" />
                            Continue with Email
                        </button>
                    </div>
                )}
                
                <button 
                    onClick={() => setIsLogin(!isLogin)} 
                    className="w-full mt-8 text-center text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors"
                >
                    {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign In"}
                </button>
            </div>
        </div>
    );
};

export default AuthScreen;