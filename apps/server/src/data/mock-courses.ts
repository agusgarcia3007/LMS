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

const MOCK_INSTRUCTORS: CourseInstructor[] = [
  {
    id: "inst-1",
    name: "Maria Garcia",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    bio: "Desarrolladora senior con mas de 10 años de experiencia en React y TypeScript.",
    title: "Senior Frontend Developer",
  },
  {
    id: "inst-2",
    name: "Carlos Rodriguez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    bio: "Experto en UX/UI con mas de 8 años diseñando productos digitales.",
    title: "Lead UX Designer",
  },
  {
    id: "inst-3",
    name: "Ana Martinez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    bio: "Data Scientist con PhD en Machine Learning.",
    title: "Data Science Lead",
  },
];

export const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    slug: "react-avanzado-patrones",
    title: "React Avanzado: Patrones y Arquitectura",
    description: "Domina los patrones avanzados de React para construir aplicaciones escalables y mantenibles.",
    shortDescription: "Aprende patrones avanzados de React para aplicaciones escalables",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    price: 79.99,
    originalPrice: 149.99,
    currency: "USD",
    level: "advanced",
    category: "desarrollo-web",
    tags: ["react", "typescript", "frontend"],
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
        ],
      },
      {
        id: "mod-1-2",
        title: "Compound Components",
        description: "Patron de componentes compuestos",
        duration: 180,
        lessons: [
          { id: "les-1-2-1", title: "Que son los Compound Components", type: "video", duration: 20, isPreview: false },
          { id: "les-1-2-2", title: "Implementacion practica", type: "video", duration: 45, isPreview: false },
        ],
      },
    ],
    features: ["48 lecciones en video HD", "Acceso de por vida", "Certificado de finalizacion", "Proyectos practicos"],
    requirements: ["Conocimientos solidos de React", "JavaScript ES6+"],
    objectives: ["Dominar patrones avanzados", "Crear arquitecturas escalables"],
  },
  {
    id: "course-2",
    slug: "typescript-desde-cero",
    title: "TypeScript desde Cero hasta Experto",
    description: "Aprende TypeScript desde los fundamentos hasta tecnicas avanzadas.",
    shortDescription: "Domina TypeScript y lleva tu codigo al siguiente nivel",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop",
    price: 59.99,
    originalPrice: 99.99,
    currency: "USD",
    level: "beginner",
    category: "desarrollo-web",
    tags: ["typescript", "javascript"],
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
        description: "Tipos basicos y configuracion",
        duration: 180,
        lessons: [
          { id: "les-2-1-1", title: "Introduccion a TypeScript", type: "video", duration: 15, isPreview: true },
          { id: "les-2-1-2", title: "Instalacion y configuracion", type: "video", duration: 20, isPreview: true },
        ],
      },
    ],
    features: ["36 lecciones en video HD", "Acceso de por vida", "Certificado"],
    requirements: ["Conocimientos basicos de JavaScript"],
    objectives: ["Entender el sistema de tipos", "Escribir codigo type-safe"],
  },
  {
    id: "course-3",
    slug: "diseno-ui-figma",
    title: "Diseño UI/UX con Figma",
    description: "Aprende a diseñar interfaces profesionales con Figma.",
    shortDescription: "Crea interfaces profesionales y prototipos interactivos",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
    price: 69.99,
    originalPrice: 129.99,
    currency: "USD",
    level: "beginner",
    category: "diseno",
    tags: ["figma", "ui", "ux"],
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
        description: "Conoce la herramienta",
        duration: 120,
        lessons: [
          { id: "les-3-1-1", title: "Tour por Figma", type: "video", duration: 20, isPreview: true },
          { id: "les-3-1-2", title: "Herramientas basicas", type: "video", duration: 30, isPreview: true },
        ],
      },
    ],
    features: ["32 lecciones en video HD", "Archivos de Figma incluidos"],
    requirements: ["Cuenta gratuita de Figma"],
    objectives: ["Dominar Figma", "Crear prototipos interactivos"],
  },
  {
    id: "course-4",
    slug: "marketing-digital-completo",
    title: "Marketing Digital Completo",
    description: "Aprende todas las estrategias de marketing digital.",
    shortDescription: "Domina todas las estrategias de marketing digital",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    price: 89.99,
    originalPrice: 179.99,
    currency: "USD",
    level: "intermediate",
    category: "marketing-digital",
    tags: ["marketing", "seo", "redes sociales"],
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
        description: "Conceptos clave",
        duration: 150,
        lessons: [
          { id: "les-4-1-1", title: "Ecosistema digital actual", type: "video", duration: 25, isPreview: true },
        ],
      },
    ],
    features: ["42 lecciones en video HD", "Plantillas descargables"],
    requirements: ["Conocimientos basicos de internet"],
    objectives: ["Crear estrategias de marketing", "Optimizar sitios para SEO"],
  },
  {
    id: "course-5",
    slug: "python-data-science",
    title: "Python para Data Science",
    description: "Aprende Python aplicado a ciencia de datos.",
    shortDescription: "Analisis de datos y machine learning con Python",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    price: 99.99,
    originalPrice: 199.99,
    currency: "USD",
    level: "intermediate",
    category: "data-science",
    tags: ["python", "data science", "machine learning"],
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
        description: "Fundamentos",
        duration: 200,
        lessons: [
          { id: "les-5-1-1", title: "Configuracion del entorno", type: "video", duration: 20, isPreview: true },
          { id: "les-5-1-2", title: "Numpy fundamentals", type: "video", duration: 45, isPreview: true },
        ],
      },
    ],
    features: ["52 lecciones en video HD", "Jupyter notebooks incluidos"],
    requirements: ["Conocimientos basicos de programacion"],
    objectives: ["Dominar pandas y numpy", "Implementar modelos de ML"],
  },
  {
    id: "course-6",
    slug: "nextjs-fullstack",
    title: "Next.js: Desarrollo Fullstack Moderno",
    description: "Construye aplicaciones fullstack con Next.js 14.",
    shortDescription: "Aplicaciones fullstack modernas con Next.js 14",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop",
    price: 84.99,
    originalPrice: 159.99,
    currency: "USD",
    level: "intermediate",
    category: "desarrollo-web",
    tags: ["nextjs", "react", "fullstack"],
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
        ],
      },
    ],
    features: ["45 lecciones en video HD", "Codigo fuente completo"],
    requirements: ["Conocimientos solidos de React"],
    objectives: ["Dominar Next.js 14", "Implementar Server Components"],
  },
  {
    id: "course-7",
    slug: "emprendimiento-digital",
    title: "Emprendimiento Digital: De la Idea al Negocio",
    description: "Aprende a crear y lanzar tu negocio digital.",
    shortDescription: "Lanza tu negocio digital desde cero",
    thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=450&fit=crop",
    price: 94.99,
    originalPrice: 189.99,
    currency: "USD",
    level: "beginner",
    category: "negocios",
    tags: ["emprendimiento", "startup", "negocios"],
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
        ],
      },
    ],
    features: ["38 lecciones en video HD", "Templates y frameworks"],
    requirements: ["Una idea de negocio"],
    objectives: ["Validar ideas de negocio", "Crear un modelo de negocio solido"],
  },
  {
    id: "course-8",
    slug: "ilustracion-digital",
    title: "Ilustracion Digital para Principiantes",
    description: "Aprende ilustracion digital desde cero.",
    shortDescription: "Crea ilustraciones digitales profesionales",
    thumbnail: "https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=800&h=450&fit=crop",
    price: 54.99,
    originalPrice: 109.99,
    currency: "USD",
    level: "beginner",
    category: "diseno",
    tags: ["ilustracion", "procreate", "arte digital"],
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
        description: "Herramientas basicas",
        duration: 150,
        lessons: [
          { id: "les-8-1-1", title: "Introduccion al dibujo digital", type: "video", duration: 20, isPreview: true },
        ],
      },
    ],
    features: ["28 lecciones en video HD", "Pinceles personalizados"],
    requirements: ["iPad con Procreate o computadora con Illustrator"],
    objectives: ["Dominar herramientas de ilustracion", "Crear personajes originales"],
  },
];
