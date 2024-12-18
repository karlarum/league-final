// const RIOT_API_KEY = import.meta.env.VITE_RIOT_API_KEY;
// const API_URL = '/riot-api';
// const PLAYER_LIMIT = 15;
// const BATCH_DELAY = 1000;

// const mockPlayers = [
//     { id: 1, name: "Faker", team: "T1", role: "Mid", points: 0, imageUrl: "/images/Faker.webp" },
//     { id: 2, name: "Chovy", team: "Gen.G", role: "Mid", points: 0, imageUrl: "/images/Chovy.webp" },
//     { id: 3, name: "Zeus", team: "T1", role: "Top", points: 0, imageUrl: "/images/Zeus.webp" },
//     { id: 4, name: "Keria", team: "T1", role: "Support", points: 0, imageUrl: "/images/Keria.webp" },
//     { id: 5, name: "Gumayusi", team: "T1", role: "ADC", points: 0, imageUrl: "/images/Gumayusi.webp" },
//     { id: 6, name: "Oner", team: "T1", role: "Jungle", points: 0, imageUrl: "/images/Oner.webp" }
// ];

// const proPlayerData = {
//     'Chovy': { role: 'Mid', team: 'Gen.G', imageUrl: '/images/Chovy.webp' },
//     'Faker': { role: 'Mid', team: 'T1', imageUrl: '/images/Faker.webp' },
//     'Zeus': { role: 'Top', team: 'T1', imageUrl: '/images/Zeus.webp' },
//     'Keria': { role: 'Support', team: 'T1', imageUrl: '/images/Keria.webp' },
//     'Gumayusi': { role: 'ADC', team: 'T1', imageUrl: '/images/Gumayusi.webp' },
//     'Oner': { role: 'Jungle', team: 'T1', imageUrl: '/images/Oner.webp' }
// };

// export let isLoading = false;

// export async function getProPlayers() {
//     try {
//         console.log('Fetching challenger league data...');
//         isLoading = true;
        
//         const challengerData = await makeApiCall('/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5');
        
//         if (!challengerData || !challengerData.entries) {
//             console.error('Invalid challenger data received:', challengerData);
//             throw new Error('Invalid API response');
//         }

//         // Take top 15 players by LP
//         const topPlayers = challengerData.entries
//             .sort((a, b) => b.leaguePoints - a.leaguePoints)
//             .slice(0, PLAYER_LIMIT);

//         console.log(`Processing ${topPlayers.length} top players...`);
        
//         const processedPlayers = [];
//         const batchSize = 3;
        
//         for (let i = 0; i < topPlayers.length; i += batchSize) {
//             const batch = topPlayers.slice(i, i + batchSize);
//             console.log(`Loading batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(topPlayers.length/batchSize)}`);
            
//             const batchPromises = batch.map(async (player) => {
//                 try {
//                     await delay(BATCH_DELAY);
                    
//                     // Log the API call we're about to make
//                     console.log(`Fetching summoner data for ID: ${player.summonerId}`);
                    
//                     const summoner = await makeApiCall(`/lol/summoner/v4/summoners/${player.summonerId}`);
                    
//                     // Log the response we got
//                     console.log('Received summoner data:', summoner);
                    
//                     if (!summoner) {
//                         console.warn(`No summoner data received for ID ${player.summonerId}`);
//                         return null;
//                     }

//                     if (!summoner.name) {
//                         console.warn(`Summoner data missing name for ID ${player.summonerId}:`, summoner);
//                         return null;
//                     }

//                     const proPlayer = proPlayerData[summoner.name];
                    
//                     // Log successful player processing
//                     console.log(`Successfully processed player: ${summoner.name}`);
                    
//                     return {
//                         id: player.summonerId,
//                         name: summoner.name,
//                         role: proPlayer ? proPlayer.role : assignRandomRole(),
//                         team: proPlayer ? proPlayer.team : 'Challenger',
//                         points: 0,
//                         wins: player.wins || 0,
//                         losses: player.losses || 0,
//                         winRate: ((player.wins / (player.wins + player.losses)) * 100).toFixed(1),
//                         leaguePoints: player.leaguePoints,
//                         imageUrl: proPlayer ? 
//                             proPlayer.imageUrl : 
//                             `http://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${summoner.profileIconId}.png`
//                     };
//                 } catch (error) {
//                     console.error(`Error processing player ${player.summonerId}:`, error);
//                     console.error('Full player data:', player);
//                     return null;
//                 }
//             });

//             const batchResults = await Promise.all(batchPromises);
//             const validResults = batchResults.filter(player => player !== null);
//             console.log(`Batch completed. Valid players found: ${validResults.length}`);
//             processedPlayers.push(...validResults);

//             await delay(BATCH_DELAY);
//         }

//         console.log('Finished loading players:', processedPlayers.length);
        
//         if (processedPlayers.length < 5) {
//             console.warn('Insufficient players loaded, falling back to mock data');
//             return mockPlayers;
//         }

