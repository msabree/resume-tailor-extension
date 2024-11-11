// this is the background script, persisted across domains and runs on demand via messaging
window.chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'saveData') {
      window.storage.local.set({ userPreference: request.data });
    } else if (request.action === 'getData') {
      window.storage.local.get('userPreference', function(result) {
        sendResponse(result);
      });
    }
    return true;  // To indicate you will use sendResponse asynchronously
});