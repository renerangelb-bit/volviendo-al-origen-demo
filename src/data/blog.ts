export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'products'; slugs: string[]; title: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Nuestra historia' | 'Guías' | 'Ingredientes';
  date: string;
  minutes: number;
  cover: string;
  body: BlogBlock[];
};

export const BLOG_CATEGORIES = ['Nuestra historia', 'Guías', 'Ingredientes'] as const;

/*
 * Las tres primeras entradas adaptan las publicaciones del blog oficial (2020–2022).
 * Las guías son contenido editorial nuevo propuesto para la sección "Rutinas y relacionados".
 */
export const POSTS: BlogPost[] = [
  {
    slug: 'rutina-para-cabello-graso',
    title: 'Rutina sólida para cabello graso',
    excerpt: 'Tres pasos y tres productos para espaciar los lavados sin resecar las puntas.',
    category: 'Guías',
    date: '2026-09-18',
    minutes: 3,
    cover: '/images/blog/rutina-cabello-graso.webp',
    body: [
      { type: 'p', text: 'Lavar todos los días suele empeorar el problema: el cuero cabelludo responde produciendo más grasa. La meta es limpiar a fondo sin agredir y equilibrar poco a poco.' },
      { type: 'h2', text: '1. Limpieza profunda dos o tres veces por semana' },
      { type: 'p', text: 'El Champú sólido Carbón Menta absorbe el exceso de grasa y retira impurezas. Úsalo dos o tres veces por semana y, en los días intermedios, un champú más suave como Romero Eucalipto.' },
      { type: 'h2', text: '2. Acondicionador sólo de medios a puntas' },
      { type: 'p', text: 'Las puntas sí necesitan hidratación. Desliza el acondicionador sólido lejos de la raíz, deja actuar un minuto y enjuaga con agua tibia.' },
      { type: 'h2', text: '3. Tónico de romero en el cuero cabelludo' },
      { type: 'p', text: 'Con el cabello limpio, aplica el tónico y masajea con las yemas de los dedos. Ayuda a controlar el exceso de grasa y a fortalecer desde la raíz.' },
      { type: 'products', title: 'Los productos de esta rutina', slugs: ['champu-solido-carbon-menta', 'acondicionador-solido-romero-eucalipto', 'tonico-capilar-aceite-de-romero'] },
      { type: 'p', text: 'Dale al menos tres semanas: el cambio de champú convencional a sólido tiene un periodo de ajuste mientras el cuero cabelludo se regula.' },
    ],
  },
  {
    slug: 'como-usar-champu-solido',
    title: 'Cómo usar un champú sólido (y que dure más)',
    excerpt: 'La técnica correcta, cuánta espuma esperar y el error más común al guardarlo.',
    category: 'Guías',
    date: '2026-08-07',
    minutes: 4,
    cover: '/images/blog/como-usar-champu-solido.webp',
    body: [
      { type: 'p', text: 'Un champú sólido limpia igual que uno líquido, pero sin botella de plástico y con menos agua en la fórmula. Cambia un poco la forma de usarlo.' },
      { type: 'ol', items: ['Moja muy bien tu cabello: la espuma depende del agua.', 'Desliza la barra sobre el cuero cabelludo tres o cuatro veces, sin tallar las puntas.', 'Deja la barra a un lado y masajea con las yemas de los dedos.', 'Enjuaga con agua tibia. Si tu cabello es largo o muy graso, repite.'] },
      { type: 'h2', text: 'El secreto está en secarlo' },
      { type: 'p', text: 'La barra se deshace si se queda húmeda. Guárdala en una jabonera con drenaje o en un estropajo jabonero colgado, siempre fuera del chorro de la regadera.' },
      { type: 'quote', text: 'Una barra bien guardada dura semanas; una barra que vive en un charco dura días.' },
      { type: 'products', title: 'Para empezar', slugs: ['champu-solido-romero-eucalipto', 'estropajo-jabonero', 'acondicionador-solido-coco-mango'] },
    ],
  },
  {
    slug: 'nuestro-primer-paso-al-origen',
    title: 'Nuestro primer paso al origen',
    excerpt: 'Todo inició en 2012, con un champú de sangre de grado preparado en casa para la familia.',
    category: 'Nuestra historia',
    date: '2022-07-12',
    minutes: 2,
    cover: '/images/blog/primer-paso.webp',
    body: [
      { type: 'p', text: 'Todo inició en el año 2012, movidos por el deseo de aprender a elaborar nuestros propios productos de cuidado personal para la familia. El primero fue un champú de sangre de grado (Jatropha dioica), también conocida como sangre de dragón por el color y la densidad de la savia que exuda la planta.' },
      { type: 'p', text: 'La sangre de grado crece de forma silvestre cerca del municipio de Calvillo, en Aguascalientes. Ahí la cosechamos, no sin antes intencionar y agradecer a la Madre Tierra por las bondades que nos brinda.' },
      { type: 'h2', text: 'Un saber de la región' },
      { type: 'p', text: 'Los pobladores de la zona la usan desde hace mucho tiempo para fortalecer las encías, frenar la caída del cabello, cicatrizar heridas y tratar el acné y el pie de atleta por sus propiedades antimicrobianas.' },
      { type: 'p', text: 'Con los años mejoramos la fórmula combinándola con romero, y hoy es uno de los productos favoritos de nuestra clientela: combate la caída del cabello, estimula la circulación del cuero cabelludo, elimina hongos y bacterias y regenera el cabello.' },
      { type: 'quote', text: 'Puedes encontrarlo envasado en nuestra tienda física y en línea, o en la zona de cosmética a granel, donde traes tu envase y lo rellenas.' },
      { type: 'products', title: 'Del origen a tu regadera', slugs: ['champu-sangre-de-grado', 'tonico-capilar-aceite-de-romero'] },
    ],
  },
  {
    slug: 'la-consciencia-del-olfato',
    title: 'Volviendo al Origen te acerca a la consciencia del olfato',
    excerpt: 'Aguascalientes, la industrialización y La Jabonera del Centro: una historia que se cuenta con aromas.',
    category: 'Nuestra historia',
    date: '2020-11-05',
    minutes: 2,
    cover: '/images/blog/consciencia-olfato.webp',
    body: [
      { type: 'p', text: 'Hacia 1880, la industrialización trajo a Aguascalientes aromas, colores y sabores de otras tierras. La ciudad creció con nuevas calles, mercados surtidos con mercancía de fuera y comerciantes forasteros que olían y probaban lo local.' },
      { type: 'p', text: 'De ese impulso nacieron industrias que marcaron a la ciudad: la fábrica de hilados y tejidos San Ignacio (1861), La Perla (1895), La Regeneradora (1900) y La Jabonera del Centro (1928), que llegó a ser la tercera fuente de empleo del estado, después de los talleres del ferrocarril y La Perla.' },
      { type: 'quote', text: 'Queremos perpetuar el valor de la producción artesanal: una alquimia de aromas que revelan tu propia naturaleza.' },
      { type: 'p', text: 'Nuestros jabones retoman esa tradición jabonera hidrocálida, ahora hechos a mano y con ingredientes de origen natural.' },
    ],
  },
  {
    slug: 'aceite-de-palma-en-mexico',
    title: 'Aceite de palma en México',
    excerpt: 'Por qué usamos palma certificada RSPO en nuestros jabones y qué significa esa certificación.',
    category: 'Ingredientes',
    date: '2020-11-05',
    minutes: 3,
    cover: '/images/blog/aceite-de-palma.webp',
    body: [
      { type: 'p', text: 'Cada vez más personas eligen sus productos pensando en su impacto en el planeta, y la industria del aceite de palma está bajo la lupa. Algunas empresas se comprometen a revisar su cadena productiva para asegurar una producción responsable.' },
      { type: 'h2', text: 'El panorama en México' },
      { type: 'ul', items: ['El país requiere alrededor de 600 mil toneladas al año y produce cerca del 30% (datos de FEMEXPALMA).', 'El 80% de los cultivos está en manos de pequeños productores; casi todos tienen menos de 5 hectáreas.', 'Se cultiva principalmente en el sur de Veracruz, Tabasco, Chiapas y Campeche.'] },
      { type: 'h2', text: '¿Qué es la certificación RSPO?' },
      { type: 'p', text: 'La Roundtable on Sustainable Palm Oil evalúa tres áreas: prosperidad (economía), personas (impacto social) y planeta (medio ambiente). Su obtención toma alrededor de dos años y busca minimizar el impacto ambiental y conservar los ecosistemas.' },
      { type: 'h2', text: 'Lo que hacemos nosotros' },
      { type: 'p', text: 'Elaboramos nuestros jabones a mano por saponificación en frío, con una base de aceites vegetales de coco, soya y palma. Nuestro proveedor de aceite de palma cuenta con la certificación RSPO, y todo el proceso es libre de maltrato animal.' },
      { type: 'products', title: 'Jabones hechos así', slugs: ['jabon-cafe', 'jabon-lavanda', 'jabon-carbon'] },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
