import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../common/SectionHeader';
import { Badge } from '../common/Badge';

export const RepertoireSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="rep" id="repertoire">
      <div className="wrap">
        <SectionHeader
          eyebrow={t('repertoire.eyebrow')}
          title={t('repertoire.title')}
          description={t('repertoire.lead')}
        />
        <div className="chips reveal">
          <Badge variant="chip">Jazz & Swing</Badge>
          <Badge variant="chip">Lounge / Chill</Badge>
          <Badge variant="chip">Bossa Nova</Badge>
          <Badge variant="chip">Pop & Soul</Badge>
          <Badge variant="chip">Latin / Salsa</Badge>
          <Badge variant="chip">{t('repertoire.chips.ballads')}</Badge>
          <Badge variant="chip">{t('repertoire.chips.movieClassics')}</Badge>
          <Badge variant="chip">{t('repertoire.chips.dance')}</Badge>
        </div>
      </div>
    </section>
  );
};
