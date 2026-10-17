import { type services as enServices } from '../en/services';

export const services: Record<keyof typeof enServices, string> = {
  'services.eyebrow': 'Servicios musicales',
  'services.title': 'Cómo podemos acompañar tu travesía.',
  'services.lead': 'Formatos flexibles para navieras, agencias y clientes directos.',
  'services.onboard.title': 'Sets a bordo',
  'services.onboard.desc':
    'Música en vivo para lounges, cubiertas, cócteles, cenas y fiestas durante toda la temporada del crucero.',
  'services.privateEvents.title': 'Eventos privados',
  'services.privateEvents.desc':
    'Bodas, celebraciones y eventos corporativos a bordo o en puerto, con repertorio personalizado.',
  'services.customAmbiance.title': 'Ambientación a medida',
  'services.customAmbiance.desc':
    'Diseñamos la propuesta musical según el concepto del barco, el horario y el perfil de los pasajeros.',
};
