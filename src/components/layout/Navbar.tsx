import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from '../common/Logo';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <div className="wrap nav">
        <a href="#top" className="brand" onClick={closeMenu}>
          <Logo color="white" />
          <span>
            SAX <span className="gold">MACHINE</span>
          </span>
        </a>

        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="#about" onClick={closeMenu}>
            {t('nav.about')}
          </a>
          <a href="#trayectoria" onClick={closeMenu}>
            {t('nav.background')}
          </a>
          <a href="#repertoire" onClick={closeMenu}>
            {t('nav.repertoire')}
          </a>
          <a href="#services" onClick={closeMenu}>
            {t('nav.services')}
          </a>
          <a href="#reservar" onClick={closeMenu}>
            {t('nav.booking')}
          </a>
          <a href="#faq" onClick={closeMenu}>
            {t('nav.faq')}
          </a>
          <a href="#contact" onClick={closeMenu}>
            {t('nav.contact')}
          </a>
          <LanguageSwitcher />
        </nav>

        <button
          className="burger"
          type="button"
          aria-label="Menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};
