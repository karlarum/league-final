import { homeContent } from "./pages/home.mjs";
import { draftContent } from "./pages/draft.mjs";
import { scoreboardContent, initializeScoreboard } from "./pages/scoreboard.mjs";
import { leaderboardContent } from "./pages/leaderboard.mjs";

export function loadPage(page) {
    const appDiv = document.getElementById('app');
    
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.getElementById(`${page}-link`);
    if (activeLink) activeLink.classList.add('active');

    switch (page) {
        case 'home':
            appDiv.innerHTML = homeContent();
            break;
        case 'draft':
            appDiv.innerHTML = draftContent();
            break;
        case 'scoreboard':
            appDiv.innerHTML = scoreboardContent();
            initializeScoreboard();
            break;
        case 'leaderboard':
            appDiv.innerHTML = leaderboardContent();
            break;
    }
}