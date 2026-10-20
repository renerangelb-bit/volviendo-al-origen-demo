import type { ArtKind, CategoryId, NeedId, Product, ProductOption } from './catalog-types';

/*
 * Catálogo tomado del sitio oficial (volviendoalorigen.com, octubre 2026): nombres, precios en MXN,
 * productos agotados y, cuando el sitio la publica, la descripción e ingredientes (officialCopy: true).
 * Para el resto se redactó una descripción breve y prudente que el cliente debe validar.
 * Calificaciones y número de reseñas son datos de demostración.
 */

const SOAP_BASE = 'Base de aceites vegetales de coco, soya y palma con certificación RSPO, saponificados en frío.';
const SOAP_HOWTO = [
  'Humedece el jabón y frótalo entre tus manos o directamente sobre la piel.',
  'Enjuaga con agua tibia.',
  'Déjalo secar en una jabonera con drenaje; así dura mucho más.',
];
const SHAMPOO_HOWTO = [
  'Moja bien tu cabello y desliza la barra sobre el cuero cabelludo tres o cuatro veces.',
  'Masajea con las yemas de los dedos hasta formar espuma y enjuaga.',
  'Guárdala seca, fuera del chorro de la regadera.',
];
const CONDITIONER_HOWTO = [
  'Después del champú, desliza la barra de medios a puntas con el cabello húmedo.',
  'Deja actuar un minuto y enjuaga con agua tibia.',
];
const OIL_HOWTO = ['Para uso aromático, coloca unas gotas en un difusor ambiental.'];
const OIL_PRECAUTIONS = [
  'Sólo para uso externo.',
  'Evitar exposición al sol.',
  'No aplicar directo en el rostro, cerca de ojos, fosas nasales o mucosas.',
  'Si se producen reacciones adversas, suspende su uso y consulta a tu médico.',
  'Mantener fuera del alcance de los niños.',
];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

type Def = {
  slug: string;
  name: string;
  category: CategoryId;
  type: string;
  price: number;
  short: string;
  description: string[];
  needs?: NeedId[];
  art: { kind: ArtKind; color: string; accent?: string };
  benefits?: string[];
  ingredients?: string;
  howTo?: string[];
  precautions?: string[];
  size?: string;
  idealFor?: string;
  options?: { name: string; values: ProductOption[] };
  stock?: number;
  badge?: Product['badge'];
  popularity?: number;
  addedAt?: string;
  sku?: string;
  officialCopy?: boolean;
};

function product(d: Def): Product {
  const h = hash(d.slug);
  return {
    id: d.slug,
    needs: [],
    stock: 12 + (h % 30),
    popularity: 20 + (h % 50),
    addedAt: `2026-0${1 + (h % 9)}-1${h % 9}`,
    officialCopy: false,
    rating: Math.round((4.3 + ((h >> 3) % 8) / 10) * 10) / 10,
    reviewCount: 4 + ((h >> 5) % 44),
    images: [`/images/products/${d.slug}.webp`, `/images/products/${d.slug}-detalle.webp`],
    ...d,
  } as Product;
}

const soap = (
  slug: string,
  name: string,
  color: string,
  short: string,
  extra: Partial<Def> & { lead?: string } = {},
): Product => {
  const { lead, ...rest } = extra;
  return product({
    slug,
    name,
    category: 'jabones',
    type: 'Jabón artesanal',
    price: 75,
    short,
    description: [lead ?? short, 'Elaborado a mano en Aguascalientes por saponificación en frío, con aceites vegetales y sin empaques de plástico.'],
    ingredients: SOAP_BASE,
    howTo: SOAP_HOWTO,
    art: { kind: 'bar', color },
    ...rest,
  });
};

const shampoo = (slug: string, name: string, color: string, def: Partial<Def>): Product =>
  product({
    slug,
    name,
    category: 'cuidado-capilar',
    type: 'Champú sólido',
    price: 175,
    short: '',
    description: [],
    howTo: SHAMPOO_HOWTO,
    art: { kind: 'puck', color },
    ...def,
  });

const essential = (slug: string, name: string, price: number, label: string, benefits: string[], extra: Partial<Def> = {}): Product =>
  product({
    slug,
    name,
    category: 'aceites',
    type: 'Aceite esencial',
    price,
    short: `${benefits[0]}. Para difusor ambiental.`,
    description: [`Aceite esencial de ${label.toLowerCase()} para aromaterapia en casa.`],
    benefits,
    howTo: OIL_HOWTO,
    precautions: OIL_PRECAUTIONS,
    needs: ['relajacion'],
    art: { kind: 'dropper', color: '#7a3f17' },
    ...extra,
  });

