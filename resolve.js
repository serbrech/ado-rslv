
document.addEventListener('DOMContentLoaded', onInit, false);

function onInit() {
  console.info('rslv popup init');

  const openPromise = chrome.runtime.sendMessage({action: "popup-open"})
  console.info('rslv popup init - popup-open message sent');

  openPromise.then((response) => {
    setMessage(response.message);
  }).catch((error) => {
    console.warn(error);
  });
}

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  if (request.action === "comment-count") {
    setMessage("found " + request.commentCount + " comments to resolve!");
  }
  return false;
});

document.getElementById('resolve-btn').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    console.info('resolve button clicked - tab:' + tabs[0]);
    const sendPromise = chrome.runtime.sendMessage({action: "resolve"})
    sendPromise.then((response) => {
      if (!response) {
        return;
      }
      if (response.status === "success") {
        setMessage(response.message);
      }
      if (response.status === "failure") {
        setMessage(response.message);
      }
    }).catch((error) => {
      console.error(`failed to send message: ${error}`);
    });
  });
});

function setMessage(message) {
  document.getElementById('notifications').textContent = message;
}