function registerResolveListener() {
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "resolve") {
      console.log('received resolve')
      const resolveButtons = findResolveButtons();
      
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
}

function findResolveButtons() {
  const allButtons = document.querySelectorAll(".repos-discussion-thread button");
  return Array.from(allButtons).filter(btn => btn.textContent.trim() === 'Resolve');
}

registerResolveListener();

chrome.runtime.sendMessage({action: "comment-count", commentCount: findResolveButtons().length});
