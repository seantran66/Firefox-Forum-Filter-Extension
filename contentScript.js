let hiddenPosts = new Set();

function getSettings() {
  return browser.storage.local.get([
    "enabled",
    "reactionThreshold",
    "whitelist"
  ]);
}

/* ===== ON3 SELECTORS ===== */

function getPosts() {
  return document.querySelectorAll(
    "article.message.message--post.js-post"
  );
}

function getUsername(post) {
  return post.querySelector("a.username")?.textContent.trim() || "";
}

function getReactionCount(post) {
  const reactionsBar = post.querySelector(".reactionsBar");
  if (!reactionsBar) return 0;

  let count = 0;

  // Count visible usernames
  const users = reactionsBar.querySelectorAll("bdi");
  count += users.length;

  // Count "and X others"
  const text = reactionsBar.textContent;
  const match = text.match(/and\s+(\d+)\s+other/);
  if (match) {
    count += parseInt(match[1], 10);
  }

  return count;
}

/* ===== FILTERING LOGIC ===== */

function hidePost(post) {
  post.style.display = "none";
  post.dataset.hiddenByExtension = "true";
  hiddenPosts.add(post);
}

function showAllPosts() {
  hiddenPosts.forEach(post => {
    post.style.display = "";
    delete post.dataset.hiddenByExtension;
  });
  hiddenPosts.clear();
}

async function applyFilter() {
  const { enabled, reactionThreshold, whitelist } = await getSettings();

  if (!enabled) {
    showAllPosts();
    return;
  }

  const posts = getPosts();

  posts.forEach(post => {
    const username = getUsername(post);
    const reactions = getReactionCount(post);

    const allowed =
      reactions >= reactionThreshold ||
      whitelist.includes(username);

    if (!allowed) {
      hidePost(post);
    }
  });
}

/* ===== RUN + LISTEN ===== */

document.addEventListener("DOMContentLoaded", applyFilter);

browser.runtime.onMessage.addListener(message => {
  if (message.type === "REAPPLY_FILTER") {
    showAllPosts();
    applyFilter();
  }
});
