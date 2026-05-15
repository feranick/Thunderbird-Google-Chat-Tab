browser.spacesToolbar.addButton('GoogleChat', {
    title: "Google Chat",
    defaultIcons: "skin/google_chat_icon.svg",
    url: "https://chat.google.com/"
});

browser.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    for (let header of details.requestHeaders) {
      if (header.name.toLowerCase() === "user-agent") {
        header.value = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0";
        break;
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["https://chat.google.com/*", "https://*.google.com/*"] },
  ["blocking", "requestHeaders"]
);

// --- NEW CONTEXT MENU CODE ---

// Create the context menu item
browser.menus.create({
  id: "share-to-google-chat",
  title: "Share to Google Chat",
  contexts: ["selection"] 
});

// Listen for clicks on the context menu
browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "share-to-google-chat") {
    
    // 1. Copy the selected text directly to the user's clipboard
    navigator.clipboard.writeText(info.selectionText).then(() => {
      
      // 2. Query for an existing Google Chat tab
      browser.tabs.query({ url: "*://chat.google.com/*" }).then((tabs) => {
        if (tabs.length > 0) {
          // If it exists, bring it to the foreground
          browser.tabs.update(tabs[0].id, { active: true });
        } else {
          // If it doesn't exist, open a new tab
          browser.tabs.create({ url: "https://chat.google.com/" });
        }
      }).catch((error) => {
        console.error("Error querying tabs: ", error);
      });

    }).catch(error => {
      console.error("Failed to copy text to clipboard:", error);
    });
  }
});
