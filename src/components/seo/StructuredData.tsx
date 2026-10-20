import { type FC, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SITE_URL, absoluteUrl } from '../../lib/site';
import { faqEntries } from '../sections/FaqSection';

const SCRIPT_ID = 'sax-machine-structured-data';

/**
 * Injects JSON-LD structured data (MusicGroup + FAQPage) into <head>.
 * Re-rendered on language change so the FAQ rich snippet matches the page copy.
 */
export const StructuredData: FC = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    const musicGroup = {
      '@context': 'https://schema.org',
      '@type': 'MusicGroup',
      '@id': `${SITE_URL}/#musicgroup`,
      name: 'Sax Machine',
      alternateName: 'Sax Machine Chile',
      url: `${SITE_URL}/`,
      image: absoluteUrl('/images/hero.jpg'),
      logo: absoluteUrl('/favicon-512.png'),
      description: t('hero.lead'),
      genre: ['Jazz', 'Lounge', 'Bossa Nova', 'Pop', 'Latin'],
      email: 'saxmachinee@gmail.com',
      telephone: '+56961448839',
      areaServed: 'Worldwide',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CL',
      },
      member: [
        { '@type': 'Person', name: 'Jonathan Gatica', image: absoluteUrl('/images/jonathan.jpeg') },
        { '@type': 'Person', name: 'Felipe Vidal', image: absoluteUrl('/images/felipe.jpeg') },
      ],
      sameAs: [
        'https://www.instagram.com/saxmachine.chile',
        'https://www.youtube.com/@SaxMachineChile',
      ],
    };

    const faqPage = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      inLanguage: language,
      mainEntity: faqEntries.map((item) => ({
        '@type': 'Question',
        name: t(item.questionKey),
        acceptedAnswer: { '@type': 'Answer', text: t(item.answerKey) },
      })),
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify([musicGroup, faqPage]);
  }, [language, t]);

  return null;
};
