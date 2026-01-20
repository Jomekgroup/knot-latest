import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { User, Match, Message } from '../types';
import { MATCHES_DATA, LIKED_MATCHES_DATA, MESSAGES_DATA } from '../constants';

// 1. Initialize Clients
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // https://backend-latest-knot.onrender.com/api
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
        // Keep localStorage as a fallback/cache
        if (!localStorage.getItem(DB_KEYS.MATCHES)) {
            localStorage.setItem(DB_KEYS.MATCHES, JSON.stringify(MATCHES_DATA));
        }
        this.isInitialized = true;
    }

    // --- USER PROFILE METHODS ---

    async getUser(): Promise<User | null> {
        // 1. Try to get the current Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            // 2. Fetch profile from your RENDER BACKEND
            try {
                const response = await api.get(`/users/${session.user.id}`);
                const user = response.data;
                await this.saveUser(user); // Sync local cache
                return user;
            } catch (e) {
                console.warn("Backend unreachable, checking local cache...");
            }
        }

        // 3. Fallback to localStorage if offline or backend fails
        const raw = localStorage.getItem(DB_KEYS.USER);
        return raw ? JSON.parse(raw) : null;
    }

    async saveUser(user: User): Promise<void> {
        // Save to local cache
        localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
        
        // Push to Render Backend
        try {
            await api.post('/users/update', user);
        } catch (e) {
            console.error("Failed to sync user to cloud", e);
        }
    }

    // --- MATCHES & LIKES ---

    async getMatches(): Promise<Match[]> {
        try {
            const { data } = await api.get('/matches');
            return data;
        } catch (e) {
            const raw = localStorage.getItem(DB_KEYS.MATCHES);
            return raw ? JSON.parse(raw) : MATCHES_DATA;
        }
    }

    async addLike(match: Match): Promise<void> {
        // 1. Update UI/Local immediately
        const likes = await this.getLikedMatches();
        if (!likes.find(l => l.id === match.id)) {
            likes.push(match);
            localStorage.setItem(DB_KEYS.LIKES, JSON.stringify(likes));
            
            // 2. Notify Backend
            await api.post('/likes', { matchId: match.id });
        }
    }

    async getLikedMatches(): Promise<Match[]> {
        const raw = localStorage.getItem(DB_KEYS.LIKES);
        return raw ? JSON.parse(raw) : [];
    }

    // --- MESSAGING ---

    async sendMessage(matchId: string, message: Message): Promise<void> {
        // Push to Backend/Supabase Realtime
        await api.post('/messages/send', { matchId, message });
        
        // Update local history
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
    }
}

export const db = new DatabaseService();