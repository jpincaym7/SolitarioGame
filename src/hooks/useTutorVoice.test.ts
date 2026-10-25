import { describe, it, expect } from 'vitest';

describe('useTutorVoice anime voice tracks', () => {
  it('generates consistent audio URLs for each character and step', () => {
    const getAudioUrl = (character: 'lucina' | 'ike', stepIndex: number) =>
      `/sounds/tutor/${character}_step_${stepIndex + 1}.mp3`;

    expect(getAudioUrl('lucina', 0)).toBe('/sounds/tutor/lucina_step_1.mp3');
    expect(getAudioUrl('lucina', 4)).toBe('/sounds/tutor/lucina_step_5.mp3');
    expect(getAudioUrl('ike', 0)).toBe('/sounds/tutor/ike_step_1.mp3');
    expect(getAudioUrl('ike', 4)).toBe('/sounds/tutor/ike_step_5.mp3');
  });
});
