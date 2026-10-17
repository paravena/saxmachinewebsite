import { type booking as enBooking } from '../en/booking';

export const booking: Record<keyof typeof enBooking, string> = {
  'booking.eyebrow': 'Formatos & Proceso',
  'booking.title': 'Cómo trabajamos contigo.',
  'booking.lead':
    'Flexibilidad para adaptarnos a la programación artística del crucero, hotel o evento.',
  'booking.formats.heading': 'Formatos disponibles',
  'booking.formats.cocktail.title': 'Sets de cóctel / Lounge',
  'booking.formats.cocktail.desc': 'Música ambiental suave para recepciones, atardeceres y cenas.',
  'booking.formats.mainStage.title': 'Show principal / Feature',
  'booking.formats.mainStage.desc':
    'Presentación destacada en teatro o salón principal (45–60 min).',
  'booking.formats.party.title': 'Party set / Bailable',
  'booking.formats.party.desc': 'Sonido potente y repertorio pop/latino para encender la pista.',
  'booking.formats.ceremony.title': 'Música para ceremonias',
  'booking.formats.ceremony.desc':
    'Momentos solemnes y emotivos para bodas y celebraciones privadas.',
  'booking.formats.duration':
    '45–60 min por set · Hasta 3 sets por jornada · Adaptable al programa',
  'booking.steps.heading': 'Paso a paso para reservar',
  'booking.steps.inquiry.title': 'Contacto y disponibilidad',
  'booking.steps.inquiry.desc':
    'Envíanos fecha, lugar (o itinerario) y el tipo de evento que buscas.',
  'booking.steps.proposal.title': 'Propuesta y repertorio',
  'booking.steps.proposal.desc':
    'Te enviamos una propuesta a medida con repertorio, requerimientos técnicos y cotización.',
  'booking.steps.confirmation.title': 'Confirmación y show',
  'booking.steps.confirmation.desc':
    'Coordinamos los detalles logísticos y entregamos una experiencia musical impecable.',
  'booking.cta': 'Consultar fechas disponibles →',
};
