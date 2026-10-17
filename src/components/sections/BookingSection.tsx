import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../common/SectionHeader';
import { Button } from '../common/Button';
import { type BookingFormatData, type BookingStepData } from '../../types/content';

const formatsData: BookingFormatData[] = [
  {
    id: '1',
    icon: '🍸',
    titleKey: 'booking.formats.cocktail.title',
    descKey: 'booking.formats.cocktail.desc',
  },
  {
    id: '2',
    icon: '🎭',
    titleKey: 'booking.formats.mainStage.title',
    descKey: 'booking.formats.mainStage.desc',
  },
  {
    id: '3',
    icon: '🎉',
    titleKey: 'booking.formats.party.title',
    descKey: 'booking.formats.party.desc',
  },
  {
    id: '4',
    icon: '💍',
    titleKey: 'booking.formats.ceremony.title',
    descKey: 'booking.formats.ceremony.desc',
  },
];

const stepsData: BookingStepData[] = [
  { step: 1, titleKey: 'booking.steps.inquiry.title', descKey: 'booking.steps.inquiry.desc' },
  { step: 2, titleKey: 'booking.steps.proposal.title', descKey: 'booking.steps.proposal.desc' },
  {
    step: 3,
    titleKey: 'booking.steps.confirmation.title',
    descKey: 'booking.steps.confirmation.desc',
  },
];

export const BookingSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="booking" id="reservar">
      <div className="wrap">
        <SectionHeader
          eyebrow={t('booking.eyebrow')}
          title={t('booking.title')}
          description={t('booking.lead')}
        />
        <div className="book-grid">
          <div className="reveal">
            <div className="sub-h">{t('booking.formats.heading')}</div>
            <div className="formats">
              {formatsData.map((fmt) => (
                <div key={fmt.id} className="format">
                  <div className="fi" aria-hidden="true">
                    {fmt.icon}
                  </div>
                  <div>
                    <h4>{t(fmt.titleKey)}</h4>
                    <p>{t(fmt.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '.82rem', color: '#7a8699', marginTop: '14px' }}>
              {t('booking.formats.duration')}
            </p>
          </div>

          <div className="reveal">
            <div className="sub-h">{t('booking.steps.heading')}</div>
            <div className="steps">
              {stepsData.map((st) => (
                <div key={st.step} className="step">
                  <div className="num">{st.step}</div>
                  <div>
                    <h4>{t(st.titleKey)}</h4>
                    <p>{t(st.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '28px' }}>
              <Button href="#contact" variant="gold">
                {t('booking.cta')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
