// Sample fetch kwa ajili ya Custom Articles kutoka kwenye JSON file
async function loadArticles() {
    try {
        const response = await fetch('articles.json');
        const articles = await response.json();
        
        const grid = document.getElementById('articlesGrid');
        grid.innerHTML = '';

        articles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
                <span class="tag">${article.category}</span>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Kosa la kupakia makala:', error);
    }
}

// Fetch Live News kutoka bure Crypto Compare API
async function loadCryptoNews() {
    try {
        const res = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        const data = await res.json();
        const news = data.Data.slice(0, 6); // Chukua habari 6 za kwanza

        const newsGrid = document.getElementById('newsGrid');
        newsGrid.innerHTML = '';

        news.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3><a href="${item.url}" target="_blank" style="color:inherit;text-decoration:none;">${item.title}</a></h3>
                <p>${item.body.substring(0, 100)}...</p>
                <span class="tag">${item.source}</span>
            `;
            newsGrid.appendChild(card);
        });
    } catch (err) {
        console.error('Kosa la kupakia live news:', err);
    }
}

// Tumia function zote site ikiload
document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
    loadCryptoNews();
});