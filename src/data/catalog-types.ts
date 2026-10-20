export type CategoryId = 'jabones' | 'cuidado-capilar' | 'aceites' | 'cuidado-personal' | 'hogar' | 'accesorios';

export type NeedId =
  | 'caida'
  | 'cabello-graso'
  | 'caspa'
  | 'cabello-seco'
  | 'piel-sensible'
  | 'piel-grasa'
  | 'piel-seca'
  | 'exfoliacion'
  | 'relajacion'
  | 'cero-residuos';

/** Forma del producto para generar su ilustración de catálogo (ver scripts/generate-images.mjs). */
export type ArtKind =
  | 'bar'
  | 'puck'
  | 'conditioner'
  | 'dropper'
  | 'oil'
  | 'spray'
  | 'liter'
  | 'tin'
  | 'trio'
  | 'jar'
  | 'candle'
  | 'brush'
  | 'loofah'
  | 'pad'
  | 'pouch'
  | 'brow';

export type ProductOption = {
  id: string;
  label: string;
  /** Precio propio de la opción (si cambia respecto al precio base). */
  price?: number;
  /** Color de muestra para el selector. */
  swatch?: string;
  stock?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  /** Tipo visible en tarjetas: "Champú sólido", "Jabón artesanal"… */
  type: string;
  price: number;
  /** Texto corto para tarjetas, buscador y metadatos. */
  short: string;
  description: string[];
  benefits?: string[];
  ingredients?: string;
  howTo?: string[];
  precautions?: string[];
  size?: string;
  idealFor?: string;
  needs: NeedId[];
  options?: { name: string; values: ProductOption[] };
  stock: number;
  badge?: 'Más vendido' | 'Nuevo' | 'Favorito de la casa';
  rating: number;
  reviewCount: number;
  popularity: number;
  addedAt: string;
  sku?: string;
  /** true cuando la descripción proviene del sitio oficial. */
  officialCopy: boolean;
  art: { kind: ArtKind; color: string; accent?: string };
  images: string[];
};
