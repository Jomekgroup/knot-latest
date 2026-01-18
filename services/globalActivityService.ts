
export interface GlobalEvent {
    id: string;
    message: string;
    location: string;
    timestamp: Date;
}

const FALLBACK_EVENTS: GlobalEvent[] = [
    { id: 'f1', message: "Member identity verified", location: "London, UK", timestamp: new Date() },
    { id: 'f2', message: "New registry entry added", location: "Toronto, CA", timestamp: new Date() },
    { id: 'f3', message: "Marriage timeline updated", location: "Lagos, NG", timestamp: new Date() },
    { id: 'f4', message: "Premium member joined", location: "New York, US", timestamp: new Date() },
    { id: 'f5', message: "Profile verification successful", location: "Sydney, AU", timestamp: new Date() }
];

export const fetchRecentGlobalActivity = async (): Promise<GlobalEvent[]> => {
    return FALLBACK_EVENTS;
};
