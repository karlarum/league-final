import { loadHeaderFooter } from "./utils.mjs";
import { setupNavigation } from "./navigation.mjs";
import { loadPage } from "./pages.mjs";

document.addEventListener('DOMContentLoaded', async () => {

    await loadHeaderFooter();

    setupNavigation();
    
    loadPage('home');
});