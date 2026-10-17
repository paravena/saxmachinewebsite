import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../common/SectionHeader';
import { AccordionItem } from '../common/Accordion';
import { type FaqItemData } from '../../types/content';

export const faqEntries: FaqItemData[] = [
  { id: '1', questionKey: 'faq.sound.question', answerKey: 'faq.sound.answer' },
  { id: '2', questionKey: 'faq.requests.question', answerKey: 'faq.requests.answer' },
  { id: '3', questionKey: 'faq.duration.question', answerKey: 'faq.duration.answer' },
  { id: '4', questionKey: 'faq.travel.question', answerKey: 'faq.travel.answer' },
  { id: '5', questionKey: 'faq.styles.question', answerKey: 'faq.styles.answer' },
  { id: '6', questionKey: 'faq.booking.question', answerKey: 'faq.booking.answer' },
];

export const FaqSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <SectionHeader eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
        <div className="faq-list">
          {faqEntries.map((item) => (
            <AccordionItem
              key={item.id}
              question={t(item.questionKey)}
              answer={t(item.answerKey)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
