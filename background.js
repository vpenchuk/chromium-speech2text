chrome.commands.onCommand.addListener((command) => {
  if (command === "start_listening") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.executeScript(tabs[0].id, { file: "content.js" }, () => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleSpeechRecognition" });
      });
    });
  }
});

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.executeScript(tab.id, { file: "content.js" }, () => {
    chrome.tabs.sendMessage(tab.id, { action: "toggleSpeechRecognition" });
  });
});