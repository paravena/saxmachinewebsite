import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

interface AudioContextValue {
  isPlaying: boolean;
  togglePlay: () => void;
  pauseForVideo: () => void;
  resumeFromVideo: () => void;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const userWantedRef = useRef<boolean>(true);
  const startedRef = useRef<boolean>(false);

  useEffect(() => {
    const audio = new Audio('/images/musica.mp3');
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    const unlockAudio = () => {
      if (userWantedRef.current && !startedRef.current && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            startedRef.current = true;
          })
          .catch(() => {});
      }
    };

    const events = ['click', 'touchstart', 'keydown'];
    events.forEach((ev) => window.addEventListener(ev, unlockAudio, { passive: true }));

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, unlockAudio));
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      userWantedRef.current = true;
      audioRef.current
        .play()
        .then(() => {
          startedRef.current = true;
        })
        .catch(() => {});
    } else {
      userWantedRef.current = false;
      audioRef.current.pause();
    }
  }, []);

  const pauseForVideo = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  const resumeFromVideo = useCallback(() => {
    if (userWantedRef.current && audioRef.current && audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => {
          startedRef.current = true;
        })
        .catch(() => {});
    }
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay, pauseForVideo, resumeFromVideo }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useBackgroundAudio = (): AudioContextValue => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useBackgroundAudio must be used within an AudioProvider');
  }
  return context;
};