export const PRODUCTS: Product[] = [
  // ——— Cuidado capilar ———
  shampoo('champu-solido-romero-eucalipto', 'Champú sólido Romero Eucalipto', '#8fa37a', {
    short: 'Hidrata y nutre el cabello desde la raíz; ayuda a controlar grasa y caspa.',
    description: [
      'Hidrata y nutre el cabello desde la raíz. Ayuda a controlar la grasa del cuero cabelludo y la caspa, y deja el cabello suave y sedoso.',
      'Fortalece el folículo y ayuda a prevenir la caída. También ayuda a definir el rizo y a reducir el frizz.',
    ],
    idealFor: 'Cabello reseco, maltratado o teñido.',
    ingredients:
      'Cocosulfato de sodio (SCS), cocoil isetionato de sodio (SCI), aceite de coco, nopal, sábila, linaza, agua, fragancia de sábila y colorante vegetal.',
    needs: ['caida', 'caspa', 'cabello-graso', 'cabello-seco'],
    badge: 'Más vendido',
    popularity: 98,
    officialCopy: true,
  }),
  shampoo('champu-solido-arroz-biotina', 'Champú sólido Arroz + Biotina', '#efe8da', {
    price: 200,
    short: 'Limpieza suave inspirada en el agua de arroz: estimula el crecimiento y aporta brillo.',
    description: [
      'El agua de arroz se utiliza en Asia para el mantenimiento del cabello: estimula el crecimiento y brinda suavidad y brillo.',
      'Limpieza suave para el cuero cabelludo.',
    ],
    idealFor: 'Cabello mixto.',
    ingredients:
      'Cocosulfato de sodio (SCS), cocoil isetionato de sodio (SCI), aceite de coco, agua, polvo de arroz, agua de arroz, fragancia de vainilla y granos de arroz.',
    needs: ['caida'],
    badge: 'Nuevo',
    popularity: 74,
    addedAt: '2026-09-02',
    officialCopy: true,
  }),
  shampoo('champu-solido-calendula-manzanilla', 'Champú sólido Caléndula Manzanilla', '#f0b14a', {
    short: 'Hidratación y brillo sin modificar el color del tinte.',
    description: [
      'La caléndula es un hidratante natural excelente para tu cabello. En combinación con la manzanilla, da brillo e hidratación y deja un cabello sedoso.',
      'Regenera y repara el cabello maltratado sin modificar el color.',
    ],
    idealFor: 'Cuero cabelludo sensible y cabello teñido.',
    ingredients:
      'Cocosulfato de sodio (SCS), cocoil isetionato de sodio (SCI), aceite de coco, flor de caléndula, flor de manzanilla, agua y fragancia de manzanilla.',
    needs: ['cabello-seco', 'piel-sensible'],
    sku: '0184',
    popularity: 70,
    officialCopy: true,
  }),
  shampoo('champu-solido-carbon-menta', 'Champú sólido Carbón Menta', '#34322f', {
    short: 'Absorbe el exceso de grasa y retira impurezas del cuero cabelludo.',
    description: [
      'El champú ideal para retirar las impurezas que se acumulan en el cabello, devolviéndole su pureza y brillo.',
      'Gracias a su gran poder absorbente, regula el exceso de grasa y ayuda a eliminar la caspa.',
    ],
    idealFor: 'Cuero cabelludo muy graso. Se recomienda usarlo de 2 a 3 veces por semana.',
    ingredients: 'Cocosulfato de sodio (SCS), cocoil isetionato de sodio (SCI), aceite de coco, carbón activado, agua y aceite esencial de menta.',
    needs: ['cabello-graso', 'caspa'],
    popularity: 81,
    officialCopy: true,
  }),
  shampoo('champu-solido-jamaica', 'Champú sólido Jamaica', '#a8344d', {
    short: 'Hidrata, nutre y aumenta el brillo; aliado contra la caída y la caspa.',
    description: [
      'En la medicina tradicional india, el Ayurveda, la flor de Jamaica es una aliada para combatir la caída del cabello y la aparición de las primeras canas.',
      'Hidrata, nutre y aumenta el brillo de tu cabello. Efectivo en tratamientos para la caspa y la resequedad.',
    ],
    idealFor: 'Todo tipo de cabello.',
    ingredients: 'Cocosulfato de sodio (SCS), cocoil isetionato de sodio (SCI), aceite de coco, flor de jamaica, agua, fragancia de mandarina y colorante vegetal.',
    needs: ['caida', 'caspa', 'cabello-seco'],
    popularity: 77,
    officialCopy: true,
  }),
  shampoo('champu-solido-lavanda', 'Champú sólido Lavanda', '#a993c7', {
    short: 'Equilibra el cuero cabelludo sensible y ayuda a retirar la caspa.',
    description: [
      'El aceite esencial de lavanda ayuda a calmar el estrés relajando el sistema nervioso. Activa la circulación sanguínea estimulando el crecimiento del cabello.',
      'Con su efecto reequilibrante ayuda a retirar la caspa y a prevenir afecciones del cuero cabelludo.',
    ],
    idealFor: 'Cuero cabelludo sensible.',
    ingredients: 'Cocosulfato de sodio (SCS), cocoil isetionato de sodio (SCI), aceite de coco, agua, aceite esencial de lavanda, flor de lavanda y colorante vegetal.',
    needs: ['piel-sensible', 'caspa', 'relajacion'],
    sku: '0214',
    popularity: 72,
    officialCopy: true,
  }),
  shampoo('champu-solido-miel-polen', 'Champú sólido Miel Polen', '#dca24a', {
    short: 'Barra nutritiva con miel para cabello opaco o reseco.',
    description: ['Champú sólido con miel y polen, pensado para devolver suavidad y brillo al cabello opaco o reseco.'],
    needs: ['cabello-seco'],
    popularity: 55,
  }),
  shampoo('champu-solido-nopal-sabila-linaza', 'Champú sólido Nopal Sábila y Linaza', '#7fa35a', {
    short: 'Ingredientes mexicanos para definir rizos y controlar el frizz.',
    description: ['Combina nopal, sábila y linaza, tres ingredientes muy nuestros, para hidratar y ayudar a definir rizos y ondas.'],
    needs: ['cabello-seco'],
    popularity: 58,
  }),
  shampoo('champu-solido-tepezcohuite', 'Champú sólido Tepezcohuite', '#8a5638', {
    short: 'Con tepezcohuite, la corteza mexicana conocida por su efecto regenerador.',
    description: ['El tepezcohuite es una corteza de árbol mexicana apreciada por su efecto regenerador. Una barra suave para el cuidado diario del cuero cabelludo.'],
    needs: ['piel-sensible'],
    popularity: 48,
  }),
  product({
    slug: 'acondicionador-solido-romero-eucalipto',
    name: 'Acondicionador sólido Romero Eucalipto',
    category: 'cuidado-capilar',
    type: 'Acondicionador sólido',
    price: 100,
    short: 'Evita el encrespamiento y facilita el cepillado. Para todo tipo de cabello.',
    description: [
      'Sus propiedades antiestáticas evitan el encrespamiento del cabello y facilitan el cepillado, dejándolo sedoso y maleable.',
      'Repara, hidrata y suaviza. Para todo tipo de cabello.',
    ],
    idealFor: 'Todo tipo de cabello.',
    ingredients: 'Aceite de coco, alcohol cetílico, quartamin, metosulfato de behentrimonio (BTMS), fragancia de romero y eucalipto y colorante vegetal.',
    howTo: CONDITIONER_HOWTO,
    needs: ['cabello-seco'],
    art: { kind: 'conditioner', color: '#9db58c' },
    badge: 'Favorito de la casa',
    popularity: 90,
    officialCopy: true,
  }),
  product({
    slug: 'acondicionador-solido-coco-mango',
    name: 'Acondicionador sólido Coco Mango',
    category: 'cuidado-capilar',
    type: 'Acondicionador sólido',
    price: 100,
    short: 'Suavidad tropical para desenredar sin esfuerzo.',
    description: ['Acondicionador sólido con aroma a coco y mango que ayuda a desenredar y deja el cabello suave.'],
    howTo: CONDITIONER_HOWTO,
    needs: ['cabello-seco'],
    art: { kind: 'conditioner', color: '#f2b247' },
    popularity: 60,
  }),
  product({
    slug: 'acondicionador-solido-fresas-con-crema',
    name: 'Acondicionador sólido Fresas con Crema',
    category: 'cuidado-capilar',
    type: 'Acondicionador sólido',
    price: 100,
    short: 'Aroma dulce y textura cremosa para un cabello manejable.',
    description: ['Acondicionador sólido de aroma dulce que suaviza y deja el cabello manejable desde la primera aplicación.'],
    howTo: CONDITIONER_HOWTO,
    needs: ['cabello-seco'],
    art: { kind: 'conditioner', color: '#ee9aae' },
    popularity: 64,
    addedAt: '2026-08-20',
    badge: 'Nuevo',
  }),
  product({
    slug: 'tonico-capilar-aceite-de-romero',
    name: 'Tónico capilar Aceite de Romero',
    category: 'cuidado-capilar',
    type: 'Tónico capilar',
    price: 150,
    short: 'Fortalece desde la raíz, estimula el crecimiento y ayuda a disminuir la caída.',
    description: [
      'Ayuda a fortalecer el cabello desde la raíz, estimular su crecimiento, disminuir la caída y mejorar la circulación del cuero cabelludo.',
      'Además, contribuye a controlar el exceso de grasa y a mantener un cabello sano y con brillo.',
    ],
    howTo: ['Aplica sobre el cuero cabelludo limpio y masajea con las yemas de los dedos.', 'No requiere enjuague.'],
    needs: ['caida', 'cabello-graso'],
    art: { kind: 'spray', color: '#6e3a17' },
    popularity: 88,
    officialCopy: true,
  }),
  product({
    slug: 'champu-sangre-de-grado',
    name: 'Champú Sangre de Grado',
    category: 'cuidado-capilar',
    type: 'Champú líquido',
    price: 180,
    short: 'Nuestro primer producto: combate la caída del cabello y estimula la circulación.',
    description: [
      'Su función principal es combatir la caída del cabello, estimulando la circulación del cuero cabelludo.',
      'Así mismo elimina hongos y bacterias, regenera el cabello y es astringente, cicatrizante y antiinflamatorio. La sangre de grado se cosecha de forma silvestre cerca de Calvillo, Aguascalientes.',
    ],
    options: {
      name: 'Presentación',
      values: [
        { id: '1l', label: '1 litro', price: 180 },
        { id: 'chico', label: 'Envase chico', price: 95 },
      ],
    },
    needs: ['caida'],
    art: { kind: 'liter', color: '#7b2d26' },
    badge: 'Más vendido',
    popularity: 95,
    officialCopy: true,
  }),

  // ——— Jabones ———
  soap('jabon-jazmin-manzanilla', 'Jabón Jazmín Manzanilla', '#efdca4', 'La manzanilla ayuda a calmar, desinflamar y suavizar la piel.', {
    idealFor: 'Pieles sensibles, secas o con tendencia a la irritación.',
    needs: ['piel-sensible', 'piel-seca'],
    officialCopy: true,
    popularity: 80,
  }),
  soap('jabon-aguacate', 'Jabón Aguacate', '#a3ae63', 'Aceite de aguacate para una limpieza que no reseca.', { needs: ['piel-seca'] }),
  soap('jabon-almendra-y-avena', 'Jabón Almendra y Avena', '#e5d5b8', 'Avena y almendra: limpieza suave para piel delicada.', {
    needs: ['piel-sensible', 'piel-seca'],
    popularity: 66,
  }),
  soap('jabon-arcilla-y-eucalipto', 'Jabón Arcilla y Eucalipto', '#9fb2a4', 'Arcilla que absorbe el exceso de grasa con la frescura del eucalipto.', {
    needs: ['piel-grasa'],
  }),
  soap('jabon-arroz-niacinamida', 'Jabón Arroz + Niacinamida', '#f2eee4', 'Arroz y niacinamida para una piel de tono uniforme.', {
    price: 95,
    needs: ['piel-grasa'],
    badge: 'Nuevo',
    addedAt: '2026-09-10',
    popularity: 69,
  }),
  soap('jabon-azufre', 'Jabón Azufre', '#e3cb63', 'El clásico aliado de la piel con imperfecciones.', { needs: ['piel-grasa'], popularity: 63 }),
  soap('jabon-bicarbonato-y-toronja', 'Jabón Bicarbonato y Toronja', '#f0ae94', 'Limpieza profunda con aroma cítrico de toronja.', { needs: ['piel-grasa'] }),
  soap('jabon-cafe', 'Jabón Café', '#5a3826', 'Exfoliación suave con café molido; despierta los sentidos.', {
    needs: ['exfoliacion'],
    badge: 'Más vendido',
    popularity: 92,
  }),
  soap('jabon-calendula', 'Jabón Caléndula', '#ee9f3c', 'Caléndula para calmar y suavizar la piel delicada.', { needs: ['piel-sensible'] }),
  soap('jabon-canela', 'Jabón Canela', '#a2623a', 'Aroma cálido de canela para tu ritual de baño.', {}),
  soap('jabon-carbon', 'Jabón Carbón', '#2f2e30', 'Carbón activado que ayuda a retirar impurezas y exceso de grasa.', {
    needs: ['piel-grasa'],
    popularity: 75,
  }),
  soap('jabon-concha-nacar', 'Jabón Concha Nácar', '#ece3ec', 'Concha nácar, ingrediente tradicional para unificar el tono de la piel.', {
    price: 95,
    popularity: 79,
  }),
  soap('jabon-frutos-rojos', 'Jabón Frutos Rojos', '#d0406a', 'Aroma frutal y espuma cremosa para el día a día.', { popularity: 71 }),
  soap('jabon-leche-de-burra', 'Jabón Leche de Burra', '#f4efe4', 'Leche de burra, rica en nutrientes, para una piel suave e hidratada.', {
    price: 120,
    needs: ['piel-seca', 'piel-sensible'],
    popularity: 68,
  }),
  soap('jabon-lavanda', 'Jabón Lavanda', '#b5a0cd', 'Lavanda para relajarte al final del día.', { needs: ['relajacion'], popularity: 84 }),
  soap('jabon-menta', 'Jabón Menta', '#9dd1b2', 'Frescura de menta que revitaliza.', {}),
  soap('jabon-miel', 'Jabón Miel', '#dfa63a', 'Miel que ayuda a conservar la humectación natural de la piel.', { needs: ['piel-seca'] }),
  soap('jabon-romero', 'Jabón Romero', '#879868', 'Romero de aroma herbal para cuerpo y manos.', {}),
  soap('jabon-rosa-mosqueta', 'Jabón Rosa Mosqueta', '#e4a19e', 'Rosa mosqueta, conocida por nutrir y regenerar la piel.', { needs: ['piel-seca'] }),
  soap('jabon-sal-de-mar', 'Jabón Sal de Mar', '#a7ccd6', 'Sal de mar para exfoliar suavemente y renovar la piel.', { needs: ['exfoliacion'] }),
  soap('jabon-tepezcohuite', 'Jabón Tepezcohuite', '#8b5a3b', 'Tepezcohuite, corteza mexicana conocida por su efecto regenerador.', { needs: ['piel-sensible'] }),
  soap('jabon-yogurt-y-arbol-de-te', 'Jabón Yogurt y Árbol de Té', '#e7eee1', 'Yogurt y árbol de té para una limpieza equilibrada.', { needs: ['piel-grasa'] }),

  // ——— Aceites ———
  product({
    slug: 'aceite-de-jojoba',
    name: 'Aceite de jojoba',
    category: 'aceites',
    type: 'Aceite vegetal',
    price: 150,
    short: 'Hidrata piel y cabello sin dejar sensación grasosa.',
    description: [
      'El aceite de jojoba hidrata y nutre profundamente la piel y el cabello sin dejar sensación grasosa.',
      'Ayuda a regular la producción de grasa y a fortalecer el cabello desde la raíz, aporta brillo y suavidad y mantiene sano el cuero cabelludo. Ideal para todo tipo de piel.',
    ],
    idealFor: 'Todo tipo de piel.',
    howTo: ['Aplica unas gotas sobre la piel limpia o en puntas y cuero cabelludo; masajea hasta absorber.'],
    needs: ['piel-seca', 'cabello-seco'],
    art: { kind: 'oil', color: '#d9a640' },
    popularity: 78,
    officialCopy: true,
  }),
  product({
    slug: 'aceite-calendula',
    name: 'Aceite Caléndula',
    category: 'aceites',
    type: 'Aceite vegetal',
    price: 100,
    short: 'Macerado de caléndula para calmar la piel sensible.',
    description: ['Aceite con caléndula, flor tradicionalmente usada para calmar y suavizar la piel.'],
    howTo: ['Aplica unas gotas sobre la piel limpia y masajea suavemente.'],
    needs: ['piel-sensible'],
    art: { kind: 'oil', color: '#e9a23a' },
  }),
  product({
    slug: 'aceite-rosa-mosqueta',
    name: 'Aceite Rosa Mosqueta',
    category: 'aceites',
    type: 'Aceite vegetal',
    price: 130,
    short: 'Aceite nutritivo para rostro y cuerpo.',
    description: ['Aceite de rosa mosqueta, apreciado por nutrir la piel y ayudar a mejorar su apariencia.'],
    howTo: ['Aplica de 2 a 3 gotas por la noche sobre la piel limpia.'],
    needs: ['piel-seca'],
    art: { kind: 'oil', color: '#d97a4a' },
    popularity: 67,
  }),
  essential('aceite-esencial-arbol-de-te', 'Aceite esencial Árbol de Té', 250, 'Árbol de té', [
    'Calmante y purificante de ambiente',
    'Brinda alivio de molestias en el resfriado',
    'Aroma herbal',
  ], { officialCopy: true }),
  essential('aceite-esencial-bergamota', 'Aceite esencial Bergamota', 250, 'Bergamota', ['Aroma cítrico y luminoso', 'Ideal para empezar el día']),
  essential('aceite-esencial-eucalipto', 'Aceite esencial Eucalipto', 200, 'Eucalipto', ['Aroma fresco que despeja', 'Ideal en temporada de frío']),
  essential('aceite-esencial-lavanda', 'Aceite esencial Lavanda', 250, 'Lavanda', [
    'Es relajante',
    'Ayuda a conciliar el sueño',
    'Reduce el estrés y la ansiedad',
    'Propiedades antimicrobianas',
    'Aroma floral',
  ], { officialCopy: true, popularity: 76 }),
  essential('aceite-esencial-litsea-cubeba', 'Aceite esencial Litsea Cubeba', 250, 'Litsea cubeba', ['Aroma cítrico similar al limón', 'Refresca los espacios']),
  essential('aceite-esencial-menta', 'Aceite esencial Menta', 200, 'Menta', ['Aroma refrescante y relajante', 'Facilita el sueño', 'Ayuda a reducir la ansiedad'], {
    officialCopy: true,
  }),
  essential('aceite-esencial-romero', 'Aceite esencial Romero', 200, 'Romero', ['Aroma herbal que favorece la concentración', 'Ideal para tu espacio de trabajo']),

  // ——— Cuerpo y rostro ———
  product({
    slug: 'cold-cream',
    name: 'Cold Cream',
    category: 'cuidado-personal',
    type: 'Crema corporal',
    price: 180,
    short: 'Crema de alta humectación que nutre y protege la piel.',
    description: [
      'Crema de alta humectación que nutre y protege la piel. El cacao es rico en antioxidantes y ayuda a prevenir el envejecimiento prematuro; la verbena aporta una sensación refrescante y el aceite de almendras nutre y suaviza profundamente.',
      'Favorece la elasticidad y deja la piel suave, hidratada y con sensación sana.',
    ],
    idealFor: 'Piel seca o deshidratada.',
    howTo: ['Aplica sobre la piel limpia con un masaje suave hasta absorber.'],
    needs: ['piel-seca'],
    art: { kind: 'tin', color: '#f3ede2', accent: '#c9a77c' },
    popularity: 83,
    officialCopy: true,
  }),
  product({
    slug: 'balsamo-corporal',
    name: 'Bálsamo Corporal',
    category: 'cuidado-personal',
    type: 'Bálsamo',
    price: 180,
    short: 'Humectación profunda para pieles secas, durante el embarazo y en invierno.',
    description: ['Brinda humectación profunda para la piel. Perfecto para nutrir pieles secas, durante el embarazo y en climas invernales.'],
    ingredients: 'Manteca de mango, manteca de karité, manteca de cacao, aceite de almendras, cera de abeja y aceites esenciales de lavanda, pachuli y toronja.',
    needs: ['piel-seca'],
    art: { kind: 'tin', color: '#f1e3c4', accent: '#d9534a' },
    stock: 0,
    popularity: 73,
    officialCopy: true,
  }),
  product({
    slug: 'humectante-labial',
    name: 'Humectante Labial',
    category: 'cuidado-personal',
    type: 'Bálsamo labial',
    price: 90,
    short: 'Protege y suaviza tus labios todos los días.',
    description: ['Bálsamo labial para mantener tus labios suaves y protegidos durante el día.'],
    needs: ['piel-seca'],
    art: { kind: 'tin', color: '#f5e6d8', accent: '#e07f93' },
  }),
  product({
    slug: 'mascarillas-solidas',
    name: 'Mascarillas sólidas (paquete de 3)',
    category: 'cuidado-personal',
    type: 'Mascarillas de arcilla',
    price: 90,
    short: 'Tres mascarillas sólidas de arcilla para tu rutina facial.',
    description: ['Paquete de tres mascarillas sólidas de arcilla. Se activan con unas gotas de agua y se aplican en capa delgada sobre el rostro limpio.'],
    howTo: ['Humedece la mascarilla y frota con los dedos para obtener una pasta.', 'Aplica en capa delgada, deja secar de 10 a 15 minutos y retira con agua tibia.'],
    needs: ['piel-grasa'],
    art: { kind: 'trio', color: '#2f2e30', accent: '#c45a6a' },
    popularity: 65,
  }),
  product({
    slug: 'desodorante-alumbre',
    name: 'Desodorante Alumbre',
    category: 'cuidado-personal',
    type: 'Desodorante',
    price: 80,
    short: 'Piedra de alumbre en versión líquida: fácil de aplicar, no mancha.',
    description: [
      'Esta versión líquida de la piedra de alumbre permite una fácil aplicación y neutraliza el mal olor. Puede usarse en axilas y pies.',
      'No tapa poros, no mancha la piel ni la ropa.',
    ],
    ingredients: 'Agua destilada, piedra de alumbre, bicarbonato de sodio y aceite esencial de litsea cubeba.',
    art: { kind: 'spray', color: '#e9eef0' },
    popularity: 70,
    officialCopy: true,
  }),
  product({
    slug: 'desodorante-bicarbonato',
    name: 'Desodorante Bicarbonato',
    category: 'cuidado-personal',
    type: 'Desodorante sólido',
    price: 130,
    short: 'Desodorante sólido con bicarbonato en envase sin plástico.',
    description: ['Desodorante sólido con bicarbonato de sodio, en envase sin plástico.'],
    needs: ['cero-residuos'],
    art: { kind: 'jar', color: '#f2eee6', accent: '#9fb2a4' },
  }),
  product({
    slug: 'jabon-para-cejas',
    name: 'Jabón para Cejas',
    category: 'cuidado-personal',
    type: 'Fijador de cejas',
    price: 90,
    short: 'Fija y peina tus cejas con un acabado natural. Incluye cepillo.',
    description: ['Jabón fijador para peinar y dar forma a las cejas con un acabado natural.'],
    howTo: ['Humedece ligeramente el cepillo, frótalo sobre el jabón y peina las cejas hacia arriba.'],
    art: { kind: 'brow', color: '#f5efe6', accent: '#c2185b' },
    popularity: 62,
  }),

  // ——— Aromas para casa ———
  product({
    slug: 'velas-aromaticas',
    name: 'Velas Aromáticas',
    category: 'hogar',
    type: 'Vela de soya',
    price: 200,
    short: 'Velas de cera de soya con fragancia en aceite. Tres aromas.',
    description: ['Velas de cera de soya con fragancia en aceite.'],
    options: {
      name: 'Aroma',
      values: [
        { id: 'shanti', label: 'Shanti (Murumuru)', swatch: '#e4d6bd' },
        { id: 'in-lakech', label: 'In Lak’ech (Vainilla)', swatch: '#f1dfb8' },
        { id: 'na', label: 'Ná (Néctar de Jamaica)', swatch: '#b43f58' },
      ],
    },
    needs: ['relajacion'],
    art: { kind: 'candle', color: '#e9dcc4', accent: '#b43f58' },
    popularity: 86,
    officialCopy: true,
  }),

  // ——— Accesorios ———
  product({
    slug: 'pad-desmaquillante',
    name: 'Pad desmaquillante (1 pieza)',
    category: 'accesorios',
    type: 'Pad reutilizable',
    price: 50,
    short: 'Pad de tela lavable que sustituye algodones desechables.',
    description: ['Pad de tela lavable y reutilizable para desmaquillar y aplicar tónicos.'],
    howTo: ['Lávalo a mano con jabón después de cada uso y déjalo secar al aire.'],
    needs: ['cero-residuos'],
    art: { kind: 'pad', color: '#f4efe7' },
  }),
  product({
    slug: 'cepillo-dental-bambu',
    name: 'Cepillo dental de bambú',
    category: 'accesorios',
    type: 'Cepillo',
    price: 50,
    short: 'Mango de bambú biodegradable.',
    description: ['Cepillo dental con mango de bambú, una alternativa al plástico para tu rutina diaria.'],
    needs: ['cero-residuos'],
    art: { kind: 'brush', color: '#c9a678' },
    popularity: 61,
  }),
  product({
    slug: 'cepillo-facial',
    name: 'Cepillo facial',
    category: 'accesorios',
    type: 'Cepillo',
    price: 50,
    short: 'Cepillo suave para limpieza facial.',
    description: ['Cepillo de cerdas suaves para una limpieza facial con jabón sólido.'],
    needs: ['cero-residuos', 'exfoliacion'],
    art: { kind: 'brush', color: '#d2b48c', accent: 'facial' },
  }),
  product({
    slug: 'cepillo-mediano',
    name: 'Cepillo corporal mediano',
    category: 'accesorios',
    type: 'Cepillo',
    price: 120,
    short: 'Para exfoliar el cuerpo en seco o en la regadera.',
    description: ['Cepillo corporal de madera para exfoliar y activar la circulación.'],
    needs: ['cero-residuos', 'exfoliacion'],
    art: { kind: 'brush', color: '#b98d5f', accent: 'body' },
  }),
  product({
    slug: 'cepillo-grande',
    name: 'Cepillo corporal grande',
    category: 'accesorios',
    type: 'Cepillo',
    price: 150,
    short: 'Mango largo para alcanzar la espalda.',
    description: ['Cepillo corporal de madera con mango largo para exfoliar espalda y piernas.'],
    needs: ['cero-residuos', 'exfoliacion'],
    art: { kind: 'brush', color: '#a97c4f', accent: 'long' },
  }),
  product({
    slug: 'estropajo-jabonero',
    name: 'Estropajo jabonero',
    category: 'accesorios',
    type: 'Estropajo natural',
    price: 75,
    short: 'Bolsita de fibra natural para aprovechar tu jabón hasta el final.',
    description: ['Guarda dentro tu jabón: hace más espuma, exfolia suavemente y aprovecha los últimos trocitos.'],
    needs: ['cero-residuos', 'exfoliacion'],
    art: { kind: 'loofah', color: '#e6d3a8', accent: 'bag' },
  }),
  product({
    slug: 'estropajo-redondo',
    name: 'Estropajo redondo',
    category: 'accesorios',
    type: 'Estropajo natural',
    price: 85,
    short: 'Fibra vegetal compostable para exfoliar.',
    description: ['Estropajo de fibra vegetal, compostable al final de su vida útil.'],
    needs: ['cero-residuos', 'exfoliacion'],
    art: { kind: 'loofah', color: '#e3cf9f', accent: 'round' },
  }),
  product({
    slug: 'estropajo-tira',
    name: 'Estropajo tira',
    category: 'accesorios',
    type: 'Estropajo natural',
    price: 85,
    short: 'Tira con asas para la espalda.',
    description: ['Estropajo de fibra vegetal en tira, con asas para alcanzar la espalda.'],
    needs: ['cero-residuos', 'exfoliacion'],
    art: { kind: 'loofah', color: '#dcc796', accent: 'strip' },
  }),
  product({
    slug: 'kit-de-viaje',
    name: 'Kit de viaje',
    category: 'accesorios',
    type: 'Kit',
    price: 120,
    short: 'Tus básicos sólidos en formato para llevar.',
    description: ['Un kit con básicos sólidos en tamaño de viaje, listos para la maleta y sin riesgo de derrames.'],
    needs: ['cero-residuos'],
    art: { kind: 'pouch', color: '#d8c3a5' },
    stock: 0,
  }),
];

