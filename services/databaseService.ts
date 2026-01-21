import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { User, Match, Message } from '../types';
import { MATCHES_DATA, LIKED_MATCHES_DATA, MESSAGES_DATA } from '../constants';

// 1. Initialize Clients
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * FIX 1: Enhanced Auth Configuration
 * We must explicitly enable persistSession and detectSessionInUrl 
 * so that the login "sticks" when returning from Google.
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true // Critical for Hash Routers (/#/)
    }
});

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Ensure this is https://backend-latest-knot.onrender.com/api
});

const DB_KEYS = {
    USER: 'knot_user_profile',
    MATCHES: 'knot_matches_v2', 
    LIKES: 'knot_likes',
    MESSAGES: 'knot_messages_history'
};

class DatabaseService {
    private isInitialized = false;

    constructor() {
        this.init();
    }

    private init() {
        if (this.isInitialized) return;
        if (!localStorage.getItem(DB_KEYS.MATCHES)) {
            localStorage.setItem(DB_KEYS.MATCHES, JSON.stringify(MATCHES_DATA));
        }
        this.isInitialized = true;
    }

    // --- USER PROFILE METHODS ---

    async getUser(): Promise<User | null> {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            try {
                // Fixed path to include /users (Ensure backend has app.use('/api/users', ...))
                const response = await api.get(`/users/${session.user.id}`);
                const user = response.data;
                await this.saveUser(user);
                return user;
            } catch (e) {
                console.warn("Backend unreachable, checking local cache...");
            }
        }

        const raw = localStorage.getItem(DB_KEYS.USER);
        return raw ? JSON.parse(raw) : null;
    }

    async saveUser(user: User): Promise<void> {
        localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
        
        try {
            await api.post('/users/update', user);
        } catch (e) {
            console.error("Failed to sync user to cloud", e);
        }
    }

    // --- MATCHES & LIKES ---

    async getMatches(): Promise<Match[]> {
        try {
            /**
             * FIX 2: Resolved 404 Error
             * Changed path from '/matches' to '/api/matches' to match 
             * the Render backend route mounting.
             */
            const { data } = await api.get('/matches'); 
            return data;
        } catch (e) {
            console.error("Matches fetch failed, using local fallback");
            const raw = localStorage.getItem(DB_KEYS.MATCHES);
            return raw ? JSON.parse(raw) : MATCHES_DATA;
        }
    }

    async addLike(match: Match): Promise<void> {
        const likes = await this.getLikedMatches();
        if (!likes.find(l => l.id === match.id)) {
            likes.push(match);
            localStorage.setItem(DB_KEYS.LIKES, JSON.stringify(likes));
            
            try {
                await api.post('/likes', { matchId: match.id });
            } catch (e) {
                console.warn("Could not sync like to backend");
            }
        }
    }

    async getLikedMatches(): Promise<Match[]> {
        const raw = localStorage.getItem(DB_KEYS.LIKES);
        return raw ? JSON.parse(raw) : [];
    }

    // --- MESSAGING ---

    async sendMessage(matchId: string, message: Message): Promise<void> {
        try {
            await api.post('/messages/send', { matchId, message });
        } catch (e) {
            console.warn("Message not sent to cloud, saved locally only");
        }
        
        const historyStr = localStorage.getItem(DB_KEYS.MESSAGES);
        const history = historyStr ? JSON.parse(historyStr) : [];
        let conv = history.find((h: any) => h.matchId === matchId);
        if (!conv) {
            conv = { matchId, messages: [] };
            history.push(conv);
        }
        conv.messages.push(message);
        localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(history));
    }

    async clearSession(): Promise<void> {
        await supabase.auth.signOut();
        localStorage.removeItem(DB_KEYS.USER);
        localStorage.removeItem(DB_KEYS.LIKES);
    }
}

export const db = new DatabaseService();