// --- SPACES TOOLBAR BUTTON ---

browser.spacesToolbar.addButton('GoogleChat', {
  title: browser.i18n.getMessage("toolbarButtonTitle"),
  defaultIcons: "skin/google_chat_icon.svg",
  url: "https://chat.google.com/"
});

// --- USER-AGENT SPOOFING ---

browser.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
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

// --- CONTEXT MENU CODE ---

browser.menus.create({
  id: "share-to-google-chat",
  title: browser.i18n.getMessage("contextMenuShareText"),
  contexts: ["selection"]
});

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "share-to-google-chat") {
    navigator.clipboard.writeText(info.selectionText).then(() => {
      browser.tabs.query({ url: "*://chat.google.com/*" }).then((tabs) => {
        if (tabs.length > 0) {
          browser.tabs.update(tabs[0].id, { active: true });
        } else {
          browser.tabs.create({ url: "https://chat.google.com/" });
        }
      }).catch((error) => {
        console.error("Error querying tabs: ", error);
      });
    }).catch((error) => {
      console.error("Failed to copy text to clipboard:", error);
    });
  }
});

// --- GOOGLE CHAT NOTIFICATION CODE (TITLE-BLINK DETECTION) ---
//
// Google Chat does not put an unread count in the page title. Instead it
// blinks the title between an idle state ("Chat") and an alert state
// ("<name> messaged you — Chat"). We detect the alert state, notify once
// per new alert, ignore the blinking, and reset once the title has been
// idle for a sustained period (meaning the messages have been read).

let activeAlertTitle = null;   // the alert text we last notified about
let clearTimer = null;         // timer to reset state once chat is "read"

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.title && tab.url && tab.url.includes("chat.google.com")) {
    const title = changeInfo.title;

    // An "alert" title is anything that isn't the plain idle title.
    const isAlert = /messaged you|mentioned you/i.test(title) ||
                    (title !== "Chat" && title.includes("Chat"));

    if (isAlert) {
      // We're in an unread state — cancel any pending reset.
      if (clearTimer) {
        clearTimeout(clearTimer);
        clearTimer = null;
      }

      // Only notify if this is a NEW alert, not the same blinking message.
      if (title !== activeAlertTitle) {
        activeAlertTitle = title;
        browser.notifications.create("google-chat-unread-alert", {
          type: "basic",
          iconUrl: "skin/google_chat_icon.png",
          title: "Google Chat",
          message: title.replace(/\s*[—-]\s*Chat$/, "") // e.g. "Luisa Ferralis messaged you"
        }).catch((error) => {
          console.error("Failed to create notification:", error);
        });
      }
    } else {
      // Idle "Chat" title. This may just be a blink gap, so don't reset
      // immediately — wait. If it stays idle, treat messages as read.
      if (!clearTimer) {
        clearTimer = setTimeout(() => {
          activeAlertTitle = null;
          clearTimer = null;
        }, 8000); // 8s of steady "Chat" = read
      }
    }
  }
});

// Focus the Google Chat tab when the notification is clicked
browser.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === "google-chat-unread-alert") {
    browser.tabs.query({ url: "*://chat.google.com/*" }).then((tabs) => {
      if (tabs.length > 0) {
        browser.tabs.update(tabs[0].id, { active: true });
      }
    }).catch((error) => {
      console.error("Error focusing Google Chat tab via notification click: ", error);
    });
  }
});
