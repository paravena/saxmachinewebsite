import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { type TestimonialData } from '../../types/content';

const testimonialsData: TestimonialData[] = [
  { id: '1', quoteKey: 'testimonials.producer.quote', authorKey: 'testimonials.producer.author' },
  {
    id: '2',
    quoteKey: 'testimonials.cruiseDirector.quote',
    authorKey: 'testimonials.cruiseDirector.author',
  },
  {
    id: '3',
    quoteKey: 'testimonials.privateEvent.quote',
    authorKey: 'testimonials.privateEvent.author',
  },
];

export const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="testi" id="testimonios">
      <div className="wrap">
        <SectionHeader
          eyebrow={t('testimonials.eyebrow')}
          title={t('testimonials.title')}
          description={t('testimonials.lead')}
        />
        <div className="testi-grid">
          {testimonialsData.map((item) => (
            <Card key={item.id} variant="quote" className="reveal">
              <span className="qm">“</span>
              <p>{t(item.quoteKey)}</p>
              <div className="who">{t(item.authorKey)}</div>
            </Card>
          ))}
        </div>
        <div className="trust reveal">
          <div className="tl">Experiencia & Confianza</div>
          <div className="trust-row">
            <span>Cruceros internacionales</span>
            <span>Festivales de Jazz</span>
            <span>Hotelería de lujo</span>
            <span>Eventos corporativos</span>
            <span>Bodas exclusivas</span>
          </div>
        </div>
      </div>
    </section>
  );
};
