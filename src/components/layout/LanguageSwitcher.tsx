import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { track } from '../../lib/analytics';
import { type Language } from '../../types/translations';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleSwitch = (lang: Language) => {
    if (lang !== language) {
      track('language_switch', { from: language, to: lang });
    }
    setLanguage(lang);
  };

  return (
    <div className="lang">
      <button
        type="button"
        data-lang="en"
        className={language === 'en' ? 'active' : ''}
        onClick={() => handleSwitch('en')}
      >
        EN
      </button>
      <button
        type="button"
        data-lang="es"
        className={language === 'es' ? 'active' : ''}
        onClick={() => handleSwitch('es')}
      >
        ES
      </button>
    </div>
  );
};
