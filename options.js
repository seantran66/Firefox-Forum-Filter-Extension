const thresholdInput = document.getElementById("threshold");
const whitelistInput = document.getElementById("whitelist");
const saveButton = document.getElementById("save");

browser.storage.local.get([
  "reactionThreshold",
  "whitelist"
]).then(({ reactionThreshold, whitelist }) => {
  thresholdInput.value = reactionThreshold ?? 5;
  whitelistInput.value = (whitelist ?? []).join("\n");
});

saveButton.addEventListener("click", () => {
  const threshold = parseInt(thresholdInput.value, 10) || 0;
  const whitelist = whitelistInput.value
    .split("\n")
    .map(u => u.trim())
    .filter(Boolean);

  browser.storage.local.set({
    reactionThreshold: threshold,
    whitelist
  }).then(() => {
    browser.runtime.sendMessage({ type: "SETTINGS_UPDATED" });
  });
});
