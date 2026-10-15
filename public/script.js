const GITHUB_USER = "natlionggg";
const THEME_KEY = "theme";

function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  const body = document.body;

  try {
    if (sessionStorage.getItem(THEME_KEY) === "dark") {
      body.classList.add("dark");
    }
  } catch {
    // sessionStorage unavailable; fall back to default theme
  }

  toggleBtn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark");
    try {
      sessionStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch {
      // sessionStorage unavailable; toggle still works for this page view
    }
  });
}

initThemeToggle();

async function loadRepos() {
  const statusEl = document.getElementById("repos-status");
  const gridEl = document.getElementById("repos-grid");

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`
    );

    if (!res.ok) {
      throw new Error(`GitHub API responded with ${res.status}`);
    }

    const repos = await res.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      statusEl.textContent = "No public repositories found.";
      return;
    }

    statusEl.remove();

    for (const repo of repos) {
      const card = document.createElement("article");
      card.className = "card";

      const title = document.createElement("h3");
      const titleLink = document.createElement("a");
      titleLink.href = repo.html_url;
      titleLink.target = "_blank";
      titleLink.rel = "noopener";
      titleLink.textContent = repo.name;
      title.appendChild(titleLink);

      const meta = document.createElement("div");
      meta.className = "card-meta";
      meta.innerHTML = `
        <span>${repo.language ?? "N/A"}</span>
        <span>★ ${repo.stargazers_count}</span>
      `;

      const desc = document.createElement("p");
      desc.textContent = repo.description || "No description provided.";

      card.append(title, meta, desc);
      gridEl.appendChild(card);
    }
  } catch (err) {
    statusEl.textContent = "Unable to load repositories right now.";
    console.error("Failed to load GitHub repos:", err);
  }
}

loadRepos();
