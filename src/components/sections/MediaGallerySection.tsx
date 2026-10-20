import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundAudio } from '../../context/AudioContext';
import { SectionHeader } from '../common/SectionHeader';
import { track } from '../../lib/analytics';

interface GalleryTileProps {
  imageSrc: string;
  alt: string;
  label: string;
}

const GalleryTile: React.FC<GalleryTileProps> = ({ imageSrc, alt, label }) => {
  const [imgError, setImgError] = useState<boolean>(false);

  return (
    <div className="tile">
      {!imgError && <img src={imageSrc} alt={alt} onError={() => setImgError(true)} />}
      <div>
        <div className="ph-icon" aria-hidden="true">
          📷
        </div>
        <span>{label}</span>
      </div>
    </div>
  );
};

export const MediaGallerySection: React.FC = () => {
  const { t } = useLanguage();
  const { pauseForVideo, resumeFromVideo } = useBackgroundAudio();

  const handleVideoPlay = () => {
    track('video_play', { video: 'video_web.mp4' });
    pauseForVideo();
  };

  const tiles = [
    { src: '/images/show1.jpg', label: 'Show 1' },
    { src: '/images/show2.jpg', label: 'Show 2' },
    { src: '/images/show3.jpg', label: 'Show 3' },
    { src: '/images/show4.jpg', label: 'Show 4' },
    { src: '/images/show5.jpg', label: 'Show 5' },
    { src: '/images/show6.jpg', label: 'Show 6' },
  ];

  return (
    <section className="media" id="media">
      <div className="wrap">
        <SectionHeader
          eyebrow={t('gallery.eyebrow')}
          title={t('gallery.title')}
          description={t('gallery.lead')}
        />

        <div className="video-feature reveal">
          <video
            controls
            poster="/images/hero.jpg"
            preload="none"
            onPlay={handleVideoPlay}
            onPause={resumeFromVideo}
            onEnded={resumeFromVideo}
          >
            <source src="/images/video_web.mp4" type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
        </div>

        <div className="gal reveal">
          {tiles.map((tile, idx) => (
            <GalleryTile
              key={idx}
              imageSrc={tile.src}
              alt="Sax Machine en vivo"
              label={tile.label}
            />
          ))}
        </div>

        <div className="listen reveal">
          <a
            href="https://www.youtube.com/@saxmachinentertainment"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('outbound_click', { network: 'youtube' })}
          >
            <span>▶</span> <span>{t('gallery.youtubeCta')}</span>
          </a>
          <a
            href="https://www.instagram.com/saxmachine.chile"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('outbound_click', { network: 'instagram' })}
          >
            <span>📷</span> <span>Instagram @saxmachine.chile</span>
          </a>
        </div>
      </div>
    </section>
  );
};
