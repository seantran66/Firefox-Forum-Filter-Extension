const DEFAULT_SETTINGS = {
  enabled: true,
  reactionThreshold: 5,
  whitelist: []
};

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get(null).then(data => {
    if (Object.keys(data).length === 0) {
      browser.storage.local.set(DEFAULT_SETTINGS);
    }
  });
});

browser.runtime.onMessage.addListener(message => {
  if (message.type === "SETTINGS_UPDATED" || message.type === "TOGGLE_ENABLED") {
    browser.tabs.query({}).then(tabs => {
      for (const tab of tabs) {
        browser.tabs.sendMessage(tab.id, { type: "REAPPLY_FILTER" }).catch(() => {});
      }
    });
  }
});
