/* eslint-disable no-undef */
//  chrome will be defined in the context of the extension background script so we can ignore this eslint error

(function () {
  const resumeKey = 'resume';
  // this is the background script, persisted across domains and runs on demand via messaging
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'SAVE_RESUME_ACTION') {
      chrome.storage.local.set({ [resumeKey]: request.data }).then(() => {
        // console.log("Value is set", request.data);
        sendResponse("value set")
      });
    } else if (request.action === 'GET_RESUME_ACTION') {
      chrome.storage.local.get([resumeKey]).then((result) => {
        // console.log('result', result)
        sendResponse(result[resumeKey]);
      })
    } else if (request.action === 'DELETE_RESUME_ACTION') {
      chrome.storage.local.remove([resumeKey]).then((result) => {
        // console.log('result', result)
        sendResponse(result);
      })
    }
    return true;  // To indicate you will use sendResponse asynchronously
  });
})()