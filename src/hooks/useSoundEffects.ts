import { useCallback, useEffect, useRef } from 'react';

export function useSoundEffects(soundEnabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Pre-load authentic recorded card audio samples asynchronously
  useEffect(() => {
    const soundUrls: Record<string, string> = {
      'card-place': '/sounds/card-place.ogg',
      'card-place-alt': '/sounds/card-place-alt.ogg',
      'card-slide': '/sounds/card-slide.ogg',
      'card-deal': '/sounds/card-deal.ogg',
      'card-fan': '/sounds/card-fan.ogg',
      'card-flip': '/sounds/card-flip.ogg',
      'card-foundation': '/sounds/card-foundation.ogg',
      'victory': '/sounds/victory.ogg',
    };

    const loadSounds = async () => {
      const ctx = getAudioContext();
      if (!ctx) return;

      for (const [key, url] of Object.entries(soundUrls)) {
        try {
          const res = await fetch(url);
          const arrayBuffer = await res.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          soundBuffersRef.current.set(key, audioBuffer);
        } catch {
          // Fallback to procedural synthesis if offline
        }
      }
    };

    loadSounds();
  }, [getAudioContext]);

  // Helper to play loaded AudioBuffer with organic micro-variations
  const playBuffer = useCallback(
    (
      key: string,
      options?: {
        volume?: number;
        delaySeconds?: number;
        playbackRate?: number;
      }
    ) => {
      if (!soundEnabled) return false;
      const ctx = getAudioContext();
      if (!ctx) return false;

      const buffer = soundBuffersRef.current.get(key);
      if (!buffer) return false;

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gainNode = ctx.createGain();
      const volume = options?.volume ?? 0.85;
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);

      // Subtle organic pitch variation (+/- 4%) so repetitive placements feel natural
      const randomPitchOffset = (Math.random() - 0.5) * 0.08;
      source.playbackRate.value = (options?.playbackRate ?? 1.0) + randomPitchOffset;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      const startTime = ctx.currentTime + (options?.delaySeconds ?? 0);
      source.start(startTime);
      return true;
    },
    [soundEnabled, getAudioContext]
  );

  // 1. Natural card placement sound (single or stack of N cards)
  const playCardPlace = useCallback(
    (count = 1, isFoundation = false) => {
      if (!soundEnabled) return;

      // When placing onto a Foundation
      if (isFoundation) {
        const played = playBuffer('card-foundation', { volume: 0.95 });
        playBuffer('card-place', { volume: 0.6, delaySeconds: 0.015 });
        if (played) return;
      }

      // When moving a stack of N cards together (card fan / flutter settle)
      if (count > 1) {
        const playedFan = playBuffer('card-fan', { volume: 0.9, playbackRate: 1.05 });
        playBuffer('card-place', { volume: 0.75, delaySeconds: 0.035 });
        if (playedFan) return;
      }

      // Single card placement: randomly alternate between place samples for organic variety
      const placeSample = Math.random() > 0.5 ? 'card-place' : 'card-place-alt';
      const played = playBuffer(placeSample, { volume: 0.9 });
      if (played) return;

      // Procedural fallback if audio files are still loading
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        const snapOsc = ctx.createOscillator();
        const snapGain = ctx.createGain();
        snapOsc.type = 'sine';
        snapOsc.frequency.setValueAtTime(1350, now);
        snapOsc.frequency.exponentialRampToValueAtTime(320, now + 0.022);
        snapGain.gain.setValueAtTime(0.3, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);
        snapOsc.connect(snapGain);
        snapGain.connect(ctx.destination);
        snapOsc.start(now);
        snapOsc.stop(now + 0.022);
      } catch {
        // Fallback
      }
    },
    [soundEnabled, playBuffer, getAudioContext]
  );

  // 2. Natural card flip / reveal sound
  const playCardFlip = useCallback(() => {
    if (!soundEnabled) return;

    const played = playBuffer('card-flip', { volume: 0.85 });
    if (played) return;

    // Fallback
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Fallback
    }
  }, [soundEnabled, playBuffer, getAudioContext]);

  // 3. Natural card deal from deck
  const playDeal = useCallback(() => {
    if (!soundEnabled) return;

    const played = playBuffer('card-deal', { volume: 0.85 });
    if (played) return;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Fallback
    }
  }, [soundEnabled, playBuffer, getAudioContext]);

  // Fast, authentic Klondike dealing audio sequence (28 cards cascade)
  const playDealSequence = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // Start with deck riffle / swoosh
    playBuffer('card-fan', { volume: 0.65 });

    // Staggered deal ticks simulating 28 cards dealt in rapid rhythm
    const totalCards = 28;
    for (let i = 0; i < totalCards; i++) {
      const delay = i * 0.026 + 0.04;
      const pitch = 0.94 + (i / totalCards) * 0.16;
      playBuffer('card-deal', {
        volume: 0.35 + (i === totalCards - 1 ? 0.35 : 0),
        delaySeconds: delay,
        playbackRate: pitch,
      });
    }
  }, [soundEnabled, getAudioContext, playBuffer]);

  // 4. Invalid move click
  const playInvalid = useCallback(() => {
    if (!soundEnabled) return;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.setValueAtTime(105, now + 0.06);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Fallback
    }
  }, [soundEnabled, getAudioContext]);

  // 5. Victory celebration fanfare
  const playVictory = useCallback(() => {
    if (!soundEnabled) return;

    const played = playBuffer('victory', { volume: 0.9 });
    if (played) return;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, index) => {
        const noteTime = now + index * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.4);
      });
    } catch {
      // Fallback
    }
  }, [soundEnabled, playBuffer, getAudioContext]);

  return {
    playCardFlip,
    playCardPlace,
    playDeal,
    playDealSequence,
    playInvalid,
    playVictory,
  };
}
