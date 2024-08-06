document.getElementById('resolve-btn').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "resolve"}, (response) => {
      if (!response) {
        return;
      }
      if (response.status === "success") {
        document.getElementById('notifications').textContent = response.message;
      }
    });
  });
});