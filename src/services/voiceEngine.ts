import { RubyLanguage } from '../types/ruby';

// Web Speech API interface declarations
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

export class RubyVoiceEngine {
  private recognition: any = null;
  private isListening: boolean = false;
  private onTranscriptCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onStateChangeCallback: ((isListening: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {
          this.isListening = true;
          this.onStateChangeCallback?.(true);
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.onStateChangeCallback?.(false);
        };

        this.recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
          console.warn('[RUBY Voice] Speech Recognition Notice:', e.error);
          this.isListening = false;
          this.onStateChangeCallback?.(false);
        };

        this.recognition.onresults = (event: SpeechRecognitionEvent) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = 0; i < event.results.length; ++i) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }

          const currentText = finalTranscript || interimTranscript;
          if (currentText && this.onTranscriptCallback) {
            this.onTranscriptCallback(currentText, Boolean(finalTranscript));
          }
        };
      }
    }
  }

  public setCallbacks(
    onTranscript: (text: string, isFinal: boolean) => void,
    onStateChange: (listening: boolean) => void
  ) {
    this.onTranscriptCallback = onTranscript;
    this.onStateChangeCallback = onStateChange;
  }

  public startListening(lang: RubyLanguage = 'en') {
    if (!this.recognition) {
      console.warn('[RUBY Voice] Web Speech Recognition not available in this browser');
      this.onStateChangeCallback?.(true);
      return false;
    }

    try {
      this.recognition.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('[RUBY Voice] Start listening err:', err);
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('[RUBY Voice] Stop error:', err);
      }
    }
    this.isListening = false;
    this.onStateChangeCallback?.(false);
  }

  public speak(text: string, lang: RubyLanguage = 'en', onComplete?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onComplete?.();
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05; // Friendly, clear pitch

    const targetTag = lang === 'ta' ? 'ta' : lang === 'hi' ? 'hi' : 'en';
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(targetTag));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      onComplete?.();
    };
    utterance.onerror = () => {
      onComplete?.();
    };

    window.speechSynthesis.speak(utterance);
  }
  public async transcribeAudio(audioBlob: Blob): Promise<{ transcript: string; provider: string }> {
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          const base64 = res.split(',')[1] || '';
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);
      const audioData = await base64Promise;

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioData, mimeType: audioBlob.type || 'audio/webm' }),
      });
      if (!res.ok) throw new Error('Transcription API returned ' + res.status);
      return await res.json();
    } catch (err) {
      console.warn('[RUBY Voice] Server transcription fallback:', err);
      return { transcript: '', provider: 'local_fallback' };
    }
  }

  public async sendConversation(message: string, language: RubyLanguage = 'en', context?: any) {
    try {
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language, context }),
      });
      if (!res.ok) throw new Error('Conversation API returned ' + res.status);
      return await res.json();
    } catch (err) {
      console.warn('[RUBY Voice] Server conversation fallback:', err);
      return null;
    }
  }
}

export const voiceEngine = new RubyVoiceEngine();
