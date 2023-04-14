function executeSpeechRecognition(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.executeScript(tabs[0].id, { file: "content.js" }, () => {
      chrome.tabs.sendMessage(tabs[0].id, { action });
    });
  });
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "start_listening") {
    executeSpeechRecognition("toggleSpeechRecognition");
  } else if (command === "append_text") {
    executeSpeechRecognition("appendText");
  }
});

chrome.browserAction.onClicked.addListener((tab) => {
  executeSpeechRecognition("toggleSpeechRecognition");
});