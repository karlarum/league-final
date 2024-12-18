//scoreboard.mjs
import { Storage } from '../storage.js';

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
    }
];

export function scoreboardContent() {
    return `
        <div class="scoreboard-content">
            <h2>Live Scoreboard</h2>
            
            <div class="current-match">
                <div class="match-teams">
                    <span class="team1">${mockMatchData.currentMatch.team1}</span>
                    <span class="score">${mockMatchData.currentMatch.score}</span>
                    <span class="team2">${mockMatchData.currentMatch.team2}</span>
                </div>
                <div class="match-details">
                    <span class="status">${mockMatchData.currentMatch.status}</span>
                    <span class="duration">${mockMatchData.currentMatch.gameDuration}</span>
                </div>
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

                <div class="stats-table">
                    <div class="stats-header">
                        <div>Player</div>
                        <div>Team</div>
                        <div>Role</div>
                        <div>KDA</div>
                        <div>CS</div>
                        <div>Fantasy Points</div>
                    </div>
                    ${renderPlayerStats()}
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

function renderPlayerStats() {
    return mockPlayerStats.map(player => `
        <div class="stats-row">
            <div>${player.name}</div>
            <div>${player.team}</div>
            <div>${player.role}</div>
            <div>${player.currentStats.kills}/${player.currentStats.deaths}/${player.currentStats.assists}</div>
            <div>${player.currentStats.cs}</div>
            <div>${player.currentStats.fantasyPoints}</div>
        </div>
    `).join('');
}

function renderTeamSummary() {
    const userTeam = Storage.getAllTeams()[0];
    let totalPoints = 0;

    if (userTeam && userTeam.roster) {
        totalPoints = userTeam.roster.reduce((sum, player) => {
            const mockPlayer = mockPlayerStats.find(p => p.name === player.name);
            return sum + (mockPlayer?.currentStats?.fantasyPoints || 0);
        }, 0);
    }

    const formattedPoints = Number(totalPoints).toFixed(1);

    return `
        <div class="total-points">
            <span>Total Fantasy Points:</span>
            <span class="points-value">${formattedPoints}</span>
        </div>
    `;
}

export function initializeScoreboard() {
    setupScoreboardEvents();
    startLiveUpdates();
}

function setupScoreboardEvents() {
    document.getElementById('match-filter')?.addEventListener('change', (e) => {
        console.log('Match filter changed to:', e.target.value);
    });

    document.getElementById('team-filter')?.addEventListener('change', (e) => {
        console.log('Team filter changed to:', e.target.value);
    });
}

function calculateFantasyPoints(stats) {
    const points = (
        stats.kills * 3 +
        stats.assists * 1.5 -
        stats.deaths * 1 +
        stats.cs * 0.02
    );
    return Number(points).toFixed(1);
}

function startLiveUpdates() {
    setInterval(() => {
        updateMatchStats();
    }, 30000);
}

function updateMatchStats() {
    mockPlayerStats.forEach(player => {
        player.currentStats.cs += Math.floor(Math.random() * 10);
        player.currentStats.fantasyPoints = calculateFantasyPoints(player.currentStats);
    });

    const statsTable = document.querySelector('.stats-table');
    if (statsTable) {
        const headerHTML = statsTable.querySelector('.stats-header').outerHTML;
        statsTable.innerHTML = headerHTML + renderPlayerStats();
    }

    const teamPoints = document.getElementById('team-points');
    if (teamPoints) {
        teamPoints.innerHTML = renderTeamSummary();
    }
}