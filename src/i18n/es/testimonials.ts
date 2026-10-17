import { type testimonials as enTestimonials } from '../en/testimonials';

export const testimonials: Record<keyof typeof enTestimonials, string> = {
  'testimonials.eyebrow': 'Testimonios',
  'testimonials.title': 'Lo que dicen quienes nos han escuchado.',
  'testimonials.lead': 'Experiencia comprobada en eventos de alto estándar.',
  'testimonials.producer.quote':
    'La calidad musical y la elegancia que aportaron al cóctel superaron nuestras expectativas. 100% recomendados.',
  'testimonials.producer.author': '— Carolina M., Productora de eventos',
  'testimonials.cruiseDirector.quote':
    'Un show versátil que conectó con pasajeros de distintas nacionalidades. Gran profesionalismo a bordo.',
  'testimonials.cruiseDirector.author': '— Entertainment Director, Cruise Line',
  'testimonials.privateEvent.quote':
    'El público quedó fascinado. Comunicación impecable antes y durante el evento.',
  'testimonials.privateEvent.author': '— Valentina Herrera, Evento privado · Santiago',
};
