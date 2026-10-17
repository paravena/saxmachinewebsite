import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();
  const [photoError, setPhotoError] = useState<boolean>(false);

  return (
    <section className="about" id="about">
      <div className="wrap about-grid">
        <div className="reveal">
          <div className="eyebrow">{t('about.eyebrow')}</div>
          <h2>{t('about.title')}</h2>
          <p>{t('about.paragraph1')}</p>
          <p>{t('about.paragraph2')}</p>
          <div className="stats">
            <div className="stat">
              <div className="n">{t('about.stats.years.number')}</div>
              <div className="l">{t('about.stats.years.label')}</div>
            </div>
            <div className="stat">
              <div className="n">{t('about.stats.saxophonists.number')}</div>
              <div className="l">{t('about.stats.saxophonists.label')}</div>
            </div>
            <div className="stat">
              <div className="n">{t('about.stats.tailored.number')}</div>
              <div className="l">{t('about.stats.tailored.label')}</div>
            </div>
          </div>
        </div>
        <div className="reveal">
          <div className="photo-ph">
            {!photoError && (
              <img
                src="/images/duo.jpg"
                alt="Sax Machine — Jonathan Gatica y Felipe Vidal"
                onError={() => setPhotoError(true)}
              />
            )}
            <div>
              <div className="ph-icon" aria-hidden="true">
                📷
              </div>
              <span>{t('about.photoCaption')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
