chrome.tabs.onUpdated.addListener(async function (tid, changeInfo, _tab) {
  if (changeInfo.status !== 'complete') {
    return;
  }
  console.info('tab updated - starting rslv listener');
  await startListener(tid);
});

async function startListener(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: {tabId: tabId},
      files: ['content.js']
    });
    console.info('rslv content script executed');
    return true;
  } catch (error) {
    console.warn(`failed to inject content script: ${error}`);
    return false;
  }
}

function registerResolveListeners(){
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "resolve") {
      handleResolve(sendResponse, request);
    }
    if(request.action === "popup-open") {
      handlePopupOpen(sendResponse);
    }
    if(request.action === "popup-open") {
      handlePopupOpen(sendResponse);
    }
    return true; // Keep the message channel open for sendResponse
  });
}

registerResolveListeners();

function handleResolve(sendResponse, request) {
  console.info('resolve action received');
  console.info('sending resolve action to content script on active tab');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      sendResponse({ status: "failure", message: "no active tab" });
      return;
    }
    const tab = tabs[0];
    console.info('sending resolve action to tab:' + tab);
    chrome.tabs.sendMessage(tab.id, request, (response) => {
      if (response && response.status === "success") {
        sendResponse(response);
      } else {
        sendResponse({ status: "failure", message: "error" });
      }
    });
  });
}

function handlePopupOpen(sendResponse) {
  console.info('popup-open action received');
  console.info('initializing rslv listener on active tab');
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (!tabs || tabs.length === 0) {
      sendResponse({ status: "failure", message: "no active tab found" });
      return;
    }
    const tab = tabs[0];
    console.info('sending popup-open action to tab:' + tab);
    const startedOk = await startListener(tab.id);
    console.log('startedOk: ' + startedOk);
    if(startedOk) {
      sendResponse({ status: "success", message: "rslv listener initialized" });
    } else {
      sendResponse({ status: "failure", message: "failed to initialize page listener" });
    }
  });
}

