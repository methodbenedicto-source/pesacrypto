const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const articlesDir = path.join(__dirname, "content", "articles");
const outputDir = path.join(__dirname, "articles");

if (!fs.existsSync(articlesDir)) {
    console.log("content/articles folder haipo.");
    process.exit(0);
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs
    .readdirSync(articlesDir)
    .filter(file => file.endsWith(".md"));

const articles = [];

files.forEach(file => {

    const filePath = path.join(articlesDir, file);
    const source = fs.readFileSync(filePath, "utf8");

    const parsed = matter(source);

    const data = parsed.data;
    const body = parsed.content;

    const slug = file.replace(/\.md$/, "");

    const title = data.title || "Untitled Article";
    const category = data.category || "Crypto Basics";
    const author = data.author || "PesaCrypto";
    const date = data.date || "";
    const readingTime = data.reading_time || "5 min read";
    const excerpt = data.excerpt || "";
    const image = data.image || "";

    const htmlBody = marked.parse(body);

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

    const articleFolder = path.join(outputDir, slug);

    if (!fs.existsSync(articleFolder)) {
        fs.mkdirSync(articleFolder, { recursive: true });
    }

    const articleHTML = `
<!DOCTYPE html>
<html lang="sw">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${escapeHTML(title)} — PesaCrypto</title>

<meta
name="description"
content="${escapeHTML(excerpt)}"
>

<link rel="stylesheet" href="../../style.css">

</head>

<body>

<header class="navbar">

<a href="../../index.html" class="brand">

<div class="brand-logo">
P
</div>

<div>

<strong>PesaCrypto</strong>

<span>CRYPTO EDUCATION</span>

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
${formatDate(date)} · ${escapeHTML(readingTime)}
</span>

</div>

</div>

</div>


${
    image
        ? `<div class="article-cover">
<img src="${escapeHTML(image)}" alt="${escapeHTML(title)}">
</div>`
        : ""
}


<div class="article-layout">

<aside class="article-share">

<span>
SHARE
</span>

<button onclick="shareArticle()">
↗
</button>

<button onclick="copyLink()">
🔗
</button>

</aside>


<article class="article-body">

${htmlBody}

<div class="article-disclaimer">

<strong>
Disclaimer:
</strong>

Makala haya ni kwa ajili ya education
na general information tu. Si financial advice.

</div>

</article>

</div>

</main>


<footer>

<div class="footer-brand">

<div class="brand-logo">
P
</div>

<div>

<strong>
PesaCrypto
</strong>

<span>
CRYPTO EDUCATION
</span>

</div>

</div>

<p>
© 2026 PesaCrypto. All rights reserved.
</p>

</footer>


<script src="../../script.js"></script>

</body>

</html>
`;

    fs.writeFileSync(
        path.join(articleFolder, "index.html"),
        articleHTML
    );

});


fs.writeFileSync(
    path.join(__dirname, "articles.json"),
    JSON.stringify(articles, null, 2)
);

console.log(`Built ${articles.length} articles successfully.`);


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function getInitials(name) {

    return String(name)
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

}


function formatDate(date) {

    if (!date) return "";

    const d = new Date(date);

    if (isNaN(d)) return date;

    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

}