import { RIOT_API_KEY } from './apiConfig.js';

// Changed BASE_URL to use proxy
const BASE_URL = 'https://na1.api.riotgames.com';

const mockPlayers = [
    { id: 1, name: "Faker", team: "T1", role: "Mid", points: 0, imageUrl: "/images/Faker.webp" },
    { id: 2, name: "Chovy", team: "Gen.G", role: "Mid", points: 0, imageUrl: "/images/Chovy.webp" },
    { id: 3, name: "Zeus", team: "T1", role: "Top", points: 0, imageUrl: "/images/Zeus.webp" },
    { id: 4, name: "Keria", team: "T1", role: "Support", points: 0, imageUrl: "/images/Keria.webp" },
    { id: 5, name: "Gumayusi", team: "T1", role: "ADC", points: 0, imageUrl: "/images/Gumayusi.webp" },
    { id: 6, name: "Oner", team: "T1", role: "Jungle", points: 0, imageUrl: "/images/Oner.webp" }
];

export async function getProPlayers() {
    try {
        console.log('Attempting to fetch from Riot API...');
        
        // Testing with summoner endpoint first to verify API connection
        const response = await fetch(`${BASE_URL}/lol/summoner/v4/summoners/by-name/RiotGames`, {
            headers: {
                "X-Riot-Token": RIOT_API_KEY
            }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // For now, return mock data while testing the connection
        return mockPlayers;

    } catch (error) {
        console.log('Failed to fetch from API, using mock data instead');
        console.error('Error details:', error);
        return mockPlayers;
    }
}

export async function getMatches() {
    return [];
}