export const PRODUCT_BY_SLUG = new Map(PRODUCTS.map((p) => [p.slug, p]));
export const getProduct = (slug: string) => PRODUCT_BY_SLUG.get(slug);

export const FEATURED_SLUGS = [
  'champu-solido-romero-eucalipto',
  'acondicionador-solido-romero-eucalipto',
  'champu-sangre-de-grado',
  'velas-aromaticas',
  'jabon-cafe',
  'tonico-capilar-aceite-de-romero',
  'cold-cream',
  'jabon-lavanda',
];

/** Precio efectivo de un producto según la opción elegida. */
export function priceFor(product: Product, optionId?: string) {
  const opt = product.options?.values.find((v) => v.id === optionId);
  return opt?.price ?? product.price;
}

/** Precio mínimo para mostrar "Desde $X" cuando las opciones cambian el precio. */
export function minPrice(product: Product) {
  const prices = product.options?.values.map((v) => v.price ?? product.price) ?? [product.price];
  return Math.min(...prices);
}

export function isAvailable(product: Product) {
  return product.stock > 0;
}

/** Productos relacionados: misma categoría o necesidades compartidas, sin el actual. */
export function relatedProducts(product: Product, limit = 4) {
  const score = (p: Product) =>
    (p.category === product.category ? 2 : 0) + p.needs.filter((n) => product.needs.includes(n)).length * 3 + p.popularity / 100;
  return PRODUCTS.filter((p) => p.slug !== product.slug && p.stock > 0)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}
