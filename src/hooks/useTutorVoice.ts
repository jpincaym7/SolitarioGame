import { useState, useEffect, useRef, useCallback } from 'react';

export function useTutorVoice(soundEnabled: boolean = true) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Stop any currently playing audio track
  const stop = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  /**
   * Plays the authentic Spanish anime dubbing studio voice track for the character and step
   */
  const playAnimeVoice = useCallback(
    (character: 'lucina' | 'ike', stepIndex: number) => {
      if (!soundEnabled || !isVoiceEnabled) {
        stop();
        return;
      }

      // Stop previous track before loading new one
      stop();

      const stepNumber = stepIndex + 1;
      const audioUrl = `/sounds/tutor/${character}_step_${stepNumber}.mp3`;

      try {
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        audio.volume = 1.0;

        audio.onplay = () => {
          setIsSpeaking(true);
        };

        audio.onended = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Browser autoplay policy might require interaction
            setIsSpeaking(false);
          });
        }
      } catch {
        setIsSpeaking(false);
      }
    },
    [soundEnabled, isVoiceEnabled, stop]
  );

  return {
    playAnimeVoice,
    stop,
    isSpeaking,
    isVoiceEnabled,
    setIsVoiceEnabled,
  };
}
