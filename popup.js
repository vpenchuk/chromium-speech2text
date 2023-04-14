document.getElementById("startButton").addEventListener("click", (event) => {
  event.preventDefault(); // Prevent losing focus on the input field
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleSpeechRecognition" });
  });
  window.close(); // Close the popup after starting the speech recognition
});