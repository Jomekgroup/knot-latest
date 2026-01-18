
import { User, Match } from '../types';

export const generateConversationStarters = async (user: User, match: Match): Promise<string[]> => {
    return [
        `I see we both have roots in ${match.originCountry}. Does your family still follow many traditions from there?`,
        "Your registry profile mentions shared values. What is the most important one to you in a marriage?",
        `As a ${user.occupation}, I'm curious: how does your career influence your perspective on building a family?`
    ];
};
