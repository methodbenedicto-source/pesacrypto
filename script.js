// MOBILE MENU

function toggleMenu() {

  document.querySelector("nav").classList.toggle("show");

}

function toggleSearch() {
  const searchBox = document.getElementById("searchBox");
  searchBox.classList.toggle("show");
  if (searchBox.classList.contains("show")) {
    document.getElementById("searchInput").focus();
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}


// ARTICLE FILTER

function filterArticles(category) {

  const articles = document.querySelectorAll(".article-card");
  let visibleArticles = 0;

  articles.forEach(article => {

    const articleCategory =
      article.dataset.category;

    if (
      category === "all" ||
      articleCategory === category
    ) {

      article.style.display = "block";
      visibleArticles += 1;

    } else {

      article.style.display = "none";

    }

  });

  document.getElementById("noResults").style.display = visibleArticles ? "none" : "block";

}

function searchArticles() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const articles = document.querySelectorAll(".article-card");
  let visibleArticles = 0;

  articles.forEach(article => {
    const matches = article.dataset.title.includes(query);
    article.style.display = matches ? "block" : "none";
    if (matches) visibleArticles += 1;
  });

  document.getElementById("noResults").style.display = visibleArticles ? "none" : "block";
}


// FEATURED ARTICLE

function openArticle() {

  alert(
    "Article page coming soon."
  );

}


// NEWSLETTER

function subscribe(event) {

  event.preventDefault();

  const email =
    document.getElementById("email").value;

  alert(
    "Thanks! " + email +
    " has been subscribed."
  );

}