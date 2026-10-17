import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../common/SectionHeader';
import { Button } from '../common/Button';
import { type ContactFormData } from '../../types/content';
import { track } from '../../lib/analytics';

const BOOKING_EMAIL = 'saxmachinee@gmail.com';

export const ContactSection: React.FC = () => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    serviceType: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim();
    const type = formData.serviceType || t('contact.form.options.onboard');
    const msg = formData.message.trim();

    const subject =
      (isEn ? 'Booking inquiry · Sax Machine — ' : 'Consulta de booking · Sax Machine — ') +
      (name || (isEn ? 'no name' : 'sin nombre'));

    const body = isEn
      ? `Name / Company: ${name}\nEmail: ${email}\nService type: ${type}\n\nMessage:\n${msg}\n`
      : `Nombre / Empresa: ${name}\nEmail: ${email}\nTipo de servicio: ${type}\n\nMensaje:\n${msg}\n`;

    track('contact_form_submit', { service_type: type, language });

    window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <SectionHeader
          eyebrow={t('contact.eyebrow')}
          title={t('contact.title')}
          description={t('contact.lead')}
        />
        <div className="contact-grid">
          <div className="contact-info reveal">
            <p>{t('contact.location')}</p>
            <ul className="contact-list">
              <li>
                <div className="ic" aria-hidden="true">
                  ✉️
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '.78rem',
                      color: '#7a8699',
                      textTransform: 'uppercase',
                      letterSpacing: '.08em',
                    }}
                  >
                    Email
                  </div>
                  <a href={`mailto:${BOOKING_EMAIL}`}>{BOOKING_EMAIL}</a>
                </div>
              </li>
              <li>
                <div className="ic" aria-hidden="true">
                  💬
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '.78rem',
                      color: '#7a8699',
                      textTransform: 'uppercase',
                      letterSpacing: '.08em',
                    }}
                  >
                    WhatsApp
                  </div>
                  <a
                    href="https://wa.me/56961448839"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('whatsapp_click', { location: 'contact_section' })}
                  >
                    +56 9 6144 8839
                  </a>
                </div>
              </li>
              <li>
                <div className="ic" aria-hidden="true">
                  📷
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '.78rem',
                      color: '#7a8699',
                      textTransform: 'uppercase',
                      letterSpacing: '.08em',
                    }}
                  >
                    Instagram
                  </div>
                  <a
                    href="https://www.instagram.com/sax_machine_chile"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @sax_machine_chile
                  </a>
                </div>
              </li>
              <li>
                <div className="ic" aria-hidden="true">
                  ▶
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '.78rem',
                      color: '#7a8699',
                      textTransform: 'uppercase',
                      letterSpacing: '.08em',
                    }}
                  >
                    YouTube
                  </div>
                  <a
                    href="https://www.youtube.com/@SaxMachineChile"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @SaxMachineChile
                  </a>
                </div>
              </li>
            </ul>
            <div className="epk">
              <a
                href="/SaxMachine_Brochure_ES.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('press_kit_download', { language: 'es' })}
              >
                {t('contact.pressKit.es')}
              </a>
              <a
                href="/SaxMachine_Brochure_EN.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('press_kit_download', { language: 'en' })}
              >
                {t('contact.pressKit.en')}
              </a>
            </div>
          </div>

          <form className="reveal" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="f-name">{t('contact.form.name')}</label>
              <input
                type="text"
                id="f-name"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="f-email">{t('contact.form.email')}</label>
              <input
                type="email"
                id="f-email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="f-type">{t('contact.form.serviceType')}</label>
              <select
                id="f-type"
                value={formData.serviceType}
                onChange={(e) => setFormData((prev) => ({ ...prev, serviceType: e.target.value }))}
              >
                <option value={t('contact.form.options.onboard')}>
                  {t('contact.form.options.onboard')}
                </option>
                <option value={t('contact.form.options.privateEvent')}>
                  {t('contact.form.options.privateEvent')}
                </option>
                <option value={t('contact.form.options.other')}>
                  {t('contact.form.options.other')}
                </option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-msg">{t('contact.form.message')}</label>
              <textarea
                id="f-msg"
                placeholder={t('contact.form.messagePlaceholder')}
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              />
            </div>
            <Button type="submit" variant="gold">
              {t('contact.form.submit')}
            </Button>
            <p className="form-note">{t('contact.form.note')}</p>
          </form>
        </div>
      </div>
    </section>
  );
};
