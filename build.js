const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const ROOT = __dirname;
const articlesDir = path.join(ROOT, "content", "articles");
const outputDir = path.join(ROOT, "articles");
const articlesJsonPath = path.join(ROOT, "articles.json");

const SITE_NAME = "PesaCrypto";
const SITE_URL = "https://incredible-moonbeam-81529d.netlify.app";

// --------------------------------------------------
// CHECK ARTICLES FOLDER
// --------------------------------------------------

if (!fs.existsSync(articlesDir)) {
    console.log("content/articles folder haipo.");
    process.exit(0);
}

// --------------------------------------------------
// CREATE OUTPUT FOLDER
// --------------------------------------------------

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// --------------------------------------------------
// READ MARKDOWN ARTICLES
// --------------------------------------------------

const files = fs
    .readdirSync(articlesDir)
    .filter(file => file.endsWith(".md"));

const articles = [];


// --------------------------------------------------
// PROCESS EACH ARTICLE
// --------------------------------------------------

files.forEach(file => {

    const filePath = path.join(articlesDir, file);

    const source = fs.readFileSync(filePath, "utf8");

    const parsed = matter(source);

    const data = parsed.data;

    const body = parsed.content;


    // Slug kutoka filename
    const slug = file.replace(/\.md$/, "");


    // CMS fields
    const title = data.title || "Untitled Article";

    const category = data.category || "Crypto Basics";

    const author = data.author || SITE_NAME;

    const date = data.date || "";

    const readingTime = data.reading_time || "5 min read";

    const excerpt = data.excerpt || "";

    const image = data.image || "";


    // Markdown → HTML
    const htmlBody = marked.parse(body);


    // Article object
    const article = {

        title,

        category,

        author,

        date,

        readingTime,

        excerpt,

        image,

        slug,

        body: htmlBody

    };


    articles.push(article);

});


// --------------------------------------------------
// SORT ARTICLES — NEWEST FIRST
// --------------------------------------------------

articles.sort((a, b) => {

    const dateA = new Date(a.date || 0);

    const dateB = new Date(b.date || 0);

    return dateB - dateA;

});


// --------------------------------------------------
// GENERATE ARTICLE PAGES
// --------------------------------------------------

