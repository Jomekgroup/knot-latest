
import React, { useState, useEffect, useMemo } from 'react';
import { Match } from '../types';
import { db } from '../services/databaseService';
import { CloseIcon } from './icons/CloseIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { TrashIcon } from './icons/TrashIcon';
import { VerifiedIcon } from './icons/VerifiedIcon';
import { useToast } from './feedback/useToast';

interface AdminScreenProps {
    onBack: () => void;
}

type AdminTab = 'all' | 'pending' | 'verified' | 'subscribers';

const StatCard: React.FC<{ label: string; value: string | number; color?: string; subValue?: string }> = ({ label, value, color = "text-brand-primary", subValue }) => (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
        {subValue && <p className="text-[9px] font-bold text-gray-400 mt-1">{subValue}</p>}
    </div>
);

const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
    const [members, setMembers] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<AdminTab>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useToast();

    useEffect(() => {
        const loadRegistry = async () => {
            const data = await db.getMatches();
            setMembers(data);
            setIsLoading(false);
        };
        loadRegistry();
    }, []);

    const handleDelete = async (memberId: string) => {
        if (window.confirm("Purge this member from the registry? This action cannot be undone.")) {
            const updated = members.filter(m => m.id !== memberId);
            setMembers(updated);
            await db.saveMatches(updated);
            addToast("Member purged.", "success");
        }
    };

    const approveVerification = async (memberId: string) => {
        const updated = members.map(m => {
            if (m.id === memberId) {
                return { ...m, isVerified: true };
            }
            return m;
        });
        setMembers(updated);
        await db.saveMatches(updated);
        addToast("Identity verified.", "success");
    };

    const revokeVerification = async (memberId: string) => {
        if (window.confirm("Revoke this member's verified status?")) {
            const updated = members.map(m => {
                if (m.id === memberId) {
                    return { ...m, isVerified: false };
                }
                return m;
            });
            setMembers(updated);
            await db.saveMatches(updated);
            addToast("Verification revoked.", "info");
        }
    };

    const filteredMembers = useMemo(() => {
        let list = [...members];
        if (activeTab === 'pending') list = list.filter(m => !m.isVerified);
        if (activeTab === 'verified') list = list.filter(m => m.isVerified);
        if (activeTab === 'subscribers') list = list.filter(m => m.isPremium);

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(m => 
                m.name.toLowerCase().includes(q) || 
                m.occupation.toLowerCase().includes(q) ||
                (m.email && m.email.toLowerCase().includes(q))
            );
        }
        return list;
    }, [members, activeTab, searchQuery]);

    const totalRevenue = members.reduce((sum, m) => sum + (m.subscriptionAmount || 0), 0);

    return (
        <div className="w-full h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
            <header className="flex items-center justify-between p-4 bg-brand-dark text-white border-b border-white/10 sticky top-0 z-10 shadow-xl">
                <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="w-6 h-6 text-brand-accent" />
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter leading-none">Management Panel</h1>
                        <p className="text-[8px] font-bold text-brand-accent uppercase tracking-[0.2em] mt-1">Registry Administration</p>
                    </div>
                </div>
                <button onClick={onBack} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto pb-32">
                <div className="p-6 grid grid-cols-2 gap-4">
                    <StatCard label="Total Registry" value={members.length} />
                    <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} color="text-brand-secondary" />
                    <StatCard label="Pending Approval" value={members.filter(m => !m.isVerified).length} color="text-orange-500" />
                    <StatCard label="Verified Members" value={members.filter(m => m.isVerified).length} color="text-green-600" />
                </div>

                <div className="px-6 space-y-4">
                    <input 
                        type="text"
                        placeholder="Search directory..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-100 p-4 rounded-2xl text-sm shadow-sm"
                    />

                    <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
                        {(['all', 'pending', 'verified', 'subscribers'] as AdminTab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-6 mt-6">
                    {isLoading ? (
                        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>
                    ) : (
                        <div className="space-y-4">
                            {filteredMembers.map((member) => (
                                <div key={member.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <img src={member.profileImageUrls[0]} alt={member.name} className="w-16 h-16 rounded-full object-cover shadow-inner border-2 border-white" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <p className="font-black text-brand-dark text-lg">{member.name}, {member.age}</p>
                                                {member.isVerified && <VerifiedIcon className="w-5 h-5 text-green-500" />}
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.occupation}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <button 
                                            onClick={() => member.isVerified ? revokeVerification(member.id) : approveVerification(member.id)}
                                            className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${member.isVerified ? 'bg-gray-100 text-gray-600' : 'bg-brand-primary text-white shadow-lg'}`}
                                        >
                                            {member.isVerified ? 'Revoke Verification' : 'Approve User'}
                                        </button>
                                        <button onClick={() => handleDelete(member.id)} className="text-red-400 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminScreen;
