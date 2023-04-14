function handleSpeechRecognition(result) {
  const text = result.results[0][0].transcript;
  const activeElement = document.activeElement;
  const tagName = activeElement.tagName.toLowerCase();

  if (tagName === "input" || tagName === "textarea" || (tagName === "div" && activeElement.hasAttribute("contenteditable") && activeElement.getAttribute("contenteditable") === "true")) {
    if (tagName === "input" || tagName === "textarea") {
      activeElement.value = text;

      // Trigger an input event to notify the page about the change
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
    } else {
      // Handle custom div elements with contenteditable attribute
      activeElement.textContent = text;

      // Trigger an input event for contenteditable div
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
    }
  } else {
    console.log("Not a valid input field");
  }
}

function startSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.addEventListener("result", handleSpeechRecognition);
    recognition.start();
  } else {
    console.log("Speech recognition not supported");
  }
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startSpeechRecognition") {
    startSpeechRecognition();
  }
});