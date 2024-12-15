import { homeContent } from "./pages/home.mjs";
import { draftContent } from "./pages/draft.mjs";
import { scoreboardContent } from "./pages/scoreboard.mjs";
import { leaderboardContent } from "./pages/leaderboard.mjs";

export function loadPage(page) {
    const appDiv = document.getElementById('app');
    
    // Remove any active classes from nav links
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
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
            break;
        case 'leaderboard':
            appDiv.innerHTML = leaderboardContent();
            break;
    }
}