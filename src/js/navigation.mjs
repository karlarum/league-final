import { loadPage } from "./pages.mjs";

export function setupNavigation() {
    document.addEventListener('click', (e) => {
        if (e.target.id && e.target.id.endsWith('-link')) {
            e.preventDefault();
            const page = e.target.id.replace('-link', '');
            loadPage(page);
        }
    });
}