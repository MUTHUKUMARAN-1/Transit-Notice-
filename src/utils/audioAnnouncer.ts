/**
 * Web Audio API synthesizer for transit station chimes and audio advisories.
 * Recreates authentic public transport multi-tone chimes.
 */
class TransitAudioAnnouncer {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Plays the iconic transit two-tone / four-tone advisory chime
   */
  public async playChime(): Promise<void> {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Authentic chime frequencies: F4, A4, C5, F5
      const notes = [
        { freq: 349.23, time: 0, duration: 0.28 }, // F4
        { freq: 440.00, time: 0.24, duration: 0.28 }, // A4
        { freq: 523.25, time: 0.48, duration: 0.32 }, // C5
        { freq: 698.46, time: 0.76, duration: 0.65 }  // F5
      ];

      notes.forEach(({ freq, time, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        // Gentle envelope: quick attack, smooth exponential decay
        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.exponentialRampToValueAtTime(0.25, now + time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + duration);
      });

      return new Promise((resolve) => setTimeout(resolve, 1400));
    } catch {
      // AudioContext might be blocked until user interaction
      console.warn('AudioContext playback restricted before user interaction');
    }
  }

  /**
   * Plays chime followed by synthesized voice announcement
   */
  public async announceNotice(text: string): Promise<void> {
    await this.playChime();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92; // Slightly measured transit announcement pace
      utterance.pitch = 1.0;
      
      // Try to select an English clear voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha')))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  }

  public stop(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioAnnouncer = new TransitAudioAnnouncer();
