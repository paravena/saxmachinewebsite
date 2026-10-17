'use client';

import React, { useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AudioProvider } from './context/AudioContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { IntroVideoModal } from './components/widgets/IntroVideoModal';
import { FloatingMusicPlayer } from './components/widgets/FloatingMusicPlayer';
import { FloatingWhatsApp } from './components/widgets/FloatingWhatsApp';
import { HeroSection } from './components/sections/HeroSection';
import { SpecsSection } from './components/sections/SpecsSection';
import { AboutSection } from './components/sections/AboutSection';
import { BiosSection } from './components/sections/BiosSection';
import { RepertoireSection } from './components/sections/RepertoireSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { BookingSection } from './components/sections/BookingSection';
import { MediaGallerySection } from './components/sections/MediaGallerySection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { FaqSection } from './components/sections/FaqSection';
import { ContactSection } from './components/sections/ContactSection';
import { StructuredData } from './components/seo/StructuredData';
import { useScrollReveal } from './hooks/useScrollReveal';
import { initAnalytics } from './lib/analytics';

const MainContent: React.FC = () => {
  useScrollReveal();

  return (
    <>
      <StructuredData />
      <IntroVideoModal />
      <Navbar />
      <main>
        <HeroSection />
        <SpecsSection />
        <AboutSection />
        <BiosSection />
        <RepertoireSection />
        <ServicesSection />
        <BookingSection />
        <MediaGallerySection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingMusicPlayer />
      <FloatingWhatsApp />
    </>
  );
};

export const App: React.FC = () => {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <LanguageProvider>
      <AudioProvider>
        <MainContent />
      </AudioProvider>
    </LanguageProvider>
  );
};

export default App;
