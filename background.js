function executeSpeechRecognition(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: ["content.js"],
      },
      () => {
        chrome.tabs.sendMessage(tabs[0].id, { action });
      }
    );
  });
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "start_listening") {
    executeSpeechRecognition("toggleSpeechRecognition");
  } else if (command === "append_text") {
    executeSpeechRecognition("appendText");
  }
});

chrome.action.onClicked.addListener((tab) => {
  executeSpeechRecognition("toggleSpeechRecognition");
});