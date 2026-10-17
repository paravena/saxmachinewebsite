import { type contact as enContact } from '../en/contact';

export const contact: Record<keyof typeof enContact, string> = {
  'contact.eyebrow': 'Contacto & Reservas',
  'contact.title': 'Llevemos la música a tu próximo zarpe.',
  'contact.lead':
    'Cuéntanos las fechas, el barco o el tipo de evento y te responderemos con disponibilidad, repertorio y propuesta.',
  'contact.location': 'Chile · Disponibilidad para temporadas internacionales',
  'contact.pressKit.es': '↓ Dossier PDF — Español',
  'contact.pressKit.en': '↓ Dossier PDF — English',
  'contact.form.name': 'Nombre / Empresa',
  'contact.form.email': 'Correo electrónico',
  'contact.form.serviceType': 'Tipo de servicio',
  'contact.form.options.onboard': 'Música a bordo (crucero / agencia)',
  'contact.form.options.privateEvent': 'Evento privado',
  'contact.form.options.other': 'Otro',
  'contact.form.message': 'Mensaje',
  'contact.form.messagePlaceholder': 'Fechas, barco / evento, detalles...',
  'contact.form.submit': 'Enviar mensaje',
  'contact.form.sending': 'Enviando…',
  'contact.form.captcha': 'Confirma que eres una persona antes de enviar.',
  'contact.form.success.title': 'Gracias, tu consulta fue enviada.',
  'contact.form.success.body':
    'Te responderemos dentro de 24 horas con disponibilidad y propuesta.',
  'contact.form.error.title': 'No pudimos enviar tu mensaje.',
  'contact.form.error.body': 'Inténtalo nuevamente o escríbenos directamente:',
  'contact.form.error.invalidPayload': 'Revisa tu nombre, correo y mensaje e inténtalo nuevamente.',
  'contact.form.error.captcha':
    'La verificación anti-spam falló. Resuélvela otra vez y vuelve a enviar.',
  'contact.form.error.mailtoLink': 'Escribir a saxmachinee@gmail.com',
  'contact.form.note':
    'Respondemos dentro de 24 horas. Tu mensaje llega directo a Sax Machine (saxmachinee@gmail.com).',
};
