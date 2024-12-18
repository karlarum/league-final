const RIOT_API_KEY = import.meta.env.VITE_RIOT_API_KEY;
const API_URL = '/riot-api';

// Keep mockPlayers for fallback
const mockPlayers = [
    { id: 1, name: "Faker", team: "T1", role: "Mid", points: 0, imageUrl: "/images/Faker.webp" },
    { id: 2, name: "Chovy", team: "Gen.G", role: "Mid", points: 0, imageUrl: "/images/Chovy.webp" },
    { id: 3, name: "Zeus", team: "T1", role: "Top", points: 0, imageUrl: "/images/Zeus.webp" },
    { id: 4, name: "Keria", team: "T1", role: "Support", points: 0, imageUrl: "/images/Keria.webp" },
    { id: 5, name: "Gumayusi", team: "T1", role: "ADC", points: 0, imageUrl: "/images/Gumayusi.webp" },
    { id: 6, name: "Oner", team: "T1", role: "Jungle", points: 0, imageUrl: "/images/Oner.webp" }
];

const proPlayerData = {
    'Chovy': { role: 'Mid', team: 'Gen.G', imageUrl: '/images/Chovy.webp' },
    'Faker': { role: 'Mid', team: 'T1', imageUrl: '/images/Faker.webp' },
    'Zeus': { role: 'Top', team: 'T1', imageUrl: '/images/Zeus.webp' },
    'Keria': { role: 'Support', team: 'T1', imageUrl: '/images/Keria.webp' },
    'Gumayusi': { role: 'ADC', team: 'T1', imageUrl: '/images/Gumayusi.webp' },
    'Oner': { role: 'Jungle', team: 'T1', imageUrl: '/images/Oner.webp' }
};

export let isLoading = false;

export async function getProPlayers() {
    try {
        console.log('Fetching challenger league data...');
        const challengerData = await makeApiCall('/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5');
        
        if (!challengerData || !challengerData.entries) {
            throw new Error('Invalid API response');
        }

        // Take top 50 players by LP
        const topPlayers = challengerData.entries
            .sort((a, b) => b.leaguePoints - a.leaguePoints)
            .slice(0, 50);

        console.log(`Processing ${topPlayers.length} top players...`);
        
        const processedPlayers = [];
        const batchSize = 5;
        
        for (let i = 0; i < topPlayers.length; i += batchSize) {
            const batch = topPlayers.slice(i, i + batchSize);
            console.log(`Loading batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(topPlayers.length/batchSize)} (${(i/topPlayers.length * 100).toFixed(0)}%)`);
            
            for (const player of batch) {
                try {
                    await delay(500);
                    const summoner = await makeApiCall(`/lol/summoner/v4/summoners/${player.summonerId}`);
                    const proPlayer = proPlayerData[summoner.name];
                    
                    processedPlayers.push({
                        id: player.summonerId,
                        name: summoner.name || 'Unknown Player',
                        role: proPlayer ? proPlayer.role : assignRandomRole(),
                        team: proPlayer ? proPlayer.team : 'Challenger',
                        points: 0,
                        wins: player.wins || 0,
                        losses: player.losses || 0,
                        winRate: ((player.wins / (player.wins + player.losses)) * 100).toFixed(1),
                        leaguePoints: player.leaguePoints,
                        imageUrl: proPlayer ? 
                            proPlayer.imageUrl : 
                            `http://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${summoner.profileIconId}.png`
                    });
                } catch (error) {
                    console.warn(`Error processing player ${player.summonerName}:`, error);
                    continue;
                }
            }
        }

        console.log('Finished loading players:', processedPlayers.length);
        return processedPlayers;

    } catch (error) {
        console.error('Error in getProPlayers:', error);
        console.log('Falling back to mock data');
        return mockPlayers;
    }
}

async function makeApiCall(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}?api_key=${RIOT_API_KEY}`);
        
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            console.error('Response:', await response.text());
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`API call failed for ${endpoint}:`, error);
        throw error;
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function assignRandomRole() {
    const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
    return roles[Math.floor(Math.random() * roles.length)];
}