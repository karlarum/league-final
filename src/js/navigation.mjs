import { loadPage } from "./pages.mjs";

export function setupNavigation() {
    document.addEventListener('click', (e) => {
        if (e.target.matches('nav a')) {
            e.preventDefault();
            const page = e.target.id.replace('-link', '');
            loadPage(page);
        }
    });
}