
import { User, Match } from '../types';
import { MATCHES_DATA } from '../constants';

/**
 * Calculates a compatibility score (0-100) based on shared profile data.
 * Weights: Location (25), Timeline (25), Values (20), Religion (15), Lifestyle (15)
 */
export const calculateMatchScore = (user: User, match: User): number => {
    let score = 50; // Neutral starting point

    // 1. Location Alignment (Max +25)
    if (user.residenceCountry === match.residenceCountry) {
        score += 15;
        if (user.residenceCity === match.residenceCity) score += 10;
    } else if (user.originCountry === match.originCountry) {
        score += 10; // Heritage connection if residence differs
    }

    // 2. Timeline Alignment (Max +25)
    if (user.marriageTimeline === match.marriageTimeline) {
        score += 25;
    } else {
        // Partial points for adjacent timelines
        const timelines = ["ASAP", "1-2 years", "3+ years", "Not sure"];
        const diff = Math.abs(timelines.indexOf(user.marriageTimeline) - timelines.indexOf(match.marriageTimeline));
        if (diff === 1) score += 10;
    }

    // 3. Shared Values (Max +20)
    const sharedValues = user.personalValues.filter(v => match.personalValues.includes(v));
    score += Math.min(sharedValues.length * 5, 20);

    // 4. Religion & Culture (Max +15)
    if (user.religion === match.religion) score += 10;
    if (user.culturalBackground === match.culturalBackground) score += 5;

    // 5. Lifestyle & Children (Max +15)
    if (user.childrenPreference === match.childrenPreference) score += 10;
    if (user.smoking === match.smoking) score += 5;

    // Normalize to 0-100 range
    return Math.min(Math.max(score, 0), 100);
};

export const getCompatibilityInsight = async (user: User, match: Match): Promise<{ score: number, insight: string }> => {
    const score = calculateMatchScore(user, match);
    
    let topReason = "shared registry values";
    if (user.residenceCity === match.residenceCity) topReason = "local proximity";
    else if (user.originCountry === match.originCountry) topReason = "common heritage";
    else if (user.marriageTimeline === match.marriageTimeline) topReason = "aligned marriage goals";

    const insight = score > 80 
        ? `Exceptional alignment based on ${topReason} and lifestyle sync.`
        : `Compatible foundation with strong potential in ${topReason}.`;

    return { score, insight };
};

export const searchRegistry = (query: string, matches: Match[]): Match[] => {
    if (!query.trim()) return matches;
    const q = query.toLowerCase();
    return matches.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.occupation.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q) ||
        m.culturalBackground.toLowerCase().includes(q) ||
        m.originCountry.toLowerCase().includes(q)
    );
};

export const queryGlobalRegistry = async (count: number = 3): Promise<Match[]> => {
    // Simulates fetching more entries from the production database
    return [...MATCHES_DATA].sort(() => 0.5 - Math.random()).slice(0, count);
};
