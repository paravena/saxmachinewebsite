import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Logo } from '../common/Logo';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="hero" id="top">
      <div className="wrap hero-wrap">
        <div className="hero-inner">
          <Logo className="hero-logo" color="white" />
          <div className="eyebrow">{t('hero.eyebrow')}</div>
          <h1 className="serif">{t('hero.title')}</h1>
          <p className="lead">{t('hero.lead')}</p>
          <div className="badge-row">
            <Badge>{t('hero.badges.repertoire')}</Badge>
            <Badge>{t('hero.badges.bilingual')}</Badge>
            <Badge>{t('hero.badges.availability')}</Badge>
          </div>
          <div className="cta-row">
            <Button href="#contact" variant="gold">
              {t('hero.cta.primary')}
            </Button>
            <Button href="#media" variant="ghost">
              {t('hero.cta.secondary')}
            </Button>
          </div>
        </div>
      </div>
      <div className="hero-fade" aria-hidden="true" />
    </section>
  );
};
