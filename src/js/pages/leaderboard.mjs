import { Storage } from '../storage.js';

function leaderboardContent() {
    setTimeout(() => {
        setupLeaderboardEvents();
    }, 0);

    return `
        <div class="leaderboard-content">
            <h2>Fantasy League Leaderboard</h2>
            
            <div class="leaderboard-container">
                <div class="leaderboard-filters">
                    <select id="time-filter" class="leaderboard-select">
                        <option value="weekly">This Week</option>
                        <option value="monthly">This Month</option>
                        <option value="allTime">All Time</option>
                    </select>
                </div>

                <div class="leaderboard-table">
                    <div class="leaderboard-header">
                        <div class="rank">Rank</div>
                        <div class="username">Username</div>
                        <div class="points">Points</div>
                        <div class="roster">Team Roster</div>
                    </div>
                    ${renderLeaderboard()}
                </div>
            </div>
        </div>
    `;
}

function renderLeaderboard() {
    const teams = Storage.getAllTeams();
    
    if (teams.length === 0) {
        return `<div class="no-teams">No teams drafted yet! Be the first to create a team!</div>`;
    }

    const topTeams = teams
        .sort((a, b) => b.totalPoints - a.totalPoints) 
        .slice(0, 3); // Get only the top 3 teams

    return topTeams
        .map((team, index) => `
            <div class="leaderboard-row ${index < 3 ? 'top-three' : ''}" data-rank="${index + 1}">
                <div class="rank">
                    ${getRankBadge(index + 1)}
                    ${index + 1}
                </div>
                <div class="username">${team.username || 'Anonymous Team'}</div>
                <div class="points">${team.totalPoints || 0}</div>
                <div class="roster">
                    <button class="view-roster-btn" data-username="${team.username}">
                        View Roster
                    </button>
                </div>
            </div>
        `).join('');
}

function getRankBadge(rank) {
    const badges = {
        1: '<span class="badge gold" title="First Place">🥇</span>',
        2: '<span class="badge silver" title="Second Place">🥈</span>',
        3: '<span class="badge bronze" title="Third Place">🥉</span>'
    };
    return badges[rank] || '';
}

function showRosterModal(username) {
    const teams = Storage.getAllTeams();
    const team = teams.find(t => t.username === username);
    if (!team) return;

    const modal = document.createElement('div');
    modal.className = 'roster-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${team.username}'s Roster</h3>
            <div class="roster-list">
                ${team.roster.map(player => `
                    <div class="roster-player">
                        <span class="player-name">${player.name}</span>
                        <span class="player-role ${player.role.toLowerCase()}">${player.role}</span>
                        <span class="player-team">${player.team}</span>
                    </div>
                `).join('')}
            </div>
            <div class="modal-footer">
                <div class="team-total">Total Points: ${team.totalPoints || 0}</div>
                <button class="close-modal">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function setupLeaderboardEvents() {
    const timeFilter = document.getElementById('time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', (e) => {
            console.log('Time filter changed:', e.target.value);
            updateLeaderboard(e.target.value);
        });
    }

    const rosterButtons = document.querySelectorAll('.view-roster-btn');
    rosterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const username = e.target.dataset.username;
            if (username) showRosterModal(username);
        });
    });
}

function updateLeaderboard(timeFrame) {
    const leaderboardTable = document.querySelector('.leaderboard-table');
    if (!leaderboardTable) return;

    const headerHTML = leaderboardTable.querySelector('.leaderboard-header').outerHTML;
    
    leaderboardTable.innerHTML = headerHTML + renderLeaderboard();
    
    setupLeaderboardEvents();
}

export { leaderboardContent, setupLeaderboardEvents };