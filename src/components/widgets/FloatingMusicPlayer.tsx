import React from 'react';
import { useBackgroundAudio } from '../../context/AudioContext';

export const FloatingMusicPlayer: React.FC = () => {
  const { isPlaying, togglePlay } = useBackgroundAudio();

  return (
    <button
      type="button"
      className={`music-float ${!isPlaying ? 'off' : ''}`.trim()}
      id="bgmBtn"
      aria-label="Música de fondo"
      title="Activar / desactivar música de fondo"
      onClick={(e) => {
        e.stopPropagation();
        togglePlay();
      }}
    >
      ♪
    </button>
  );
};
