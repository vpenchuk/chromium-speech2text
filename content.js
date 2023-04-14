let recognition;
let isListening = false;

function handleSpeechRecognition(result, callback) {
  const text = result.results[0][0].transcript;
  callback(text);
}

function createSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionInstance = new SpeechRecognition();
  recognitionInstance.lang = "en-US";
  recognitionInstance.interimResults = false;
  recognitionInstance.maxAlternatives = 1;
  recognitionInstance.addEventListener("end", () => {
    isListening = false;
  });
  recognitionInstance.addEventListener("error", (event) => {
    console.error("Speech recognition error:", event.error);
    isListening = false;
  });

  return recognitionInstance;
}

function startSpeechRecognition(callback) {
  if (!recognition) {
    recognition = createSpeechRecognition();
  }

  recognition.onresult = (event) => {
    handleSpeechRecognition(event, callback);
  };
  recognition.start();
  isListening = true;
}

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
    startSpeechRecognition((text) => {
      const activeElement = document.activeElement;
      activeElement.value = text;
      const event = new Event("input", { bubbles: true });
      activeElement.dispatchEvent(event);
    });
  }
}

function appendSpeechRecognition() {
  if (isListening) {
    stopSpeechRecognition();
  } else {
    startSpeechRecognition((text) => {
      const activeElement = document.activeElement;
      const cursorPosition = activeElement.selectionStart;
      const value = activeElement.value;
      activeElement.value = value.slice(0, cursorPosition) + text + value.slice(cursorPosition);

      const event = new Event("input", { bubbles: true });
      activeElement.dispatchEvent(event);
    });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleSpeechRecognition") {
    toggleSpeechRecognition();
  } else if (request.action === "appendText") {
    appendSpeechRecognition();
  }
});