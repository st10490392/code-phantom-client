// CodePhantom Client - Voice Control
// Uses Web Speech API for speech-to-text and text-to-speech

const Voice = {
  recognition: null,
  synthesis: window.speechSynthesis,
  isListening: false,
  isSpeaking: false,

  init() {
    // Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      return false;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.updateUI();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.updateUI();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.handleVoiceInput(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      this.updateUI();
    };

    return true;
  },

  startListening() {
    if (!this.recognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    try {
      this.recognition.start();
    } catch (e) {
      console.error('Failed to start recognition:', e);
    }
  },

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  },

  speak(text) {
    if (!this.synthesis) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use a good voice
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Microsoft') ||
      v.name.includes('Samantha')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.updateUI();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateUI();
    };

    this.synthesis.speak(utterance);
  },

  handleVoiceInput(transcript) {
    console.log('Voice input:', transcript);
    
    // Show transcript in UI
    const statusEl = document.getElementById('voice-status');
    if (statusEl) {
      statusEl.textContent = `You said: "${transcript}"`;
    }

    // Process the command
    this.processCommand(transcript);
  },

  processCommand(transcript) {
    const lower = transcript.toLowerCase();
    
    // Navigation commands
    if (lower.includes('show signals') || lower.includes('open signals')) {
      showTab('signals');
      this.speak('Showing signals');
    } 
    else if (lower.includes('show ea') || lower.includes('open ea')) {
      showTab('ea');
      this.speak('Showing EA status');
    }
    else if (lower.includes('logout')) {
      logout();
      this.speak('Logged out');
    }
    else {
      // Default: treat as search/chat
      this.speak(`You said: ${transcript}. This feature is coming soon.`);
    }
  },

  updateUI() {
    const micBtn = document.getElementById('voice-btn');
    const statusEl = document.getElementById('voice-status');

    if (micBtn) {
      if (this.isListening) {
        micBtn.classList.add('listening');
        micBtn.textContent = '🎤 Listening...';
      } else if (this.isSpeaking) {
        micBtn.classList.add('speaking');
        micBtn.textContent = '🔊 Speaking...';
      } else {
        micBtn.classList.remove('listening', 'speaking');
        micBtn.textContent = '🎤 Tap to Talk';
      }
    }
  }
};

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Voice.init());
} else {
  Voice.init();
}

// Export for global access
window.Voice = Voice;
