let recognition;
let isListening = false;

function stopSpeechRecognition() {
  if (recognition) {
    setTimeout(() => {
      recognition.stop();
      isListening = false;
    }, 300);
  }
}

function toggleSpeechRecognition() {
  if (isListening) {
    stopSpeechRecognition();
  } else {
    startSpeechRecognition();
  }
}

function handleSpeechRecognition(result) {
  const text = result.results[0][0].transcript;
  const activeElement = document.activeElement;
  const tagName = activeElement.tagName.toLowerCase();

  if (tagName === "input" || tagName === "textarea" || (tagName === "div" && activeElement.hasAttribute("contenteditable") && activeElement.getAttribute("contenteditable") === "true")) {
    if (tagName === "input" || tagName === "textarea") {
      activeElement.value = text;

      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
    } else {
      activeElement.textContent = text;

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
    if (!recognition) {
      recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.addEventListener("result", handleSpeechRecognition);
      recognition.addEventListener("end", () => {
        isListening = false;
      });
      recognition.addEventListener("error", (event) => {
        console.error("Speech recognition error:", event.error);
        isListening = false;
      });
    }
    recognition.start();
    isListening = true;
  } else {
    console.log("Speech recognition not supported");
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleSpeechRecognition") {
    toggleSpeechRecognition();
  }
});