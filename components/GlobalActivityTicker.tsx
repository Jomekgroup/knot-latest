
import React, { useState, useEffect } from 'react';
import { fetchRecentGlobalActivity, GlobalEvent } from '../services/globalActivityService';

const GlobalActivityTicker: React.FC = () => {
    const [events, setEvents] = useState<GlobalEvent[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const loadActivity = async () => {
            const newEvents = await fetchRecentGlobalActivity();
            if (newEvents.length > 0) {
                setEvents(newEvents);
            }
        };

        loadActivity();
        const fetchInterval = setInterval(loadActivity, 60000); // Refresh registry activity every minute
        
        return () => clearInterval(fetchInterval);
    }, []);

    useEffect(() => {
        if (events.length === 0) return;
        const rotateInterval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % events.length);
        }, 5000); // Rotate message every 5 seconds
        
        return () => clearInterval(rotateInterval);
    }, [events]);

    if (events.length === 0) return null;

    const currentEvent = events[currentIndex];

    return (
        <div className="bg-brand-dark/95 backdrop-blur-md h-7 flex items-center justify-center overflow-hidden border-b border-white/5">
            <div className="flex items-center gap-2 animate-pulse-slow">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <p className="text-[10px] font-bold text-white/90 uppercase tracking-[0.1em]">
                    Live Knot Registry: <span className="text-brand-accent">{currentEvent.message}</span> in {currentEvent.location}
                </p>
            </div>
            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
            `}</style>
        </div>
    );
};

export default GlobalActivityTicker;
