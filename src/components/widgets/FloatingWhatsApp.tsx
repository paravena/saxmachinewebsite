import React from 'react';
import { track } from '../../lib/analytics';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/56961448839"
      className="wa-float"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_click', { location: 'floating_button' })}
      aria-label="WhatsApp"
      title="Contactar por WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 2C8.3 2 2 8.3 2 16c0 2.7.8 5.2 2.1 7.4L2.8 30l6.8-1.3C11.6 29.5 13.8 30 16 30c7.7 0 14-6.3 14-14S23.7 2 16 2zm0 25.5c-2.1 0-4.1-.6-5.8-1.6l-.4-.2-4.3.8.8-4.2-.3-.4C4.9 20.1 4.4 18.1 4.4 16 4.4 9.6 9.6 4.4 16 4.4S27.6 9.6 27.6 16 22.4 27.5 16 27.5zm7-9.6c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.3 1.5-.2.3-.5.3-.9.1s-1.7-.6-3.2-2c-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2.1-.4 0-.6s-.9-2.2-1.2-3c-.3-.8-.7-.7-.9-.7h-.8c-.3 0-.7.1-1.1.5-.4.4-1.5 1.5-1.5 3.6s1.5 4.2 1.7 4.5c.2.3 3 4.6 7.3 6.4 1 .4 1.8.7 2.4.9 1 .3 2 .3 2.7.2.8-.1 2.3-1 2.7-1.9.3-.9.3-1.8.2-1.9-.1-.2-.4-.3-.8-.5z" />
      </svg>
    </a>
  );
};
