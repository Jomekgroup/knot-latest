
import { User, Match, Resource, FilterState, SmokingHabits, DrinkingHabits, MaritalStatus, WillingToRelocate, ChildrenPreference, Message } from './types';

export const CURRENT_USER: User = {
    id: 'user_0',
    name: 'Alex',
    age: 29,
    bio: "Software engineer with a passion for travel, hiking, and finding the best coffee shops. Looking for someone to share adventures and quiet moments with. My faith and family are important to me.",
    interests: ["Traveling", "Hiking", "Coffee", "Programming", "Photography"],
    profileImageUrls: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    ],
    isVerified: false,
    isPremium: false,
    occupation: 'Software Engineer',
    city: 'San Francisco',
    country: 'USA',
    // Detailed Registry Locations
    residenceCountry: 'United States of America',
    residenceState: 'California',
    residenceCity: 'San Francisco',
    originCountry: 'Nigeria',
    originState: 'Lagos',
    originCity: 'Ikeja',
    culturalBackground: 'Yoruba',
    education: 'B.S. in Computer Science',
    languages: ['English', 'Yoruba', 'Spanish'],
    religion: 'Christian',
    personalValues: ['Honesty', 'Family', 'Kindness', 'Ambition'],
    smoking: SmokingHabits.NonSmoker,
    drinking: DrinkingHabits.Socially,
    maritalStatus: MaritalStatus.NeverMarried,
    childrenStatus: "No kids",
    marriageTimeline: '1-2 years',
    willingToRelocate: WillingToRelocate.Maybe,
    preferredMarryFrom: 'Anywhere',
    childrenPreference: ChildrenPreference.WantsChildren,
    idealPartnerTraits: ['Kind', 'Ambitious', 'Family-oriented', 'Good sense of humor'],
    marriageExpectations: "Looking for a life partner to build a future with, based on shared values, mutual respect, and a deep connection.",
    nationality: 'American/Nigerian',
    careerGoals: 'Lead a team and build a product that makes a difference.'
};

