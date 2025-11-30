export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseInstructor = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  title: string;
};

export type CourseLesson = {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  duration: number;
  isPreview: boolean;
};

export type CourseModule = {
  id: string;
  title: string;
  description: string;
  duration: number;
  lessons: CourseLesson[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  currency: string;
  level: CourseLevel;
  category: string;
  tags: string[];
  duration: number;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  language: string;
  instructor: CourseInstructor;
  modules: CourseModule[];
  features: string[];
  requirements: string[];
  objectives: string[];
};

export type CourseCategory = {
  id: string;
  name: string;
  slug: string;
  coursesCount: number;
};

export const MOCK_CATEGORIES: CourseCategory[] = [
  { id: "cat-1", name: "Desarrollo Web", slug: "desarrollo-web", coursesCount: 3 },
  { id: "cat-2", name: "Diseno", slug: "diseno", coursesCount: 2 },
  { id: "cat-3", name: "Marketing Digital", slug: "marketing-digital", coursesCount: 1 },
  { id: "cat-4", name: "Negocios", slug: "negocios", coursesCount: 1 },
  { id: "cat-5", name: "Data Science", slug: "data-science", coursesCount: 1 },
];

export const MOCK_INSTRUCTORS: CourseInstructor[] = [
  {
    id: "inst-1",
    name: "Maria Garcia",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    bio: "Desarrolladora senior con mas de 10 años de experiencia en React y TypeScript. Ha trabajado en empresas como Google y Meta.",
    title: "Senior Frontend Developer",
  },
  {
    id: "inst-2",
    name: "Carlos Rodriguez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    bio: "Experto en UX/UI con mas de 8 años diseñando productos digitales para startups y grandes empresas.",
    title: "Lead UX Designer",
  },
  {
    id: "inst-3",
    name: "Ana Martinez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    bio: "Data Scientist con PhD en Machine Learning. Profesora universitaria y consultora para empresas Fortune 500.",
    title: "Data Science Lead",
  },
];

export const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    slug: "react-avanzado-patrones",
    title: "React Avanzado: Patrones y Arquitectura",
    description: "Domina los patrones avanzados de React para construir aplicaciones escalables y mantenibles. Aprenderás desde patrones de composición hasta arquitecturas complejas utilizadas en producción por las mejores empresas de tecnología. Este curso te llevará al siguiente nivel como desarrollador React.",
    shortDescription: "Aprende patrones avanzados de React para aplicaciones escalables",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    price: 79.99,
    originalPrice: 149.99,
    currency: "USD",
    level: "advanced",
    category: "desarrollo-web",
    tags: ["react", "typescript", "frontend", "arquitectura"],
    duration: 1200,
    lessonsCount: 48,
    studentsCount: 2340,
    rating: 4.8,
    reviewsCount: 456,
    language: "es",
    instructor: MOCK_INSTRUCTORS[0],
    modules: [
      {
        id: "mod-1-1",
        title: "Introduccion a Patrones Avanzados",
        description: "Fundamentos de patrones de diseño en React",
        duration: 120,
        lessons: [
          { id: "les-1-1-1", title: "Bienvenida al curso", type: "video", duration: 5, isPreview: true },
          { id: "les-1-1-2", title: "Configuracion del entorno", type: "video", duration: 15, isPreview: true },
          { id: "les-1-1-3", title: "Repaso de conceptos fundamentales", type: "video", duration: 25, isPreview: false },
          { id: "les-1-1-4", title: "Quiz: Conceptos basicos", type: "quiz", duration: 10, isPreview: false },
        ],
      },
      {
        id: "mod-1-2",
        title: "Compound Components",
        description: "Patron de componentes compuestos para APIs flexibles",
        duration: 180,
        lessons: [
          { id: "les-1-2-1", title: "Que son los Compound Components", type: "video", duration: 20, isPreview: false },
          { id: "les-1-2-2", title: "Implementacion practica", type: "video", duration: 45, isPreview: false },
          { id: "les-1-2-3", title: "Casos de uso avanzados", type: "video", duration: 35, isPreview: false },
          { id: "les-1-2-4", title: "Ejercicio practico", type: "text", duration: 60, isPreview: false },
        ],
      },
      {
        id: "mod-1-3",
        title: "Render Props y HOCs",
        description: "Patrones clasicos de reutilizacion de logica",
        duration: 150,
        lessons: [
          { id: "les-1-3-1", title: "Render Props en profundidad", type: "video", duration: 30, isPreview: false },
          { id: "les-1-3-2", title: "Higher Order Components", type: "video", duration: 35, isPreview: false },
          { id: "les-1-3-3", title: "Cuando usar cada patron", type: "video", duration: 25, isPreview: false },
        ],
      },
    ],
    features: [
      "48 lecciones en video HD",
      "Acceso de por vida",
      "Certificado de finalizacion",
      "Proyectos practicos",
      "Soporte del instructor",
      "Comunidad privada de Discord",
    ],
    requirements: [
      "Conocimientos solidos de React",
      "JavaScript ES6+ y TypeScript basico",
      "Experiencia con hooks de React",
    ],
    objectives: [
      "Dominar patrones avanzados de React",
      "Crear arquitecturas escalables",
      "Implementar testing efectivo",
      "Optimizar rendimiento de aplicaciones",
    ],
  },
  {
    id: "course-2",
    slug: "typescript-desde-cero",
    title: "TypeScript desde Cero hasta Experto",
    description: "Aprende TypeScript desde los fundamentos hasta tecnicas avanzadas. Cubriemos tipos basicos, genericos, utility types, decoradores y como integrar TypeScript en proyectos reales con React, Node.js y mas.",
    shortDescription: "Domina TypeScript y lleva tu codigo JavaScript al siguiente nivel",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop",
    price: 59.99,
    originalPrice: 99.99,
    currency: "USD",
    level: "beginner",
    category: "desarrollo-web",
    tags: ["typescript", "javascript", "programacion"],
    duration: 900,
    lessonsCount: 36,
    studentsCount: 5620,
    rating: 4.9,
    reviewsCount: 892,
    language: "es",
    instructor: MOCK_INSTRUCTORS[0],
    modules: [
      {
        id: "mod-2-1",
        title: "Fundamentos de TypeScript",
        description: "Tipos basicos y configuracion inicial",
        duration: 180,
        lessons: [
          { id: "les-2-1-1", title: "Introduccion a TypeScript", type: "video", duration: 15, isPreview: true },
          { id: "les-2-1-2", title: "Instalacion y configuracion", type: "video", duration: 20, isPreview: true },
          { id: "les-2-1-3", title: "Tipos primitivos", type: "video", duration: 30, isPreview: false },
          { id: "les-2-1-4", title: "Arrays y tuplas", type: "video", duration: 25, isPreview: false },
        ],
      },
      {
        id: "mod-2-2",
        title: "Tipos Avanzados",
        description: "Union types, intersection types y mas",
        duration: 240,
        lessons: [
          { id: "les-2-2-1", title: "Union e Intersection Types", type: "video", duration: 35, isPreview: false },
          { id: "les-2-2-2", title: "Type Guards", type: "video", duration: 40, isPreview: false },
          { id: "les-2-2-3", title: "Genericos basicos", type: "video", duration: 45, isPreview: false },
        ],
      },
    ],
    features: [
      "36 lecciones en video HD",
      "Acceso de por vida",
      "Certificado de finalizacion",
      "Ejercicios practicos",
      "Codigo fuente descargable",
    ],
    requirements: [
      "Conocimientos basicos de JavaScript",
      "Editor de codigo (VS Code recomendado)",
    ],
    objectives: [
      "Entender el sistema de tipos de TypeScript",
      "Escribir codigo type-safe",
      "Usar genericos efectivamente",
      "Integrar TypeScript en proyectos existentes",
    ],
  },
  {
    id: "course-3",
    slug: "diseno-ui-figma",
    title: "Diseño UI/UX con Figma",
    description: "Aprende a diseñar interfaces de usuario profesionales con Figma. Desde los fundamentos del diseño hasta prototipos interactivos y sistemas de diseño completos.",
    shortDescription: "Crea interfaces profesionales y prototipos interactivos",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
    price: 69.99,
    originalPrice: 129.99,
    currency: "USD",
    level: "beginner",
    category: "diseno",
    tags: ["figma", "ui", "ux", "diseño"],
    duration: 840,
    lessonsCount: 32,
    studentsCount: 3150,
    rating: 4.7,
    reviewsCount: 523,
    language: "es",
    instructor: MOCK_INSTRUCTORS[1],
    modules: [
      {
        id: "mod-3-1",
        title: "Introduccion a Figma",
        description: "Conoce la herramienta y sus funcionalidades",
        duration: 120,
        lessons: [
          { id: "les-3-1-1", title: "Tour por Figma", type: "video", duration: 20, isPreview: true },
          { id: "les-3-1-2", title: "Herramientas basicas", type: "video", duration: 30, isPreview: true },
          { id: "les-3-1-3", title: "Frames y grupos", type: "video", duration: 25, isPreview: false },
        ],
      },
      {
        id: "mod-3-2",
        title: "Componentes y Estilos",
        description: "Crea sistemas de diseño escalables",
        duration: 200,
        lessons: [
          { id: "les-3-2-1", title: "Creando componentes", type: "video", duration: 40, isPreview: false },
          { id: "les-3-2-2", title: "Variantes de componentes", type: "video", duration: 35, isPreview: false },
          { id: "les-3-2-3", title: "Estilos de texto y color", type: "video", duration: 30, isPreview: false },
        ],
      },
    ],
    features: [
      "32 lecciones en video HD",
      "Archivos de Figma incluidos",
      "Proyectos practicos",
      "Certificado de finalizacion",
      "Feedback del instructor",
    ],
    requirements: [
      "Cuenta gratuita de Figma",
      "Conocimientos basicos de diseño (opcional)",
    ],
    objectives: [
      "Dominar las herramientas de Figma",
      "Crear componentes reutilizables",
      "Diseñar prototipos interactivos",
      "Construir un sistema de diseño",
    ],
  },
  {
    id: "course-4",
    slug: "marketing-digital-completo",
    title: "Marketing Digital Completo",
    description: "Aprende todas las estrategias de marketing digital: SEO, SEM, redes sociales, email marketing y mas. Curso practico con casos de estudio reales.",
    shortDescription: "Domina todas las estrategias de marketing digital",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    price: 89.99,
    originalPrice: 179.99,
    currency: "USD",
    level: "intermediate",
    category: "marketing-digital",
    tags: ["marketing", "seo", "redes sociales", "publicidad"],
    duration: 1080,
    lessonsCount: 42,
    studentsCount: 4280,
    rating: 4.6,
    reviewsCount: 687,
    language: "es",
    instructor: MOCK_INSTRUCTORS[1],
    modules: [
      {
        id: "mod-4-1",
        title: "Fundamentos del Marketing Digital",
        description: "Conceptos clave y estrategia",
        duration: 150,
        lessons: [
          { id: "les-4-1-1", title: "Ecosistema digital actual", type: "video", duration: 25, isPreview: true },
          { id: "les-4-1-2", title: "Customer Journey", type: "video", duration: 30, isPreview: false },
          { id: "les-4-1-3", title: "Metricas clave", type: "video", duration: 35, isPreview: false },
        ],
      },
      {
        id: "mod-4-2",
        title: "SEO y Contenidos",
        description: "Posicionamiento organico en buscadores",
        duration: 240,
        lessons: [
          { id: "les-4-2-1", title: "SEO On-Page", type: "video", duration: 45, isPreview: false },
          { id: "les-4-2-2", title: "SEO Off-Page", type: "video", duration: 40, isPreview: false },
          { id: "les-4-2-3", title: "Estrategia de contenidos", type: "video", duration: 50, isPreview: false },
        ],
      },
    ],
    features: [
      "42 lecciones en video HD",
      "Plantillas descargables",
      "Casos de estudio reales",
      "Certificado de finalizacion",
      "Actualizaciones gratuitas",
    ],
    requirements: [
      "Conocimientos basicos de internet",
      "Ganas de aprender marketing",
    ],
    objectives: [
      "Crear estrategias de marketing digital",
      "Optimizar sitios para SEO",
      "Gestionar campañas de publicidad",
      "Analizar metricas y resultados",
    ],
  },
  {
    id: "course-5",
    slug: "python-data-science",
    title: "Python para Data Science",
    description: "Aprende Python aplicado a ciencia de datos. Cubriemos pandas, numpy, matplotlib, machine learning con scikit-learn y proyectos reales de analisis de datos.",
    shortDescription: "Analisis de datos y machine learning con Python",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    price: 99.99,
    originalPrice: 199.99,
    currency: "USD",
    level: "intermediate",
    category: "data-science",
    tags: ["python", "data science", "machine learning", "pandas"],
    duration: 1320,
    lessonsCount: 52,
    studentsCount: 6890,
    rating: 4.9,
    reviewsCount: 1234,
    language: "es",
    instructor: MOCK_INSTRUCTORS[2],
    modules: [
      {
        id: "mod-5-1",
        title: "Python para Datos",
        description: "Fundamentos de Python para analisis",
        duration: 200,
        lessons: [
          { id: "les-5-1-1", title: "Configuracion del entorno", type: "video", duration: 20, isPreview: true },
          { id: "les-5-1-2", title: "Numpy fundamentals", type: "video", duration: 45, isPreview: true },
          { id: "les-5-1-3", title: "Pandas basico", type: "video", duration: 50, isPreview: false },
        ],
      },
      {
        id: "mod-5-2",
        title: "Analisis Exploratorio",
        description: "Tecnicas de EDA y visualizacion",
        duration: 280,
        lessons: [
          { id: "les-5-2-1", title: "Limpieza de datos", type: "video", duration: 55, isPreview: false },
          { id: "les-5-2-2", title: "Visualizacion con Matplotlib", type: "video", duration: 45, isPreview: false },
          { id: "les-5-2-3", title: "Seaborn avanzado", type: "video", duration: 40, isPreview: false },
        ],
      },
      {
        id: "mod-5-3",
        title: "Machine Learning",
        description: "Introduccion a ML con scikit-learn",
        duration: 320,
        lessons: [
          { id: "les-5-3-1", title: "Conceptos de ML", type: "video", duration: 35, isPreview: false },
          { id: "les-5-3-2", title: "Regresion lineal", type: "video", duration: 50, isPreview: false },
          { id: "les-5-3-3", title: "Clasificacion", type: "video", duration: 55, isPreview: false },
          { id: "les-5-3-4", title: "Proyecto final", type: "text", duration: 90, isPreview: false },
        ],
      },
    ],
    features: [
      "52 lecciones en video HD",
      "Jupyter notebooks incluidos",
      "Datasets reales",
      "Proyectos practicos",
      "Certificado de finalizacion",
      "Soporte tecnico",
    ],
    requirements: [
      "Conocimientos basicos de programacion",
      "Matematicas nivel bachillerato",
      "Computadora con 8GB RAM minimo",
    ],
    objectives: [
      "Dominar pandas y numpy",
      "Crear visualizaciones efectivas",
      "Implementar modelos de ML",
      "Analizar datasets reales",
    ],
  },
  {
    id: "course-6",
    slug: "nextjs-fullstack",
    title: "Next.js: Desarrollo Fullstack Moderno",
    description: "Construye aplicaciones web fullstack con Next.js 14, App Router, Server Components, Server Actions y mas. Incluye integracion con bases de datos y despliegue en produccion.",
    shortDescription: "Aplicaciones fullstack modernas con Next.js 14",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop",
    price: 84.99,
    originalPrice: 159.99,
    currency: "USD",
    level: "intermediate",
    category: "desarrollo-web",
    tags: ["nextjs", "react", "fullstack", "typescript"],
    duration: 1140,
    lessonsCount: 45,
    studentsCount: 3420,
    rating: 4.8,
    reviewsCount: 567,
    language: "es",
    instructor: MOCK_INSTRUCTORS[0],
    modules: [
      {
        id: "mod-6-1",
        title: "Fundamentos de Next.js 14",
        description: "App Router y Server Components",
        duration: 180,
        lessons: [
          { id: "les-6-1-1", title: "Introduccion a Next.js 14", type: "video", duration: 20, isPreview: true },
          { id: "les-6-1-2", title: "App Router en detalle", type: "video", duration: 40, isPreview: true },
          { id: "les-6-1-3", title: "Server vs Client Components", type: "video", duration: 35, isPreview: false },
        ],
      },
      {
        id: "mod-6-2",
        title: "Data Fetching",
        description: "Estrategias de obtencion de datos",
        duration: 220,
        lessons: [
          { id: "les-6-2-1", title: "Server Actions", type: "video", duration: 45, isPreview: false },
          { id: "les-6-2-2", title: "Caching y revalidacion", type: "video", duration: 40, isPreview: false },
          { id: "les-6-2-3", title: "Streaming y Suspense", type: "video", duration: 35, isPreview: false },
        ],
      },
    ],
    features: [
      "45 lecciones en video HD",
      "Codigo fuente completo",
      "Proyecto real de e-commerce",
      "Certificado de finalizacion",
      "Despliegue en Vercel incluido",
    ],
    requirements: [
      "Conocimientos solidos de React",
      "JavaScript/TypeScript",
      "Conocimientos basicos de Node.js",
    ],
    objectives: [
      "Dominar Next.js 14 App Router",
      "Implementar Server Components",
      "Crear APIs con Route Handlers",
      "Desplegar aplicaciones en produccion",
    ],
  },
  {
    id: "course-7",
    slug: "emprendimiento-digital",
    title: "Emprendimiento Digital: De la Idea al Negocio",
    description: "Aprende a crear y lanzar tu negocio digital. Validacion de ideas, modelo de negocio, MVP, growth hacking y estrategias de escalamiento.",
    shortDescription: "Lanza tu negocio digital desde cero",
    thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=450&fit=crop",
    price: 94.99,
    originalPrice: 189.99,
    currency: "USD",
    level: "beginner",
    category: "negocios",
    tags: ["emprendimiento", "startup", "negocios", "growth"],
    duration: 960,
    lessonsCount: 38,
    studentsCount: 2890,
    rating: 4.7,
    reviewsCount: 445,
    language: "es",
    instructor: MOCK_INSTRUCTORS[1],
    modules: [
      {
        id: "mod-7-1",
        title: "Validacion de Ideas",
        description: "Como saber si tu idea tiene potencial",
        duration: 180,
        lessons: [
          { id: "les-7-1-1", title: "Encontrando problemas reales", type: "video", duration: 30, isPreview: true },
          { id: "les-7-1-2", title: "Investigacion de mercado", type: "video", duration: 40, isPreview: false },
          { id: "les-7-1-3", title: "Entrevistas con usuarios", type: "video", duration: 35, isPreview: false },
        ],
      },
      {
        id: "mod-7-2",
        title: "Modelo de Negocio",
        description: "Canvas y estrategia de monetizacion",
        duration: 200,
        lessons: [
          { id: "les-7-2-1", title: "Business Model Canvas", type: "video", duration: 45, isPreview: false },
          { id: "les-7-2-2", title: "Modelos de monetizacion", type: "video", duration: 40, isPreview: false },
          { id: "les-7-2-3", title: "Pricing estrategico", type: "video", duration: 35, isPreview: false },
        ],
      },
    ],
    features: [
      "38 lecciones en video HD",
      "Templates y frameworks",
      "Casos de estudio",
      "Certificado de finalizacion",
      "Sesion de mentoria grupal",
    ],
    requirements: [
      "Una idea de negocio (o ganas de encontrarla)",
      "Motivacion para emprender",
    ],
    objectives: [
      "Validar ideas de negocio",
      "Crear un modelo de negocio solido",
      "Construir un MVP",
      "Implementar estrategias de crecimiento",
    ],
  },
  {
    id: "course-8",
    slug: "ilustracion-digital",
    title: "Ilustracion Digital para Principiantes",
    description: "Aprende ilustracion digital desde cero usando Procreate e Illustrator. Tecnicas de dibujo, color, composicion y creacion de personajes.",
    shortDescription: "Crea ilustraciones digitales profesionales",
    thumbnail: "https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=800&h=450&fit=crop",
    price: 54.99,
    originalPrice: 109.99,
    currency: "USD",
    level: "beginner",
    category: "diseno",
    tags: ["ilustracion", "procreate", "illustrator", "arte digital"],
    duration: 720,
    lessonsCount: 28,
    studentsCount: 1950,
    rating: 4.8,
    reviewsCount: 312,
    language: "es",
    instructor: MOCK_INSTRUCTORS[1],
    modules: [
      {
        id: "mod-8-1",
        title: "Fundamentos del Dibujo Digital",
        description: "Herramientas y tecnicas basicas",
        duration: 150,
        lessons: [
          { id: "les-8-1-1", title: "Introduccion al dibujo digital", type: "video", duration: 20, isPreview: true },
          { id: "les-8-1-2", title: "Configuracion de Procreate", type: "video", duration: 25, isPreview: true },
          { id: "les-8-1-3", title: "Pinceles esenciales", type: "video", duration: 30, isPreview: false },
        ],
      },
      {
        id: "mod-8-2",
        title: "Color y Composicion",
        description: "Teoria del color aplicada",
        duration: 180,
        lessons: [
          { id: "les-8-2-1", title: "Teoria del color", type: "video", duration: 35, isPreview: false },
          { id: "les-8-2-2", title: "Paletas de colores", type: "video", duration: 30, isPreview: false },
          { id: "les-8-2-3", title: "Composicion efectiva", type: "video", duration: 40, isPreview: false },
        ],
      },
    ],
    features: [
      "28 lecciones en video HD",
      "Pinceles personalizados",
      "Proyectos paso a paso",
      "Certificado de finalizacion",
      "Comunidad de artistas",
    ],
    requirements: [
      "iPad con Procreate o computadora con Illustrator",
      "Tableta grafica (opcional para PC)",
    ],
    objectives: [
      "Dominar herramientas de ilustracion",
      "Aplicar teoria del color",
      "Crear personajes originales",
      "Desarrollar un estilo propio",
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return MOCK_COURSES.find((course) => course.slug === slug);
}

export function getCoursesByCategory(categorySlug: string): Course[] {
  return MOCK_COURSES.filter((course) => course.category === categorySlug);
}

export function getFeaturedCourses(limit = 4): Course[] {
  return [...MOCK_COURSES].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("es", {
    style: "currency",
    currency,
  }).format(price);
}
