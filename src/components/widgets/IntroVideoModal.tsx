import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const IntroVideoModal: React.FC = () => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState<boolean>(true);
  const [isHiding, setIsHiding] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const doneRef = useRef<boolean>(false);

  const handleEnd = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setIsHiding(true);
    document.body.classList.remove('intro-on');
    try {
      sessionStorage.setItem('sm_intro', '1');
    } catch {
      // Ignore sessionStorage errors
    }
    setTimeout(() => {
      setVisible(false);
    }, 800);
  };

  useEffect(() => {
    if (!visible) return;

    try {
      if (sessionStorage.getItem('sm_intro') === '1') {
        doneRef.current = true;
        setVisible(false);
        return;
      }
    } catch {
      // Ignore sessionStorage errors
    }

    document.body.classList.add('intro-on');

    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => handleEnd());
      }
    }

    const failsafe = setTimeout(handleEnd, 22000);

    return () => {
      clearTimeout(failsafe);
      document.body.classList.remove('intro-on');
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div id="intro" className={isHiding ? 'hide' : ''}>
      <video
        ref={videoRef}
        id="introVid"
        src="/images/intro.mp4"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={handleEnd}
      />
      <button type="button" className="skip" id="introSkip" onClick={handleEnd}>
        {t('intro.skip')}
      </button>
    </div>
  );
};
