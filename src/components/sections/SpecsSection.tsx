import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { type SpecItemData } from '../../types/content';

const specsData: SpecItemData[] = [
  { id: '1', labelKey: 'specs.lineup.label', valueKey: 'specs.lineup.value' },
  { id: '2', labelKey: 'specs.category.label', valueKey: 'specs.category.value' },
  { id: '3', labelKey: 'specs.region.label', valueKey: 'specs.region.value' },
  { id: '4', labelKey: 'specs.material.label', valueKey: 'specs.material.value' },
  { id: '5', labelKey: 'specs.language.label', valueKey: 'specs.language.value' },
];

export const SpecsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="specs" id="ficha">
      <div className="wrap specs-grid">
        {specsData.map((spec) => (
          <div key={spec.id} className="spec">
            <div className="sl">{t(spec.labelKey)}</div>
            <div className="sv">{t(spec.valueKey)}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