export const MATCHES_DATA: Match[] = [
    {
        id: 'match_1',
        name: 'Sofia',
        age: 27,
        bio: "Art director who loves painting, visiting museums, and trying new recipes. I'm looking for a creative and kind-hearted partner to explore life with.",
        interests: ["Art", "Cooking", "Museums", "Traveling", "Yoga"],
        profileImageUrls: [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop', 
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop'
        ],
        isVerified: true,
        isPremium: true,
        occupation: 'Art Director',
        city: 'New York',
        country: 'USA',
        residenceCountry: 'United States of America',
        residenceState: 'New York',
        residenceCity: 'New York',
        originCountry: 'Italy',
        originState: 'Tuscany',
        originCity: 'Florence',
        culturalBackground: 'Italian',
        marriageExpectations: "Seeking a genuine connection with someone who is passionate about their life and is ready for a serious commitment.",
        education: 'M.A. in Fine Arts',
        languages: ['English', 'French', 'Italian'],
        religion: 'Spiritual but not religious',
        personalValues: ['Creativity', 'Empathy', 'Growth'],
        smoking: SmokingHabits.NonSmoker,
        drinking: DrinkingHabits.Socially,
        maritalStatus: MaritalStatus.NeverMarried,
        childrenStatus: "No kids",
        marriageTimeline: 'Within a year',
        willingToRelocate: WillingToRelocate.Yes,
        preferredMarryFrom: 'USA, Europe',
        childrenPreference: ChildrenPreference.OpenToChildren,
        idealPartnerTraits: ['Creative', 'Kind', 'Supportive'],
        nationality: 'American',
        careerGoals: 'Open my own art gallery.'
    },
    {
        id: 'match_2',
        name: 'Liam',
        age: 31,
        bio: "Doctor who unwinds by playing guitar and going for long runs. I value deep conversations and a good sense of humor. Family is very important to me.",
        interests: ["Music", "Running", "Reading", "Volunteering"],
        profileImageUrls: [
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop', 
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop', 
            'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=800&auto=format&fit=crop'
        ],
        isVerified: true,
        isPremium: false,
        occupation: 'Doctor',
        city: 'London',
        country: 'UK',
        residenceCountry: 'United Kingdom',
        residenceState: 'England',
        residenceCity: 'London',
        originCountry: 'United Kingdom',
        originState: 'Scotland',
        originCity: 'Edinburgh',
        culturalBackground: 'Scottish-British',
        marriageExpectations: "I'm looking for a partner in life who is caring, intelligent, and shares my desire to build a family.",
        education: 'MD',
        languages: ['English'],
        religion: 'Agnostic',
        personalValues: ['Compassion', 'Family', 'Intellect'],
        smoking: SmokingHabits.NonSmoker,
        drinking: DrinkingHabits.Never,
        maritalStatus: MaritalStatus.Divorced,
        childrenStatus: "Has children",
        marriageTimeline: '1-2 years',
        willingToRelocate: WillingToRelocate.No,
        preferredMarryFrom: 'UK',
        childrenPreference: ChildrenPreference.WantsChildren,
        idealPartnerTraits: ['Caring', 'Intelligent', 'Family-oriented'],
        nationality: 'British',
        careerGoals: 'Specialize in pediatric care.'
    },
    {
        id: 'match_feed_11', name: 'Zoe', age: 27, bio: "UX Designer. I create digital beauty and seek a partner for a minimalist, intentional life.", interests: ["Design", "Minimalism"], profileImageUrls: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop'], isVerified: true, isPremium: false, occupation: 'UX Designer', city: 'San Francisco', country: 'USA', residenceCountry: 'United States of America', residenceState: 'California', residenceCity: 'San Francisco', originCountry: 'South Korea', originState: 'Seoul', originCity: 'Gangnam', culturalBackground: 'Korean-American', marriageExpectations: "Seeking a partner who values quiet growth and shared peace.", education: 'BFA', languages: ['English', 'Korean'], religion: 'Secular', personalValues: ['Peace', 'Design'], smoking: SmokingHabits.NonSmoker, drinking: DrinkingHabits.Socially, maritalStatus: MaritalStatus.NeverMarried, childrenStatus: 'No kids', marriageTimeline: '1-2 years', willingToRelocate: WillingToRelocate.Maybe, preferredMarryFrom: 'USA', childrenPreference: ChildrenPreference.WantsChildren, idealPartnerTraits: ['Stable', 'Calm'], nationality: 'American', careerGoals: 'Lead a global design team.'
    },
    {
        id: 'match_feed_12', name: 'Gabriel', age: 32, bio: "Structural Engineer. I build bridges, and now I'm building a future. I love sailing and chess.", interests: ["Sailing", "Chess"], profileImageUrls: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'], isVerified: true, isPremium: false, occupation: 'Engineer', city: 'London', country: 'UK', residenceCountry: 'United Kingdom', residenceState: 'England', residenceCity: 'London', originCountry: 'France', originState: 'Normandy', originCity: 'Le Havre', culturalBackground: 'French-English', marriageExpectations: "Looking for a supportive, intelligent partner to navigate life's waters.", education: 'M.Eng', languages: ['English', 'French'], religion: 'Christian', personalValues: ['Logic', 'Loyalty'], smoking: SmokingHabits.NonSmoker, drinking: DrinkingHabits.Socially, maritalStatus: MaritalStatus.NeverMarried, childrenStatus: 'No kids', marriageTimeline: 'Within a year', willingToRelocate: WillingToRelocate.Yes, preferredMarryFrom: 'Europe', childrenPreference: ChildrenPreference.WantsChildren, idealPartnerTraits: ['Intelligent', 'Loyal'], nationality: 'British', careerGoals: 'Director of Engineering.'
    }
];

export const LIKED_MATCHES_DATA: Match[] = [
    MATCHES_DATA[0]
];

export const MESSAGES_DATA: { matchId: string, messages: Message[] }[] = [
    {
        matchId: 'match_1',
        messages: [
            { id: 'msg1', senderId: 'match_1', text: `Hey ${CURRENT_USER.name}! It's great to connect.`, timestamp: new Date(Date.now() - 1000 * 60 * 10) },
        ]
    }
];

export const RESOURCES_DATA: Resource[] = [
    {
        id: 'res1',
        title: '5 Tips for a Great First Date',
        description: 'Make a lasting impression with these proven first date tips.',
        category: 'Dating Advice',
        imageUrl: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=800&auto=format&fit=crop',
        link: '#'
    }
];

export const INITIAL_FILTERS: FilterState = {
    ageRange: [25, 35],
    location: '',
    showVerifiedOnly: false,
};
