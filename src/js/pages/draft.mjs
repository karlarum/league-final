import { getProPlayers } from '../riotApi.js';
import { Storage } from '../storage.js';
// debugging
console.log('Current teams in storage:', Storage.getAllTeams());

const mockPlayers = [
    { id: 1, name: "Faker", team: "T1", role: "Mid", points: 0, imageUrl: "/images/Faker.webp" },
    { id: 2, name: "Chovy", team: "Gen.G", role: "Mid", points: 0, imageUrl: "/images/Chovy.webp" },
    { id: 3, name: "Zeus", team: "T1", role: "Top", points: 0, imageUrl: "/images/Zeus.webp" },
    { id: 4, name: "Keria", team: "T1", role: "Support", points: 0, imageUrl: "/images/Keria.webp" },
    { id: 5, name: "Gumayusi", team: "T1", role: "ADC", points: 0, imageUrl: "/images/Gumayusi.webp" },
    { id: 6, name: "Oner", team: "T1", role: "Jungle", points: 0, imageUrl: "/images/Oner.webp" }
];

// Keep track of drafted players
let draftedPlayers = {};
let errorMessage = '';
let players = []; // Will store our API data

export function draftContent() {
    // Set up event listeners after content is loaded
    setTimeout(() => {
        setupDraftEvents();
        loadPlayers(); // fetching the players
    }, 0);

    return `
        <div class="draft-content">
            <h2>Draft Your Team</h2>
            
            ${errorMessage ? `<div class="error-message">${errorMessage}</div>` : ''}
            
            <div class="draft-container">
                <div class="available-players">
                    <h3>Available Players</h3>
                    <div class="player-grid">
                        <p>Loading players...</p>
                    </div>
                </div>

                <div class="your-team">
                    <h3>Your Team</h3>
                    <div class="team-roster">
                        ${renderTeamSlots()}
                    </div>
                </div>
                
                <button id="save-team" class="save-team-button">
                    Save Team
                </button>
            </div>
        </div>
    `;
}
// function to fetch players
async function loadPlayers() {
    try {
        players = await getProPlayers();
        const playerGrid = document.querySelector('.player-grid');
        if (playerGrid) {
            playerGrid.innerHTML = renderAvailablePlayers();
        }
        setupDraftEvents();
    } catch (error) {
        console.error('Error loading players:', error);
    }
}

function renderTeamSlots() {
    const roles = ["Top", "Jungle", "Mid", "ADC", "Support"];
    return roles.map(role => {
        const draftedPlayer = draftedPlayers[role];
        return `
            <div class="role-slot ${draftedPlayer ? 'filled' : ''}" data-role="${role}">
                ${role}: ${draftedPlayer ? `
                    <span>${draftedPlayer.name}</span>
                    <button class="undraft-button" data-role="${role}">✕</button>
                ` : 'Empty'}
            </div>
        `;
    }).join('');
}

function renderAvailablePlayers() {
    return players.map(player => `
        <div class="player-card" data-player-id="${player.id}">
            <img src="${player.imageUrl || '/api/placeholder/150/150'}" alt="${player.name}" class="player-image">
            <h4>${player.name}</h4>
            <p class="team">${player.team}</p>
            <p class="role ${player.role.toLowerCase()}">${player.role}</p>
            <button class="draft-button ${draftedPlayers[player.role] ? 'disabled' : ''}" 
                    data-player-id="${player.id}"
                    ${draftedPlayers[player.role] ? 'disabled' : ''}>
                ${draftedPlayers[player.role]?.id === player.id ? 'Drafted' : 'Draft Player'}
            </button>
        </div>
    `).join('');
}

function draftPlayer(playerId) {
    const player = players.find(p => p.id === Number(playerId));
    if (!player) return;

    if (draftedPlayers[player.role]) {
        errorMessage = `You already have a ${player.role} player. Undraft ${draftedPlayers[player.role].name} first!`;
        updateDraftUI();
        
        setTimeout(() => {
            errorMessage = '';
            updateDraftUI();
        }, 3000);
        return;
    }

    draftedPlayers[player.role] = player;
    errorMessage = '';
    updateDraftUI();
}

function undraftPlayer(role) {
    delete draftedPlayers[role];
    updateDraftUI();
}

function updateDraftUI() {
    const teamRoster = document.querySelector('.team-roster');
    if (teamRoster) {
        teamRoster.innerHTML = renderTeamSlots();
    }

    const playerGrid = document.querySelector('.player-grid');
    if (playerGrid) {
        playerGrid.innerHTML = renderAvailablePlayers();
    }

    setupDraftEvents();
}

function saveDraftedTeam() {
    const playerArray = Object.values(draftedPlayers);
    console.log('Attempting to save team:', playerArray); // debugging
    
    if (playerArray.length === 5) {
        const team = {
            roster: playerArray,
            totalPoints: 0,
        };
        
        console.log('Team to save:', team); // debugging
        Storage.saveTeam(team);

        console.log('Teams after save:', Storage.getAllTeams()); //debugging
        
        errorMessage = 'Team successfully saved!';
        setTimeout(() => {
            errorMessage = '';
            updateDraftUI();
        }, 3000);

        draftedPlayers = {}; //debugging
    } else {
        errorMessage = 'Please draft all positions before saving!';
        setTimeout(() => {
            errorMessage = '';
            updateDraftUI();
        }, 3000);
    }
    updateDraftUI();
}

function setupDraftEvents() {
    // Draft button listeners
    document.querySelectorAll('.draft-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const playerId = e.target.dataset.playerId;
            if (playerId) draftPlayer(playerId);
        });
    });

    // Undraft button listeners
    document.querySelectorAll('.undraft-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const role = e.target.dataset.role;
            if (role) undraftPlayer(role);
        });
    });

    // Save team button listener
    document.getElementById('save-team')?.addEventListener('click', saveDraftedTeam);
}