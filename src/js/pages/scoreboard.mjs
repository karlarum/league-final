// Mock data for live scores
const mockMatchData = {
    currentMatch: {
        team1: "T1",
        team2: "Gen.G",
        score: "1-0",
        status: "In Progress",
        gameDuration: "25:30"
    }
};

const mockPlayerStats = [
    { 
        name: "Faker", 
        team: "T1", 
        role: "Mid",
        currentStats: {
            kills: 3,
            deaths: 1,
            assists: 4,
            cs: 205,
            fantasyPoints: 25.5
        }
    },
    { 
        name: "Chovy", 
        team: "Gen.G", 
        role: "Mid",
        currentStats: {
            kills: 2,
            deaths: 2,
            assists: 3,
            cs: 215,
            fantasyPoints: 20.5
        }
    },
];

export function scoreboardContent() {
    // Set up event listeners and refresh timer after content is loaded
    setTimeout(() => {
        setupScoreboardEvents();
        startLiveUpdates();
    }, 0);

    return `
        <div class="scoreboard-content">
            <h2>Live Scoreboard</h2>
            
            <div class="match-info">
                ${renderCurrentMatch()}
            </div>

            <div class="scoreboard-container">
                <div class="scoreboard-filters">
                    <select id="match-filter" class="scoreboard-select">
                        <option value="current">Current Match</option>
                        <option value="upcoming">Upcoming Matches</option>
                        <option value="completed">Completed Matches</option>
                    </select>
                    
                    <select id="team-filter" class="scoreboard-select">
                        <option value="all">All Teams</option>
                        <option value="T1">T1</option>
                        <option value="Gen.G">Gen.G</option>
                    </select>
                </div>

                <div class="player-stats-container">
                    <h3>Live Player Stats</h3>
                    <div class="stats-table">
                        <div class="stats-header">
                            <div class="player">Player</div>
                            <div class="team">Team</div>
                            <div class="role">Role</div>
                            <div class="kda">KDA</div>
                            <div class="cs">CS</div>
                            <div class="points">Fantasy Points</div>
                        </div>
                        ${renderPlayerStats()}
                    </div>
                </div>

                <div class="your-team-summary">
                    <h3>Your Team's Performance</h3>
                    <div id="team-points">
                        ${renderTeamSummary()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderCurrentMatch() {
    const { currentMatch } = mockMatchData;
    return `
        <div class="current-match">
            <div class="match-teams">
                <span class="team1">${currentMatch.team1}</span>
                <span class="score">${currentMatch.score}</span>
                <span class="team2">${currentMatch.team2}</span>
            </div>
            <div class="match-details">
                <span class="status">${currentMatch.status}</span>
                <span class="duration">${currentMatch.gameDuration}</span>
            </div>
        </div>
    `;
}

function renderPlayerStats() {
    return mockPlayerStats.map(player => `
        <div class="stats-row">
            <div class="player">${player.name}</div>
            <div class="team">${player.team}</div>
            <div class="role">${player.role}</div>
            <div class="kda">
                ${player.currentStats.kills}/${player.currentStats.deaths}/${player.currentStats.assists}
            </div>
            <div class="cs">${player.currentStats.cs}</div>
            <div class="points">${player.currentStats.fantasyPoints}</div>
        </div>
    `).join('');
}

function renderTeamSummary() {
    // In a real application, this would calculate points based on your drafted players
    const totalPoints = mockPlayerStats
        .reduce((sum, player) => sum + player.currentStats.fantasyPoints, 0);
    
    return `
        <div class="team-summary">
            <div class="total-points">
                <span>Total Points:</span>
                <span class="points-value">${totalPoints.toFixed(1)}</span>
            </div>
        </div>
    `;
}

function calculateFantasyPoints(stats) {
    // Example fantasy points calculation
    return (
        stats.kills * 3 +
        stats.assists * 1.5 -
        stats.deaths * 1 +
        stats.cs * 0.02
    ).toFixed(1);
}

function startLiveUpdates() {
    // Simulate live updates every 30 seconds
    setInterval(() => {
        updateMatchStats();
    }, 30000);
}

function updateMatchStats() {
    // In a real application, this would fetch new data from your backend
    // For now, we'll just randomly update some stats
    mockPlayerStats.forEach(player => {
        player.currentStats.cs += Math.floor(Math.random() * 10);
        player.currentStats.fantasyPoints = calculateFantasyPoints(player.currentStats);
    });

    // Update the UI
    const statsContainer = document.querySelector('.stats-table');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stats-header">
                <div class="player">Player</div>
                <div class="team">Team</div>
                <div class="role">Role</div>
                <div class="kda">KDA</div>
                <div class="cs">CS</div>
                <div class="points">Fantasy Points</div>
            </div>
            ${renderPlayerStats()}
        `;
    }

    const teamPoints = document.getElementById('team-points');
    if (teamPoints) {
        teamPoints.innerHTML = renderTeamSummary();
    }
}

function setupScoreboardEvents() {
    // Match filter change handler
    document.getElementById('match-filter')?.addEventListener('change', (e) => {
        // In a real application, this would fetch new match data
        console.log('Match filter changed to:', e.target.value);
    });

    // Team filter change handler
    document.getElementById('team-filter')?.addEventListener('change', (e) => {
        // In a real application, this would filter the displayed players
        console.log('Team filter changed to:', e.target.value);
    });
}