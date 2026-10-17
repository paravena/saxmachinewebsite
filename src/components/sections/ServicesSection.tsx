import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { type ServiceItemData } from '../../types/content';

const servicesData: ServiceItemData[] = [
  {
    id: '1',
    icon: '🛳️',
    titleKey: 'services.onboard.title',
    descKey: 'services.onboard.desc',
  },
  {
    id: '2',
    icon: '🥂',
    titleKey: 'services.privateEvents.title',
    descKey: 'services.privateEvents.desc',
  },
  {
    id: '3',
    icon: '🎷',
    titleKey: 'services.customAmbiance.title',
    descKey: 'services.customAmbiance.desc',
  },
];

export const ServicesSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="serv" id="services">
      <div className="wrap">
        <SectionHeader
          eyebrow={t('services.eyebrow')}
          title={t('services.title')}
          description={t('services.lead')}
        />
        <div className="cards">
          {servicesData.map((service) => (
            <Card key={service.id} variant="dark" className="reveal">
              <div className="ic" aria-hidden="true">
                {service.icon}
              </div>
              <h3>{t(service.titleKey)}</h3>
              <p>{t(service.descKey)}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
