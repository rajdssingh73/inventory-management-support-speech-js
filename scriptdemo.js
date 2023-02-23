const recognitionBtn = document.querySelector('#recognition-btn');
const transcription = document.querySelector('#transcription');

// Create a new SpeechRecognition object
const recognition = new webkitSpeechRecognition();

// Set the language
recognition.lang = 'en-US';

// Start recognition when the button is clicked
recognitionBtn.addEventListener('click', () => {
  recognition.start();
});

// Add event listeners for when speech is recognized
recognition.addEventListener('result', (event) => {
  const transcript = event.results[0][0].transcript;
  transcription.textContent = transcript;
});

recognition.addEventListener('end', () => {
  recognitionBtn.textContent = 'Start Listening';
});

recognition.addEventListener('start', () => {
  recognitionBtn.textContent = 'Listening...';
});