//         return processedPlayers;

//     } catch (error) {
//         console.error('Error in getProPlayers:', error);
//         console.log('Falling back to mock data');
//         return mockPlayers;
//     } finally {
//         isLoading = false;
//     }
// }

// async function makeApiCall(endpoint) {
//     try {
//         console.log(`Making API call to: ${API_URL}${endpoint}`);
        
//         const response = await fetch(`${API_URL}${endpoint}?api_key=${RIOT_API_KEY}`);
        
//         // Log the response status and headers
//         console.log(`API Response Status: ${response.status}`);
//         console.log(`API Response Headers:`, Object.fromEntries(response.headers));
        
//         if (response.status === 429) {
//             throw new Error('Rate limit exceeded');
//         }
        
//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error('API Error Response:', errorText);
//             throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//         }
        
//         const data = await response.json();
        
//         if (!data) {
//             throw new Error('Empty response from API');
//         }
        
//         return data;
//     } catch (error) {
//         console.error(`API call failed for ${endpoint}:`, error);
//         throw error;
//     }
// }

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// function assignRandomRole() {
//     const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
//     return roles[Math.floor(Math.random() * roles.length)];
// }
const RIOT_API_KEY = import.meta.env.VITE_RIOT_API_KEY;
const API_URL = '/riot-api';
const PLAYER_LIMIT = 15;
const BATCH_DELAY = 1000;

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

function assignRandomRole() {
    const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
    return roles[Math.floor(Math.random() * roles.length)];
}

export async function getProPlayers() {
    try {
        console.log('Fetching challenger league data...');
        isLoading = true;
        
        // This needs to go to na1 region
        const challengerData = await makeApiCall('/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5', 'na1');
        
        if (!challengerData || !challengerData.entries) {
            throw new Error('Invalid API response');
        }

        const topPlayers = challengerData.entries
            .sort((a, b) => b.leaguePoints - a.leaguePoints)
            .slice(0, PLAYER_LIMIT);

        console.log(`Processing ${topPlayers.length} top players...`);
        
        const processedPlayers = [];
        const batchSize = 3;
        
        for (let i = 0; i < topPlayers.length; i += batchSize) {
            const batch = topPlayers.slice(i, i + batchSize);
            console.log(`Loading batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(topPlayers.length/batchSize)}`);
            
            const batchPromises = batch.map(async (player) => {
                try {
                    await delay(BATCH_DELAY);
                    
                    // Step 1: Get summoner data to get PUUID (na1 region)
                    const summoner = await makeApiCall(`/lol/summoner/v4/summoners/${player.summonerId}`, 'na1');
                    
                    if (!summoner || !summoner.puuid) {
                        console.warn('No valid summoner data received');
                        return null;
                    }

                    // Step 2: Use PUUID to get Riot ID (americas region)
                    await delay(BATCH_DELAY);
                    const accountInfo = await makeApiCall(`/riot/account/v1/accounts/by-puuid/${summoner.puuid}`, 'americas');
                    
                    if (!accountInfo || !accountInfo.gameName) {
                        console.warn('No account info received');
                        return null;
                    }

                    // Construct full Riot ID (gameName#tagLine)
                    const riotId = `${accountInfo.gameName}#${accountInfo.tagLine}`;
                    const proPlayer = proPlayerData[accountInfo.gameName];
                    
                    const processedPlayer = {
                        id: player.summonerId,
                        name: accountInfo.gameName, // Just use gameName without tagLine
                        riotId: riotId, // Full Riot ID if needed
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
                    };

                    console.log('Processed player:', processedPlayer);
                    return processedPlayer;

                } catch (error) {
                    console.error(`Error processing player ${player.summonerId}:`, error);
                    return null;
                }
            });

            const batchResults = await Promise.all(batchPromises);
            const validResults = batchResults.filter(player => player !== null);
            console.log(`Batch completed. Valid players found: ${validResults.length}`);
            processedPlayers.push(...validResults);

            await delay(BATCH_DELAY);
        }

        console.log('Finished loading players:', processedPlayers.length);
        
        if (processedPlayers.length < 5) {
            console.warn('Insufficient players loaded, falling back to mock data');
            return mockPlayers;
        }

        return processedPlayers;

    } catch (error) {
        console.error('Error in getProPlayers:', error);
        console.log('Falling back to mock data');
        return mockPlayers;
    } finally {
        isLoading = false;
    }
}

async function makeApiCall(endpoint, region) {
    try {
        const url = `${API_URL}/${region}${endpoint}`;
            
        console.log(`Making API call to: ${url}`);
        const response = await fetch(`${url}?api_key=${RIOT_API_KEY}`);
        
        if (response.status === 429) {
            throw new Error('Rate limit exceeded');
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (!data) {
            throw new Error('Empty response from API');
        }
        
        return data;
    } catch (error) {
        console.error(`API call failed for ${endpoint}:`, error);
        throw error;
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));