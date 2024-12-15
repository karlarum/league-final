export async function loadHeaderFooter() {
    const [headerResponse, footerResponse] = await Promise.all([
        fetch('/partials/header.html'),
        fetch('/partials/footer.html')
    ]);

    const [headerHtml, footerHtml] = await Promise.all([
        headerResponse.text(),
        footerResponse.text()
    ]);

    document.getElementById('main-header').innerHTML = headerHtml;
    document.getElementById('main-footer').innerHTML = footerHtml;
}