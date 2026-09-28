// ===============================
// MOBILE MENU
// ===============================

function toggleMenu() {

    const nav = document.querySelector("nav");

    if (nav) {
        nav.classList.toggle("show");
    }

}


// ===============================
// SEARCH
// ===============================

function toggleSearch() {

    const searchBox =
        document.getElementById("searchBox");

    if (!searchBox) return;

    searchBox.classList.toggle("show");

    if (searchBox.classList.contains("show")) {

        const input =
            document.getElementById("searchInput");

        if (input) {
            input.focus();
        }

    }

}


// ===============================
// DARK MODE
// ===============================

function toggleTheme() {

    document.body.classList.toggle("dark");

}


// ===============================
// GLOBAL ARTICLES
// ===============================

let allArticles = [];


// ===============================
// HTML ESCAPE
// ===============================

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ===============================
// DATE FORMAT
// ===============================

function formatDate(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// ===============================
// CATEGORY IMAGE
// ===============================

function categoryClass(category) {

    const c =
        String(category || "")
        .toLowerCase();

    if (c.includes("bitcoin")) {
        return "bitcoin-image";
    }

    if (c.includes("binance")) {
        return "binance-image";
    }

    if (c.includes("p2p")) {
        return "p2p-image";
    }

    if (
        c.includes("security") ||
        c.includes("wallet")
    ) {
        return "security-image";
    }

    if (c.includes("blockchain")) {
        return "blockchain-image";
    }

    return "wallet-image";

}


// ===============================
// CATEGORY ICON
// ===============================

function categoryIcon(category) {

    const c =
        String(category || "")
        .toLowerCase();

    if (c.includes("bitcoin")) {
        return "₿";
    }

    if (c.includes("binance")) {
        return "◆";
    }

    if (c.includes("p2p")) {
        return "↔";
    }

    if (
        c.includes("security") ||
        c.includes("wallet")
    ) {
        return "🔐";
    }

    if (c.includes("blockchain")) {
        return "⛓";
    }

    return "✦";

}


// ===============================
// RENDER ARTICLES
// ===============================

function renderArticles(articles) {

    const grid =
        document.getElementById(
            "articlesGrid"
        );

    const noResults =
        document.getElementById(
            "noResults"
        );

    if (!grid) {
        return;
    }


    grid.innerHTML =
        articles.map(article => {

            return `

            <article
                class="article-card"
                data-category="${escapeHtml(article.categorySlug)}"
                data-title="${escapeHtml(
                    (
                        article.title +
                        " " +
                        article.excerpt
                    ).toLowerCase()
                )}"
            >

                <a href="article.html?slug=${encodeURIComponent(article.slug)}">

                    <div class="article-image ${categoryClass(article.category)}">

                        <span>
                            ${categoryIcon(article.category)}
                        </span>

                    </div>

                </a>


                <div class="article-content">


                    <div class="article-meta">

                        <span class="tag">

                            ${escapeHtml(
                                article.category
                            )}

                        </span>

                        <span>

                            ${escapeHtml(
                                article.reading_time
                            )}

                        </span>

                    </div>


                    <h3>

                        <a
                            href="article.html?slug=${encodeURIComponent(article.slug)}"
                        >

                            ${escapeHtml(
                                article.title
                            )}

                        </a>

                    </h3>


                    <p>

                        ${escapeHtml(
                            article.excerpt
                        )}

                    </p>


                    <div class="card-footer">

                        <span>

                            ${escapeHtml(
                                article.author
                            )}

                        </span>

                        <span>

                            ${escapeHtml(
                                formatDate(article.date)
                            )}

                        </span>

                    </div>


                </div>

            </article>

            `;

        }).join("");


    if (noResults) {

        noResults.style.display =
            articles.length
                ? "none"
                : "block";

    }


    const count =
        document.querySelector(
            ".article-count"
        );

    if (count) {

        count.textContent =
            `${articles.length} Articles`;

    }

}


// ===============================
// LOAD ARTICLES
// ===============================

async function loadArticles() {

    try {

        const response =
            await fetch(
                "/articles.json?v=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "articles.json not found"
            );

        }


        allArticles =
            await response.json();


        renderArticles(
            allArticles
        );


    } catch (error) {

        console.error(
            "Failed to load articles:",
            error
        );

    }

}


// ===============================
// FILTER ARTICLES
// ===============================

function filterArticles(category) {

    const selected =
        String(category || "all")
        .toLowerCase();


    if (selected === "all") {

        renderArticles(
            allArticles
        );

        return;

    }


    const filtered =
        allArticles.filter(article => {

            return (

                article.categorySlug ===
                selected

                ||

                String(
                    article.category
                ).toLowerCase() ===
                selected

            );

        });


    renderArticles(
        filtered
    );

}


// ===============================
// SEARCH ARTICLES
// ===============================

