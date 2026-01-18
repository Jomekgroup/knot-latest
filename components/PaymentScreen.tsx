
import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { LockIcon } from './icons/LockIcon';
import { PlusIcon } from './icons/PlusIcon';
import { useToast } from './feedback/useToast';
import { User } from '../types';
import { formatLocalPrice, getCurrencyForCountry } from '../services/currencyService';

interface PaymentScreenProps {
  onBack: () => void;
  onSubscribe: () => void;
  user: User;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const MONTHLY_RATE_USD = 7.00;

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onBack, onSubscribe, user }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [months, setMonths] = useState(1);
    const { addToast } = useToast();
    
    const country = user.residenceCountry || "USA";
    const currencyInfo = getCurrencyForCountry(country);
    
    const totalUsd = MONTHLY_RATE_USD * months;
    const localTotalAmount = totalUsd * currencyInfo.rate;
    
    const monthlyLocalPriceFormatted = formatLocalPrice(MONTHLY_RATE_USD, country);
    const totalLocalPriceFormatted = formatLocalPrice(totalUsd, country);

    const handlePaystackPayment = () => {
        setIsProcessing(true);

        const handler = window.PaystackPop.setup({
            key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 
            email: user.email || "customer@knot.ai",
            amount: Math.round(localTotalAmount * 100), 
            currency: currencyInfo.code, 
            ref: 'KNOT-' + Math.floor((Math.random() * 1000000000) + 1),
            metadata: {
                custom_fields: [
                    {
                        display_name: "Subscription Duration",
                        variable_name: "duration_months",
                        value: months
                    },
                    {
                        display_name: "Base USD Amount",
                        variable_name: "base_usd",
                        value: totalUsd
                    }
                ]
            },
            onClose: () => {
                setIsProcessing(false);
                addToast("Registry payment deferred.", "info");
            },
            callback: (response: any) => {
                setIsProcessing(false);
                console.log("Paystack Reference:", response.reference);
                addToast(`Knot Premium Activated!`, "success");
                onSubscribe();
            }
        });

        handler.openIframe();
    };

    const incrementMonths = () => setMonths(prev => Math.min(prev + 1, 24));
    const decrementMonths = () => setMonths(prev => Math.max(prev - 1, 1));

    return (
        <div className="w-full h-screen bg-gray-100 flex flex-col">
            <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <h1 className="text-xl font-black text-brand-dark uppercase tracking-tight">Vow Registry Premium</h1>
                <button onClick={onBack} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>

            <main className="flex-1 p-4 overflow-y-auto pb-10">
                <div className="bg-brand-primary text-white p-8 rounded-[2.5rem] shadow-2xl mb-6 text-center overflow-hidden relative border border-white/10">
                    <div className="relative z-10">
                        <div className="mb-4 inline-block bg-brand-accent text-brand-dark px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Localized Registry
                        </div>
                        <h2 className="text-4xl font-black mb-1 tracking-tighter">Knot Premium</h2>
                        <p className="opacity-70 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Access the Global Directory</p>
                        
                        <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/20 shadow-inner">
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-6">Select Commitment Duration</p>
                            
                            <div className="flex items-center justify-center gap-8 mb-8">
                                <button 
                                    onClick={decrementMonths}
                                    className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all border border-white/10"
                                >
                                    <span className="text-3xl font-black">−</span>
                                </button>
                                
                                <div className="text-center min-w-[100px] animate-fade-in" key={months}>
                                    <span className="text-6xl font-black tracking-tighter">{months}</span>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-60">
                                        {months === 1 ? 'Month' : 'Months'}
                                    </p>
                                </div>

                                <button 
                                    onClick={incrementMonths}
                                    className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center hover:bg-white/30 active:scale-90 transition-all border border-white/10"
                                >
                                    <PlusIcon className="w-7 h-7" />
                                </button>
                            </div>

                            <div className="h-px bg-white/10 w-full mb-6"></div>

                            <div className="flex flex-col items-center">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Total Registry Fee</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-brand-accent drop-shadow-md">{totalLocalPriceFormatted}</span>
                                </div>
                                <p className="text-[10px] font-bold opacity-60 mt-3 uppercase tracking-tighter italic">
                                    Local Rate: {monthlyLocalPriceFormatted}/mo
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-20%] left-[-20%] w-60 h-60 bg-brand-accent/10 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                     <h2 className="text-xs font-black text-brand-primary uppercase tracking-widest border-b border-gray-50 pb-2">Exclusive Registry Access</h2>
                     <ul className="space-y-4">
                         {[
                             "See who favorited your registry entry",
                             "Unlimited global directory communication",
                             "Priority verification badge",
                             "Advanced value-based filtering"
                         ].map((benefit, i) => (
                            <li key={i} className="flex items-start gap-4 text-sm text-gray-700 font-medium">
                                <div className="mt-1 w-5 h-5 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0">✓</div>
                                <span className="leading-tight">{benefit}</span>
                            </li>
                         ))}
                     </ul>
                </div>
                
                <div className="mt-8 p-6 bg-gray-50 border border-gray-100 rounded-[2rem] text-center">
                    <p className="text-[10px] text-gray-400 leading-relaxed font-bold uppercase tracking-wider">
                        Localized for {country}<br/>
                        Payments secured via Paystack global network
                    </p>
                </div>
            </main>

            <footer className="p-6 bg-white border-t border-gray-100 sticky bottom-0 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                <button 
                    onClick={handlePaystackPayment} 
                    disabled={isProcessing} 
                    className="w-full bg-brand-primary text-white font-black py-5 rounded-2xl hover:bg-brand-secondary transition-all flex items-center justify-center gap-4 disabled:bg-gray-300 active:scale-95 shadow-xl shadow-brand-primary/20"
                >
                    {isProcessing ? (
                        <>
                         <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                         <span className="uppercase tracking-widest text-xs">Authenticating...</span>
                        </>
                    ) : (
                        <>
                        <LockIcon className="w-5 h-5 text-brand-accent"/>
                        <span className="uppercase tracking-[0.2em] text-sm">Upgrade for {totalLocalPriceFormatted}</span>
                        </>
                    )}
                </button>
                <div className="mt-6 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                        <img src="https://files.readme.io/656515c-paystack-badge.png" alt="Paystack" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
                        <div className="w-[1px] h-3 bg-gray-200"></div>
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">Secure Checkout</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PaymentScreen;
