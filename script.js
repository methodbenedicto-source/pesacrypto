```javascript
// ================= MOBILE MENU =================

function toggleMenu() {
    const nav = document.querySelector("nav");

    if (nav) {
        nav.classList.toggle("show");
    }
}


// ================= SEARCH =================

function toggleSearch() {
    const searchBox = document.getElementById("searchBox");

    if (!searchBox) return;

    searchBox.classList.toggle("show");

    if (searchBox.classList.contains("show")) {
        const input = document.getElementById("searchInput");

        if (input) {
            input.focus();
        }
    }
}


// ================= DARK MODE =================

function toggleTheme() {
    document.body.classList.toggle("dark");
}


// ================= DYNAMIC ARTICLES =================

let allArticles = [];


async function loadArticles() {

    const articlesGrid =
        document.getElementById("articlesGrid");

    if (!articlesGrid) return;


    try {

        const response =
            await fetch("/articles.json");

        if (!response.ok) {
            throw new Error("Failed to load articles.json");
        }


        allArticles =
            await response.json();


        renderArticles(allArticles);


    } catch (error) {

        console.error(
            "Error loading articles:",
            error
        );

    }

}


// ================= RENDER ARTICLES =================

function renderArticles(articles) {

    const articlesGrid =
        document.getElementById("articlesGrid");

    const noResults =
        document.getElementById("noResults");

    const articleCount =
        document.querySelector(".article-count");


    if (!articlesGrid) return;


    articlesGrid.innerHTML = "";


    if (articleCount) {

        articleCount.textContent =
            `${articles.length} Articles`;

    }


    if (!articles.length) {

        if (noResults) {
            noResults.style.display = "block";
        }

        return;

    }


    if (noResults) {
        noResults.style.display = "none";
    }


    articles.forEach(article => {

        const card =
            document.createElement("article");

        card.className =
            "article-card";


        const category =
            normalizeCategory(article.category);


        const imageHTML =
            article.image

                ? `
                    <div class="article-image">
                        <img
                            src="${escapeHTML(article.image)}"
                            alt="${escapeHTML(article.title)}"
                        >
                    </div>
                  `

                : `
                    <div class="article-image">
                        <span>₿</span>
                    </div>
                  `;


        card.dataset.category =
            category;

        card.dataset.title =
            `${article.title} ${article.excerpt || ""}`
                .toLowerCase();


        card.innerHTML = `

            <a href="/articles/${encodeURIComponent(article.slug)}/">

                ${imageHTML}

            </a>


            <div class="article-content">


                <div class="article-meta">

                    <span class="tag">
                        ${escapeHTML(
                            article.category || "CRYPTO"
                        )}
                    </span>

                    <span>
                        ${escapeHTML(
                            article.readingTime || "5 min read"
                        )}
                    </span>

                </div>


                <h3>

                    ${escapeHTML(
                        article.title
                    )}

                </h3>


                <p>

                    ${escapeHTML(
                        article.excerpt || ""
                    )}

                </p>


                <div class="card-footer">

                    <span>

                        ${escapeHTML(
                            article.author || "PesaCrypto"
                        )}

                    </span>


                    <span>

                        ${formatDate(
                            article.date
                        )}

                    </span>

                </div>


            </div>

        `;


        articlesGrid.appendChild(card);

    });

}


// ================= CATEGORY FILTER =================

function filterArticles(category) {

    const articles =
        document.querySelectorAll(".article-card");

    let visibleArticles = 0;


    articles.forEach(article => {

        const articleCategory =
            normalizeCategory(
                article.dataset.category
            );


        if (
            category === "all" ||
            articleCategory === category
        ) {

            article.style.display =
                "block";

            visibleArticles += 1;

        } else {

            article.style.display =
                "none";

        }

    });


    const noResults =
        document.getElementById("noResults");


    if (noResults) {

        noResults.style.display =
            visibleArticles
                ? "none"
                : "block";

    }

}


// ================= SEARCH ARTICLES =================

function searchArticles() {

    const input =
        document.getElementById("searchInput");


    if (!input) return;


    const query =
        input.value
            .toLowerCase()
            .trim();


    const articles =
        document.querySelectorAll(".article-card");


    let visibleArticles = 0;


    articles.forEach(article => {

        const title =
            article.dataset.title || "";


        const matches =
            title.includes(query);


        article.style.display =
            matches
                ? "block"
                : "none";


        if (matches) {
            visibleArticles += 1;
        }

    });


    const noResults =
        document.getElementById("noResults");


    if (noResults) {

        noResults.style.display =
            visibleArticles
                ? "none"
                : "block";

    }

}


// ================= HELPERS =================

function normalizeCategory(category) {

    if (!category) {
        return "crypto-basics";
    }


    return String(category)
        .toLowerCase()
        .trim()
        .replace(/&/g, "")
        .replace(/\s+/g, "-");

}


function formatDate(date) {

    if (!date) return "";


    const d =
        new Date(date);


    if (isNaN(d)) {
        return date;
    }


    return d.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


function escapeHTML(value) {

    return String(value || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ================= ARTICLE SHARING =================

function shareArticle() {

    if (
        navigator.share
    ) {

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


function copyLink() {

    navigator.clipboard
        .writeText(
            window.location.href
        )
        .then(() => {

            alert(
                "Article link copied!"
            );

        });

}


// ================= NEWSLETTER =================

function subscribe(event) {

    event.preventDefault();


    const email =
        document.getElementById("email").value;


    alert(
        "Thanks! " +
        email +
        " has been subscribed."
    );

}


// ================= START =================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadArticles();

    }
);
```
