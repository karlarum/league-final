// leaderboard.mjs
import { Storage } from '../storage.js';

export function leaderboardContent() {
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
        return `<div class="no-teams">No teams drafted yet!</div>`;
    }

    return teams
        .sort((a, b) => b.points - a.points)
        .map((team, index) => `
            <div class="leaderboard-row ${index < 3 ? 'top-three' : ''}">
                <div class="rank">
                    ${getRankBadge(index + 1)}
                    ${index + 1}
                </div>
                <div class="username">${team.username}</div>
                <div class="points">${team.points}</div>
                <div class="roster">
                    <button class="view-roster-btn" data-username="${team.username}">
                        View Roster
                    </button>
                </div>
            </div>
        `).join('');
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
                        ${player.name} (${player.role})
                    </div>
                `).join('')}
            </div>
            <button class="close-modal">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}