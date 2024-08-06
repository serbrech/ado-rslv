chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "resolve") {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "resolve"}, (response) => {
          if (response && response.status === "success") {
            sendResponse({status: "success", message: response.message});
          } else {
            sendResponse({status: "failure", message: "error"});
          }
        });
      });
      return true; // Keep the message channel open for sendResponse
    }
  });