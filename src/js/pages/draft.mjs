const mockPlayers = [
    { id: 1, name: "Faker", team: "T1", role: "Mid", points: 0, imageUrl: "/api/placeholder/150/150" },
    { id: 2, name: "Chovy", team: "Gen.G", role: "Mid", points: 0, imageUrl: "/api/placeholder/150/150" },
    { id: 3, name: "Zeus", team: "T1", role: "Top", points: 0, imageUrl: "/api/placeholder/150/150" },
    { id: 4, name: "Keria", team: "T1", role: "Support", points: 0, imageUrl: "/api/placeholder/150/150" },
    { id: 5, name: "Gumayusi", team: "T1", role: "ADC", points: 0, imageUrl: "/api/placeholder/150/150" },
    { id: 6, name: "Oner", team: "T1", role: "Jungle", points: 0, imageUrl: "/api/placeholder/150/150" }
];

// Keep track of drafted players
let draftedPlayers = {};
let errorMessage = '';

export function draftContent() {
    return `
        <div class="draft-content">
            <h2>Draft Your Team</h2>
            
            ${errorMessage ? `<div class="error-message">${errorMessage}</div>` : ''}
            
            <div class="draft-container">
                <!-- Available Players Section -->
                <div class="available-players">
                    <h3>Available Players</h3>
                    <div class="player-grid">
                        ${renderAvailablePlayers()}
                    </div>
                </div>

                <!-- Your Team Section -->
                <div class="your-team">
                    <h3>Your Team</h3>
                    <div class="team-roster">
                        ${renderTeamSlots()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTeamSlots() {
    const roles = ["Top", "Jungle", "Mid", "ADC", "Support"];
    return roles.map(role => {
        const draftedPlayer = draftedPlayers[role];
        return `
            <div class="role-slot ${draftedPlayer ? 'filled' : ''}" data-role="${role}">
                ${role}: ${draftedPlayer ? `
                    <span>${draftedPlayer.name}</span>
                    <button class="undraft-button" onclick="undraftPlayer('${role}')">✕</button>
                ` : 'Empty'}
            </div>
        `;
    }).join('');
}

function renderAvailablePlayers() {
    return mockPlayers.map(player => `
        <div class="player-card" data-player-id="${player.id}">
            <img src="${player.imageUrl}" alt="${player.name}" class="player-image">
            <h4>${player.name}</h4>
            <p class="team">${player.team}</p>
            <p class="role ${player.role.toLowerCase()}">${player.role}</p>
            <button class="draft-button ${draftedPlayers[player.role] ? 'disabled' : ''}" 
                    onclick="draftPlayer(${player.id})"
                    ${draftedPlayers[player.role] ? 'disabled' : ''}>
                ${draftedPlayers[player.role]?.id === player.id ? 'Drafted' : 'Draft Player'}
            </button>
        </div>
    `).join('');
}

window.draftPlayer = function(playerId) {
    const player = mockPlayers.find(p => p.id === playerId);
    if (!player) return;

    if (draftedPlayers[player.role]) {
        errorMessage = `You already have a ${player.role} player. Undraft ${draftedPlayers[player.role].name} first!`;
        updateDraftUI();
        
        // Clear error message after 3 seconds
        setTimeout(() => {
            errorMessage = '';
            updateDraftUI();
        }, 3000);
        return;
    }

    draftedPlayers[player.role] = player;
    errorMessage = ''; // Clear any existing error
    updateDraftUI();
};

window.undraftPlayer = function(role) {
    delete draftedPlayers[role];
    updateDraftUI();
};

window.updateDraftUI = function() {
    // Update team roster
    const teamRoster = document.querySelector('.team-roster');
    if (teamRoster) {
        teamRoster.innerHTML = renderTeamSlots();
    }

    // Update available players
    const playerGrid = document.querySelector('.player-grid');
    if (playerGrid) {
        playerGrid.innerHTML = renderAvailablePlayers();
    }
};