articles.forEach(article => {

    const {

        title,
        category,
        author,
        date,
        readingTime,
        excerpt,
        image,
        slug,
        body

    } = article;


    const articleFolder = path.join(outputDir, slug);


    if (!fs.existsSync(articleFolder)) {

        fs.mkdirSync(articleFolder, {
            recursive: true
        });

    }


    // --------------------------------------------------
    // RELATED ARTICLES
    // --------------------------------------------------

    const relatedArticles = articles

        .filter(item => item.slug !== slug)

        .filter(item => {

            return (

                item.category === category ||

                category === "Crypto Basics"

            );

        })

        .slice(0, 3);


    let relatedHTML = "";


    if (relatedArticles.length > 0) {

        relatedHTML = relatedArticles.map(item => {

            const relatedImage = item.image

                ? `
                    <div class="related-card-image">
                        <img
                            src="${escapeHTML(item.image)}"
                            alt="${escapeHTML(item.title)}"
                            loading="lazy"
                        >
                    </div>
                  `

                : `
                    <div class="related-icon">
                        ✦
                    </div>
                  `;


            return `

                <a
                    href="../${escapeHTML(item.slug)}/"
                    class="related-card"
                >

                    ${relatedImage}

                    <div>

                        <span class="tag">
                            ${escapeHTML(item.category)}
                        </span>

                        <h3>
                            ${escapeHTML(item.title)}
                        </h3>

                    </div>

                </a>

            `;

        }).join("");

    } else {

        relatedHTML = `

            <p>
                Hakuna related articles bado.
            </p>

        `;

    }


    // --------------------------------------------------
    // ARTICLE IMAGE
    // --------------------------------------------------

    let coverHTML = "";


    if (image) {

        coverHTML = `

            <div class="article-cover">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(title)}"
                    loading="eager"
                >

            </div>

        `;

    } else {

        coverHTML = `

            <div class="article-cover bitcoin-image">

                <span>
                    ₿
                </span>

            </div>

        `;

    }


    // --------------------------------------------------
    // CANONICAL URL
    // --------------------------------------------------

    const canonicalURL =
        `${SITE_URL}/articles/${slug}/`;


    // --------------------------------------------------
    // GENERATED ARTICLE PAGE
    // --------------------------------------------------

    const articleHTML = `<!DOCTYPE html>

<html lang="sw">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        ${escapeHTML(title)} — ${SITE_NAME}
    </title>

    <meta
        name="description"
        content="${escapeHTML(excerpt)}"
    >

    <meta
        name="author"
        content="${escapeHTML(author)}"
    >

    <meta
        name="robots"
        content="index, follow"
    >

    <link
        rel="canonical"
        href="${escapeHTML(canonicalURL)}"
    >


    <!-- OPEN GRAPH -->

    <meta
        property="og:type"
        content="article"
    >

    <meta
        property="og:title"
        content="${escapeHTML(title)}"
    >

    <meta
        property="og:description"
        content="${escapeHTML(excerpt)}"
    >

    <meta
        property="og:url"
        content="${escapeHTML(canonicalURL)}"
    >

    <meta
        property="og:site_name"
        content="${SITE_NAME}"
    >

    ${
        image
            ? `
    <meta
        property="og:image"
        content="${escapeHTML(image)}"
    >
            `
            : ""
    }


    <link
        rel="stylesheet"
        href="../../style.css"
    >

</head>


<body>


<!-- ================= NAVBAR ================= -->

<header class="navbar">


    <a
        href="../../index.html"
        class="brand"
    >

        <div class="brand-logo">
            P
        </div>


        <div>

            <strong>
                ${SITE_NAME}
            </strong>

            <span>
                CRYPTO EDUCATION
            </span>

        </div>

    </a>


    <nav>

        <a href="../../index.html">
            Home
        </a>

        <a href="../../index.html#articles">
            Makala
        </a>

        <a href="../../index.html#categories">
            Categories
        </a>

        <a href="../../index.html#about">
            About
        </a>

    </nav>


    <div class="nav-actions">

        <button
            class="icon-btn"
            onclick="toggleTheme()"
        >
            ☼
        </button>

    </div>

</header>


<!-- ================= ARTICLE ================= -->

<main class="article-page">


    <div class="article-header">


        <span class="eyebrow">

            ${escapeHTML(category)}

        </span>


        <h1>

            ${escapeHTML(title)}

        </h1>


        <p class="article-subtitle">

            ${escapeHTML(excerpt)}

        </p>


        <div class="author-row">


            <div class="author-avatar">

                ${getInitials(author)}

            </div>


            <div>

                <strong>

                    ${escapeHTML(author)}

                </strong>


                <span>

                    ${formatDate(date)}
                    ·
                    ${escapeHTML(readingTime)}

                </span>

            </div>


        </div>


    </div>


    <!-- COVER -->

    ${coverHTML}


    <!-- ARTICLE CONTENT -->

    <div class="article-layout">


        <aside class="article-share">


            <span>
                SHARE
            </span>


            <button
                onclick="shareArticle()"
            >
                ↗
            </button>


            <button
                onclick="copyLink()"
            >
                🔗
            </button>


        </aside>


        <article class="article-body">

            ${body}


            <div class="article-disclaimer">

                <strong>
                    Disclaimer:
                </strong>

                Makala haya ni kwa ajili ya education
                na general information tu.
                Si financial advice.

            </div>


        </article>


    </div>


    <!-- ================= RELATED ================= -->

    <section class="related container">


        <div class="section-heading">


            <div>

                <span class="eyebrow">
                    KEEP READING
                </span>


                <h2>
                    Related Articles
                </h2>

            </div>


        </div>


        <div class="related-grid">

            ${relatedHTML}

        </div>


    </section>


</main>


<!-- ================= FOOTER ================= -->

<footer>


    <div class="footer-brand">


        <div class="brand-logo">
            P
        </div>


        <div>

            <strong>
                ${SITE_NAME}
            </strong>


            <span>
                CRYPTO EDUCATION
            </span>

        </div>


    </div>


    <p>

        © 2026 ${SITE_NAME}.
        All rights reserved.

    </p>


</footer>


<script src="../../script.js"></script>


</body>

</html>`;


    // --------------------------------------------------
    // WRITE ARTICLE PAGE
    // --------------------------------------------------

    fs.writeFileSync(

        path.join(
            articleFolder,
            "index.html"
        ),

        articleHTML

    );

});


// --------------------------------------------------
// WRITE ARTICLES.JSON
// --------------------------------------------------

fs.writeFileSync(

    articlesJsonPath,

    JSON.stringify(
        articles,
        null,
        2
    )

);


// --------------------------------------------------
// SUCCESS MESSAGE
// --------------------------------------------------

console.log(
    `Built ${articles.length} articles successfully.`
);


// ==================================================
// FUNCTIONS
// ==================================================


// Escape HTML
function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// Get author initials
function getInitials(name) {

    return String(name)

        .trim()

        .split(/\s+/)

        .map(word => word[0])

        .join("")

        .substring(0, 2)

        .toUpperCase();

}


// Format date
function formatDate(date) {

    if (!date) {
        return "";
    }


    const d = new Date(date);


    if (isNaN(d)) {
        return String(date);
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