function searchArticles() {

    const input =
        document.getElementById(
            "searchInput"
        );

    if (!input) {
        return;
    }


    const query =
        input.value
        .toLowerCase()
        .trim();


    if (!query) {

        renderArticles(
            allArticles
        );

        return;

    }


    const filtered =
        allArticles.filter(article => {

            const text = (

                article.title +
                " " +
                article.excerpt +
                " " +
                article.category

            ).toLowerCase();


            return text.includes(
                query
            );

        });


    renderArticles(
        filtered
    );

}


// ===============================
// LOAD SINGLE ARTICLE
// ===============================

async function loadArticlePage() {

    const articlePage =
        document.querySelector(
            ".article-page"
        );

    if (!articlePage) {
        return;
    }


    try {

        const response =
            await fetch(
                "/articles.json?v=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "articles.json not found"
            );

        }


        const articles =
            await response.json();


        const params =
            new URLSearchParams(
                window.location.search
            );


        const slug =
            params.get("slug");


        const article =
            articles.find(
                item =>
                    item.slug === slug
            );


        if (!article) {

            articlePage.innerHTML = `

                <div class="container">

                    <h1>
                        Makala haijapatikana.
                    </h1>

                    <p>
                        Makala uliyochagua haipo
                        au link si sahihi.
                    </p>

                    <a href="index.html">
                        ← Rudi Home
                    </a>

                </div>

            `;

            return;

        }


        // TITLE

        document.title =
            article.title +
            " — PesaCrypto";


        // CATEGORY

        const eyebrow =
            document.querySelector(
                ".article-header .eyebrow"
            );

        if (eyebrow) {

            eyebrow.textContent =
                article.category;

        }


        // TITLE

        const title =
            document.querySelector(
                ".article-header h1"
            );

        if (title) {

            title.textContent =
                article.title;

        }


        // EXCERPT

        const subtitle =
            document.querySelector(
                ".article-subtitle"
            );

        if (subtitle) {

            subtitle.textContent =
                article.excerpt;

        }


        // AUTHOR

        const author =
            document.querySelector(
                ".author-row strong"
            );

        if (author) {

            author.textContent =
                article.author;

        }


        // DATE

        const meta =
            document.querySelector(
                ".author-row span"
            );

        if (meta) {

            meta.textContent =
                `${formatDate(
                    article.date
                )} · ${
                    article.reading_time
                }`;

        }


        // COVER

        const cover =
            document.querySelector(
                ".article-cover"
            );

        if (cover) {

            cover.className =
                `article-cover ${
                    categoryClass(
                        article.category
                    )
                }`;


            cover.innerHTML = `

                <span>
                    ${
                        categoryIcon(
                            article.category
                        )
                    }
                </span>

            `;


            if (article.image) {

                cover.style.backgroundImage =
                    `url("${article.image}")`;

                cover.style.backgroundSize =
                    "cover";

                cover.style.backgroundPosition =
                    "center";

            }

        }


        // BODY

        const body =
            document.querySelector(
                ".article-body"
            );

        if (body) {

            body.innerHTML =
                article.body;

        }


        // RELATED ARTICLES

        const relatedGrid =
            document.querySelector(
                ".related-grid"
            );


        if (relatedGrid) {

            const related =
                articles
                .filter(
                    item =>
                        item.slug !==
                        article.slug
                )
                .slice(0, 3);


            relatedGrid.innerHTML =
                related.map(item => {

                    return `

                        <a
                            href="article.html?slug=${encodeURIComponent(item.slug)}"
                            class="related-card"
                        >

                            <span class="related-icon">

                                ${
                                    categoryIcon(
                                        item.category
                                    )
                                }

                            </span>


                            <div>

                                <span class="tag">

                                    ${
                                        escapeHtml(
                                            item.category
                                        )
                                    }

                                </span>


                                <h3>

                                    ${
                                        escapeHtml(
                                            item.title
                                        )
                                    }

                                </h3>

                            </div>

                        </a>

                    `;

                }).join("");

        }


    } catch (error) {

        console.error(
            "Failed to load article:",
            error
        );

    }

}


// ===============================
// NEWSLETTER
// ===============================

function subscribe(event) {

    event.preventDefault();


    const email =
        document.getElementById(
            "email"
        )?.value || "";


    alert(
        "Thanks! " +
        email +
        " has been subscribed."
    );

}


// ===============================
// SHARE
// ===============================

function shareArticle() {

    if (navigator.share) {

        navigator.share({

            title:
                document.title,

            url:
                window.location.href

        });

    } else {

        copyLink();

    }

}


// ===============================
// COPY LINK
// ===============================

function copyLink() {

    navigator.clipboard
        .writeText(
            window.location.href
        )
        .then(() => {

            alert(
                "Link copied!"
            );

        })
        .catch(() => {

            alert(
                "Copy failed."
            );

        });

}


// ===============================
// START
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadArticles();

        loadArticlePage();

    }
);
// ================= ARTICLE SHARING =================

function shareArticle() {

    if (navigator.share) {

        navigator.share({
            title: document.title,
            url: window.location.href
        });

    } else {

        copyLink();

    }

}


function copyLink() {

    navigator.clipboard
        .writeText(window.location.href)
        .then(() => {

            alert("Article link copied!");

        })
        .catch(() => {

            alert("Unable to copy link.");

        });

}