import { getProPlayers, isLoading } from '../riotApi.js';
import { Storage } from '../storage.js';

let players = [];
let draftedPlayers = {};
let errorMessage = '';

export function draftContent() {
    setTimeout(() => {
        setupDraftEvents();
        loadPlayers();
    }, 0);

    return `
        <div class="draft-content">
            <h2>Draft Your Team</h2>
            
            ${errorMessage ? `<div class="error-message">${errorMessage}</div>` : ''}
            
            <div class="draft-container">
                <div class="available-players">
                    <h3>Available Players</h3>
                    <div id="player-selection" class="player-grid">
                            <p class="loading">Loading available players</p>
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

async function loadPlayers() {
    try {
        // Listen for player updates
        window.addEventListener('playersUpdated', (event) => {
            players = event.detail.players;
            updatePlayerGrid();
        });

        players = await getProPlayers();
        updatePlayerGrid();
    } catch (error) {
        console.error('Error loading players:', error);
        errorMessage = 'Error loading players. Please try again.';
        updatePlayerGrid();
    }
}

function updatePlayerGrid() {
    const playerGrid = document.querySelector('.player-grid');
    if (playerGrid) {
        playerGrid.innerHTML = players.length > 0 ? 
            renderAvailablePlayers() : 
            '<p>No players available</p>';
        setupDraftEvents();
    }
}

function renderAvailablePlayers() {
    return players.map(player => `
        <div class="player-card" data-player-id="${player.id}">
            <div class="player-image-container">
                <img src="${player.imageUrl}" 
                     alt="${player.name}" 
                     class="player-image">
            </div>
            <h4 class="player-name">${player.name}</h4>
            <div class="player-stats">
                <span class="wins">W: ${player.wins}</span>
                <span class="losses">L: ${player.losses}</span>
                ${player.winRate ? `<span class="winrate">WR: ${player.winRate}%</span>` : ''}
                ${player.leaguePoints ? `<span class="lp">LP: ${player.leaguePoints}</span>` : ''}
            </div>
            <p class="team">${player.team}</p>
            <p class="role ${player.role?.toLowerCase()}">${player.role}</p>
            <button class="draft-button ${draftedPlayers[player.role] ? 'disabled' : ''}" 
                    data-player-id="${player.id}"
                    ${draftedPlayers[player.role] ? 'disabled' : ''}>
                ${draftedPlayers[player.role]?.id === player.id ? 'Drafted' : 'Draft Player'}
            </button>
        </div>
    `).join('');
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

function draftPlayer(playerId) {
    console.log('Attempting to draft player:', playerId); // Debugging
    const player = players.find(p => p.id === playerId);
    if (!player) {
        console.log('Player not found:', playerId);
        return;
    }

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
    
    if (playerArray.length === 5) {
        const team = {
            roster: playerArray,
            totalPoints: 0,
        };
        
        Storage.saveTeam(team);

        // success notification with runic border
        const notification = document.createElement('div');
        notification.className = 'save-success';
        notification.textContent = 'Team Successfully Saved! 🏆';
        document.body.appendChild(notification);
        
        // remove notification
        setTimeout(() => {
            notification.remove();
        }, 2000);

    } else {
        errorMessage = 'Please draft all positions before saving!';
    }
    updateDraftUI();
}

function setupDraftEvents() {
    // Draft button listeners
    document.querySelectorAll('.draft-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const playerId = e.target.dataset.playerId;
            console.log('Draft button clicked for player:', playerId); // Debug log
            if (playerId) draftPlayer(playerId);
        });
    });

    // Undraft button listeners
    document.querySelectorAll('.undraft-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const role = e.target.dataset.role;
            console.log('Undraft button clicked for role:', role); // Debug log
            if (role) undraftPlayer(role);
        });
    });

    // Save team button listener
    const saveButton = document.getElementById('save-team');
    if (saveButton) {
        saveButton.addEventListener('click', saveDraftedTeam);
    }
}