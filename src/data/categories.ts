import type { CategoryId, NeedId } from './catalog-types';

export type Category = {
  id: CategoryId;
  name: string;
  /** Frase breve para la tarjeta de categoría en Home. */
  blurb: string;
  icon: 'bar' | 'hair' | 'drop' | 'leaf' | 'flame' | 'brush';
};

export const CATEGORIES: Category[] = [
  { id: 'jabones', name: 'Jabones artesanales', blurb: 'Hechos a mano por saponificación en frío.', icon: 'bar' },
  { id: 'cuidado-capilar', name: 'Cuidado capilar', blurb: 'Champús y acondicionadores sólidos, tónicos.', icon: 'hair' },
  { id: 'aceites', name: 'Aceites', blurb: 'Esenciales para aromaterapia y vegetales para piel y cabello.', icon: 'drop' },
  { id: 'cuidado-personal', name: 'Cuerpo y rostro', blurb: 'Cremas, bálsamos, mascarillas y desodorantes.', icon: 'leaf' },
  { id: 'hogar', name: 'Aromas para casa', blurb: 'Velas de cera de soya.', icon: 'flame' },
  { id: 'accesorios', name: 'Accesorios sin plástico', blurb: 'Cepillos de bambú, estropajos y pads reutilizables.', icon: 'brush' },
];

export const NEEDS: { id: NeedId; name: string }[] = [
  { id: 'caida', name: 'Caída del cabello' },
  { id: 'cabello-graso', name: 'Cabello graso' },
  { id: 'caspa', name: 'Caspa' },
  { id: 'cabello-seco', name: 'Cabello seco o teñido' },
  { id: 'piel-sensible', name: 'Piel o cuero cabelludo sensible' },
  { id: 'piel-grasa', name: 'Piel grasa o con imperfecciones' },
  { id: 'piel-seca', name: 'Piel seca' },
  { id: 'exfoliacion', name: 'Exfoliación' },
  { id: 'relajacion', name: 'Relajación y descanso' },
  { id: 'cero-residuos', name: 'Cero residuos' },
];

export const categoryName = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.name ?? id;
export const needName = (id: NeedId) => NEEDS.find((n) => n.id === id)?.name ?? id;
