
import { User, Match, Message } from '../types';
import { CURRENT_USER, MATCHES_DATA, LIKED_MATCHES_DATA, MESSAGES_DATA } from '../constants';

const DB_KEYS = {
    USER: 'knot_user_profile',
    MATCHES: 'knot_matches_v2', // Versioned to avoid old schema conflicts
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
        if (!localStorage.getItem(DB_KEYS.USER)) {
            localStorage.setItem(DB_KEYS.USER, JSON.stringify(CURRENT_USER));
        }
        if (!localStorage.getItem(DB_KEYS.MATCHES)) {
            localStorage.setItem(DB_KEYS.MATCHES, JSON.stringify(MATCHES_DATA));
        }
        if (!localStorage.getItem(DB_KEYS.LIKES)) {
            localStorage.setItem(DB_KEYS.LIKES, JSON.stringify(LIKED_MATCHES_DATA));
        }
        if (!localStorage.getItem(DB_KEYS.MESSAGES)) {
            localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(MESSAGES_DATA));
        }
        this.isInitialized = true;
    }

    async getUser(): Promise<User> {
        const raw = localStorage.getItem(DB_KEYS.USER);
        if (!raw) return CURRENT_USER;
        const user = JSON.parse(raw);
        // Migration: Ensure childrenStatus exists for older profiles
        if (user.childrenStatus === undefined) {
            user.childrenStatus = "No kids";
            await this.saveUser(user);
        }
        return user;
    }

    async saveUser(user: User): Promise<void> {
        localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
    }

    async getMatches(): Promise<Match[]> {
        const raw = localStorage.getItem(DB_KEYS.MATCHES);
        if (!raw) return MATCHES_DATA;
        const matches = JSON.parse(raw);
        // Ensure child status exists for all matches
        return matches.map((m: Match) => ({
            ...m,
            childrenStatus: m.childrenStatus || "No kids"
        }));
    }

    async saveMatches(matches: Match[]): Promise<void> {
        localStorage.setItem(DB_KEYS.MATCHES, JSON.stringify(matches));
    }

    async addGlobalMatches(newMatches: Match[]): Promise<void> {
        const current = await this.getMatches();
        const existingIds = new Set(current.map(m => m.id));
        const uniqueNew = newMatches.filter(m => !existingIds.has(m.id));
        await this.saveMatches([...current, ...uniqueNew]);
    }

    async getLikedMatches(): Promise<Match[]> {
        const raw = localStorage.getItem(DB_KEYS.LIKES);
        return raw ? JSON.parse(raw) : [];
    }

    async addLike(match: Match): Promise<void> {
        const likes = await this.getLikedMatches();
        if (!likes.find(l => l.id === match.id)) {
            likes.push(match);
            localStorage.setItem(DB_KEYS.LIKES, JSON.stringify(likes));
        }
    }

    async getMessages(matchId: string): Promise<Message[]> {
        const historyStr = localStorage.getItem(DB_KEYS.MESSAGES);
        if (!historyStr) return [];
        const history = JSON.parse(historyStr);
        const conv = history.find((h: any) => h.matchId === matchId);
        return conv ? conv.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })) : [];
    }

    async sendMessage(matchId: string, message: Message): Promise<void> {
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
}

export const db = new DatabaseService();
