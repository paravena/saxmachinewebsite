import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../common/SectionHeader';
import { Button } from '../common/Button';
import { type ContactFormData } from '../../types/content';
import { type ContactErrorCode, type ContactResponse } from '../../types/contact';
import { track } from '../../lib/analytics';
import { useTurnstile } from '../../hooks/useTurnstile';

const BOOKING_EMAIL = 'saxmachinee@gmail.com';
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY_FORM: ContactFormData = {
  name: '',
  email: '',
  serviceType: '',
  message: '',
};

export const ContactSection: React.FC = () => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorCode, setErrorCode] = useState<ContactErrorCode | null>(null);

  const { containerRef, token, reset, enabled } = useTurnstile(TURNSTILE_SITE_KEY, language);

  const buildMailto = (): string => {
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

    return `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body
    )}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const serviceType = formData.serviceType || t('contact.form.options.onboard');

    // Legacy mode: without a Turnstile site key there is no protected endpoint
    // to post to, so keep the original `mailto:` hand-off.
    if (!enabled) {
      track('contact_form_submit', { service_type: serviceType, language, transport: 'mailto' });
      window.location.href = buildMailto();
      return;
    }

    setStatus('submitting');
    setErrorCode(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          serviceType,
          message: formData.message.trim(),
          language,
          turnstileToken: token ?? '',
        }),
      });

      const data = (await res.json().catch(() => null)) as ContactResponse | null;

      if (res.ok && data?.ok) {
        track('contact_form_submit', { service_type: serviceType, language, transport: 'api' });
        setFormData(EMPTY_FORM);
        setStatus('success');
      } else {
        const code: ContactErrorCode =
          data && !data.ok ? data.code : res.status === 403 ? 'captcha_failed' : 'send_failed';
        track('contact_form_error', { code, language });
        setErrorCode(code);
        setStatus('error');
      }
    } catch (error) {
      console.error('Contact form submission failed', error);
      track('contact_form_error', { code: 'network', language });
      setErrorCode('send_failed');
      setStatus('error');
    } finally {
      // Turnstile tokens are single-use, so refresh the widget after every try.
      reset();
    }
  };

  const errorDetail =
    errorCode === 'invalid_payload'
      ? t('contact.form.error.invalidPayload')
      : errorCode === 'captcha_failed'
        ? t('contact.form.error.captcha')
        : t('contact.form.error.body');

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
                  {[
                    { name: 'Felipe Vidal', phone: '+56 9 7333 9721', wa: '56973339721' },
                    { name: 'Jonathan Gatica', phone: '+56 9 7690 2854', wa: '56976902854' },
                  ].map(({ name, phone, wa }) => (
                    <div key={wa}>
                      <span style={{ color: '#7a8699', fontSize: '.85rem' }}>{name}: </span>
                      <a
                        href={`https://wa.me/${wa}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          track('whatsapp_click', { location: 'contact_section', contact: name })
                        }
                      >
                        {phone}
                      </a>
                    </div>
                  ))}
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
                    href="https://www.instagram.com/saxmachine.chile"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @saxmachine.chile
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
                    href="https://www.youtube.com/@saxmachinentertainment"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @saxmachinentertainment
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
            {enabled && (
              <>
                <p className="turnstile-hint">{t('contact.form.captcha')}</p>
                <div className="turnstile-box" ref={containerRef} />
              </>
            )}
            <Button
              type="submit"
              variant="gold"
              disabled={status === 'submitting' || (enabled && !token)}
            >
              {status === 'submitting' ? t('contact.form.sending') : t('contact.form.submit')}
            </Button>
            <p className="form-note">{t('contact.form.note')}</p>
            {status === 'success' && (
              <div className="form-status success" role="status" aria-live="polite">
                <strong>{t('contact.form.success.title')}</strong>
                <p>{t('contact.form.success.body')}</p>
              </div>
            )}
            {status === 'error' && (
              <div className="form-status error" role="status" aria-live="polite">
                <strong>{t('contact.form.error.title')}</strong>
                <p>
                  {errorDetail} <a href={buildMailto()}>{t('contact.form.error.mailtoLink')}</a>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
