const toggle = document.getElementById("toggle");
const openOptionsButton = document.getElementById("openOptions");
const openAboutButton = document.getElementById("openAbout");

// Initialize toggle state
browser.storage.local.get("enabled").then(({ enabled }) => {
  toggle.checked = enabled;
});

// Handle enable / disable toggle
toggle.addEventListener("change", () => {
  browser.storage.local.set({ enabled: toggle.checked }).then(() => {
    browser.runtime.sendMessage({ type: "TOGGLE_ENABLED" });
  });
});

// Open options page
openOptionsButton.addEventListener("click", () => {
  browser.runtime.openOptionsPage();
});

// Open about page ONLY on click
openAboutButton.addEventListener("click", () => {
  browser.tabs.create({
    url: browser.runtime.getURL("about.html")
  });
});

