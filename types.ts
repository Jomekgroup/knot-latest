
export type Screen = 'home' | 'likes' | 'messages' | 'discovery' | 'profile' | 'chat' | 'profileDetail' | 'videoCall' | 'verification' | 'editProfile' | 'managePhotos' | 'auth' | 'payment' | 'onboarding' | 'admin';

export enum SmokingHabits {
    NonSmoker = "Non-smoker",
    Occasional = "Occasional",
    Regular = "Regular",
    TryingToQuit = "Trying to quit",
}

export enum DrinkingHabits {
    Never = "Never",
    Socially = "Socially",
    Frequently = "Frequently",
    Sober = "Sober",
}

export enum MaritalStatus {
    NeverMarried = "Never Married",
    Divorced = "Divorced",
    Widowed = "Widowed",
    Annulled = "Annulled",
}

export enum WillingToRelocate {
    Yes = "Yes",
    No = "No",
    Maybe = "Maybe",
}

export enum ChildrenPreference {
    WantsChildren = "Wants children",
    DoesNotWantChildren = "Doesn't want children",
    OpenToChildren = "Open to children",
    HasChildren = "Has children",
}

export enum TravelFrequency {
    Often = "Often",
    Sometimes = "Sometimes",
    Rarely = "Rarely",
    Never = "Never",
}

export enum SocialActivity {
    Introvert = "Introvert",
    Extrovert = "Extrovert",
    Ambivert = "Ambivert",
}

export interface User {
    id: string;
    // Added email property to support search and identity features
    email?: string;
    name: string;
    age: number;
    bio: string;
    interests: string[];
    profileImageUrls: string[];
    isVerified: boolean;
    isPremium: boolean;
    occupation: string;
    city: string; 
    country: string; 
    
    // Detailed Location
    residenceCountry: string;
    residenceState: string;
    residenceCity: string;
    originCountry: string;
    originState: string;
    originCity: string;

    education: string;
    languages: string[];
    religion: string;
    culturalBackground: string;
    personalValues: string[];
    smoking: SmokingHabits;
    drinking: DrinkingHabits;
    maritalStatus: MaritalStatus;
    childrenStatus: string; 
    marriageTimeline: string;
    willingToRelocate: WillingToRelocate;
    preferredMarryFrom: string;
    childrenPreference: ChildrenPreference;
    idealPartnerTraits: string[];
    marriageExpectations: string;
    nationality: string;
    careerGoals: string;

    // Subscription Metadata
    subscriptionDate?: string;
    subscriptionAmount?: number;
    subscriptionPeriod?: string;
}

export interface Match extends User {
    compatibilityScore?: number;
    compatibilityInsight?: string;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
}

export interface Resource {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    link: string;
}

export interface FilterState {
    ageRange: [number, number];
    location: string;
    showVerifiedOnly: boolean;
}
