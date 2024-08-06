chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "resolve") {
    console.log('received resolve')
    const allButtons = document.querySelectorAll(".repos-discussion-thread button");
    const resolveButtons = Array.from(allButtons).filter(btn => btn.textContent.trim() === 'Resolve');
    
    if (resolveButtons.length > 0) {
      resolveButtons.forEach(button => button.click());
      sendResponse({ 
        status: "success", 
        message: `${resolveButtons.length} comments resolved!`
      });
    } else {
      sendResponse({ 
        status: "success", 
        message: `no comments resolved!`
      });
    }
  }
});

// Listen for the notification message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showNotification") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: request.title,
      message: request.message
    });
  }
});