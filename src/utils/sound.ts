// High-performance Web Audio API Sound and Music Synthesis Engine
// Generates responsive interactive sound effects and a beautiful, slow-moving generative ambient score.

let audioCtx: AudioContext | null = null;
let ambientInterval: number | null = null;
let isMusicPlaying = false;
let ambientGainNode: GainNode | null = null;

// Initialize AudioContext lazily on user interaction
export const getAudioContext = (): AudioContext => {
  if (audioCtx) return audioCtx;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  audioCtx = new AudioContextClass();
  return audioCtx;
};

// Safe wrapper to resume context if suspended
const resumeContext = async () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
};

/**
 * Play a light, crisp haptic-style button hover tick
 */
export const playHover = async () => {
  try {
    await resumeContext();
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.03);

    // Ultra low volume transient tick for delicate hover feedback
    gainNode.gain.setValueAtTime(0.005, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (err) {
    // Fail silently if browser blocks audio
  }
};

/**
 * Play a solid, responsive, satisfying pluck sound on button clicks
 */
export const playClick = async () => {
  try {
    await resumeContext();
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {
    // Fail silently
  }
};

/**
 * Play an upward arpeggio on opening folders or modals
 */
export const playFolderOpen = async () => {
  try {
    await resumeContext();
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [329.63, 392.00, 523.25]; // E4, G4, C5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      
      gainNode.gain.setValueAtTime(0.04, now + idx * 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.2);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.25);
    });
  } catch (err) {
    // Fail silently
  }
};

/**
 * Play a downward arpeggio on closing folders or modals
 */
export const playFolderClose = async () => {
  try {
    await resumeContext();
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 392.00, 329.63]; // C5, G4, E4

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      
      gainNode.gain.setValueAtTime(0.03, now + idx * 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.18);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.22);
    });
  } catch (err) {
    // Fail silently
  }
};

/**
 * Play a sparkling, premium C-Major arpeggio sweep on form submission success
 */
export const playSuccessChime = async () => {
  try {
    await resumeContext();
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50), E6 (1318.51)
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      // Slow fade out to sound majestic and chime-like
      gainNode.gain.setValueAtTime(0.06, now + idx * 0.07);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.45);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.5);
    });
  } catch (err) {
    // Fail silently
  }
};

/**
 * Procedural Synthesized Ambient Background Music
 * Synthesizes peaceful, slow pentatonic chord loops dynamically
 */
const playPentatonicDrone = () => {
  if (!audioCtx || !isMusicPlaying || !ambientGainNode) return;
  const now = audioCtx.currentTime;

  // Pentatonic warm frequencies (E3, G3, A3, B3, D4, E4, G4, A4, B4, D5)
  const pentatonicScale = [164.81, 196.00, 220.00, 246.94, 293.66, 329.63, 392.00, 440.00, 493.88, 587.33];
  
  // Choose 2 or 3 random harmonious notes from the scale
  const selectNotesCount = Math.floor(Math.random() * 2) + 2; // 2 to 3 notes
  const activeScale = [...pentatonicScale];
  const notesToPlay: number[] = [];

  for (let i = 0; i < selectNotesCount; i++) {
    const randomIndex = Math.floor(Math.random() * activeScale.length);
    notesToPlay.push(activeScale[randomIndex]);
    activeScale.splice(randomIndex, 1); // Avoid duplicates
  }

  // Play each note with very slow, soothing attack and decay
  notesToPlay.forEach((freq) => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm, ambient swelling envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.015, now + 2.5); // Warm slow fade-in
    gain.gain.setValueAtTime(0.015, now + 4.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 7.5); // Very long decay

    osc.connect(gain);
    gain.connect(ambientGainNode!);

    osc.start(now);
    osc.stop(now + 8.0);
  });
};

/**
 * Toggle the generative ambient portfolio background score
 */
export const toggleAmbientMusic = async (volume: number = 0.5): Promise<boolean> => {
  const ctx = getAudioContext();
  await resumeContext();

  if (isMusicPlaying) {
    // Stop ambient loop
    isMusicPlaying = false;
    if (ambientInterval) {
      clearInterval(ambientInterval);
      ambientInterval = null;
    }
    if (ambientGainNode) {
      ambientGainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
    }
    return false;
  } else {
    // Start ambient music
    isMusicPlaying = true;
    
    // Create master music gain if it doesn't exist
    if (!ambientGainNode) {
      ambientGainNode = ctx.createGain();
      ambientGainNode.connect(ctx.destination);
    }
    
    ambientGainNode.gain.setValueAtTime(0, ctx.currentTime);
    ambientGainNode.gain.linearRampToValueAtTime(volume * 0.1, ctx.currentTime + 1.0); // Safe volume ceiling

    // Run first wave of atmospheric sounds immediately
    playPentatonicDrone();

    // Schedule subsequent ambient drones every 5.5 seconds (staggered overlap)
    ambientInterval = window.setInterval(() => {
      playPentatonicDrone();
    }, 5500);

    return true;
  }
};

/**
 * Dynamic music volume control
 */
export const setAmbientVolume = (volume: number) => {
  if (audioCtx && ambientGainNode && isMusicPlaying) {
    ambientGainNode.gain.linearRampToValueAtTime(volume * 0.1, audioCtx.currentTime + 0.3);
  }
};

/**
 * Check if the ambient music is currently active
 */
export const getIsMusicPlaying = () => {
  return isMusicPlaying;
};
