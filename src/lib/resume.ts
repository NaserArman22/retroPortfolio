// All resume content lives here. Every window and the print layout read from these exports,
// so updating the site for a new resume only means rewriting the values below.

export interface Profile {
  name: string;
  /** Lowercase handle used in the shell prompt, e.g. `arman@os:~$`. */
  handle: string;
  title: string;
  /** One sentence, ≤ 20 words. */
  tagline: string;
  location: string;
  summary: string;
  /** Spoken languages. */
  languages: string[];
}

export interface Job {
  role: string;
  company: string;
  period: string;
  bullets: string[];
  tech: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Education {
  school: string;
  degree: string;
  year: string;
  detail?: string;
}

export interface Honor {
  title: string;
  period?: string;
  detail?: string;
}

export interface Project {
  name: string;
  period: string;
  description: string;
  tech: string[];
  link?: { label: string; href: string };
}

export interface Volunteering {
  org: string;
  description: string;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export const profile: Profile = {
  name: 'Abu Naser MD. Arman',
  handle: 'arman',
  title: 'Junior Software Engineer',
  tagline:
    'Full stack engineer building FinTech and core banking systems with Spring Boot microservices and Angular.',
  location: 'Dhaka, Bangladesh',
  summary:
    'Currently developing core loan banking modules — loan product configuration, credit line setup and loan account opening — across backend and frontend. Designs clean backend systems (SOLID, layered architecture, DTO/CQRS patterns) and data-driven frontends, with hands-on domain knowledge of core banking operations. Experienced with event-driven pipelines, third-party integrations, database optimization and cross-functional teams.',
  languages: ['English (Professional Working Proficiency)', 'Bangla (Native)'],
};

export const experience: Job[] = [
  {
    role: 'Junior Software Engineer',
    company: 'LEADS Corporation Limited',
    period: 'Jan 2026 – Present',
    bullets: [
      'Designed and developed core loan banking modules — loan product configuration, credit line setup and loan account opening — for the CredGen Loan Origination System using Spring Boot microservices.',
      'Modeled the loan account lifecycle (product-to-account linkage, credit line allocation, status transitions) from hands-on lending domain knowledge, reducing rework from misaligned requirements.',
      'Applied layered architecture (Controller → Service → Repository) and CQRS-style DTO command/query flows; refactored repeated conversion logic into reusable DI-based Mapper components; used Spring Data JPA composite keys for complex financial models.',
      'Improved API reliability by resolving ambiguous route mappings and standardizing REST endpoints; structured product configuration aggregation into scalable service logic.',
      'Built the Angular frontend (Standalone Components, Signals, Reactive Forms): dynamic UI for repayment schedules, interest/profit and penalties, real-time grids for charges, GL mappings and repayment structures, and custom DTO/JSON mapping for nested payloads.',
    ],
    tech: [
      'Java',
      'Spring Boot',
      'Microservices',
      'Oracle',
      'Spring Data JPA',
      'Angular',
      'TypeScript',
      'Tailwind CSS',
    ],
  },
  {
    role: 'Junior Full Stack Developer',
    company: 'Workspace Infotech Limited',
    period: 'Apr 2025 – Dec 2025',
    bullets: [
      'Built scalable, event-driven Python APIs; optimized Django ORM queries (60% fewer queries, 40% faster responses) and PostgreSQL queries (420ms → 190ms).',
      'Integrated Vultr and UpCloud APIs with unified data models and real-time availability validation; enriched UpCloud data with local records, cutting frontend API calls by 50%.',
      'Implemented Firebase FCM notifications (50% less processing time), signal-based logging, RabbitMQ messaging and event-driven workflows.',
      'Built a bulk CSV import with transaction management and atomic rollback for 10,000+ records, ETL scripts for validation, duplicate detection and batch processing, and faster Docker builds via layer caching and pip cache mounts.',
      'Created a medicine-detection pipeline with YOLO, CLIP embeddings and Streamlit: adaptive thresholding for real-time inference, a 4-variant parallel preprocessing pipeline (+25% OCR accuracy) and singleton ML model loading (40% faster responses).',
    ],
    tech: ['Python', 'Django', 'DRF', 'Streamlit', 'PostgreSQL', 'RabbitMQ', 'Firebase', 'Git'],
  },
  {
    role: 'Web Development Intern',
    company: 'Smile Care BD',
    period: 'Feb 2025 – Mar 2025',
    bullets: [
      'Built a dynamic CMS with Laravel and MySQL serving 10k+ monthly visitors.',
      'Built an admin panel with authentication and CRUD operations.',
      'Collaborated with non-technical stakeholders to keep release cycles smooth.',
    ],
    tech: ['PHP', 'Laravel', 'MySQL'],
  },
];

export const projects: Project[] = [
  {
    name: 'MusicPlaylist (API)',
    period: 'Jan 2025',
    description:
      'RESTful API for managing playlists, built with a layered architecture following SOLID principles.',
    tech: ['.NET MVC', 'Web API', 'Postman'],
    link: {
      label: 'github.com/NaserArman22/MusicPlaylist',
      href: 'https://github.com/NaserArman22/MusicPlaylist',
    },
  },
];

export const skills: SkillGroup[] = [
  { label: 'Languages', items: ['Java', 'Python', 'TypeScript', 'JavaScript', 'C++', 'C#', 'PHP'] },
  { label: 'Backend', items: ['Spring Boot', 'Django', 'DRF', 'Microservices', 'REST APIs'] },
  { label: 'Frontend', items: ['Angular (Signals, Standalone)', 'Next.js', 'Tailwind CSS'] },
  { label: 'Databases', items: ['Oracle', 'PostgreSQL', 'MySQL', 'SQL Server'] },
  {
    label: 'Tools & Concepts',
    items: ['Git', 'Postman', 'Firebase', 'RabbitMQ', 'SOLID', 'CQRS'],
  },
];

export const education: Education = {
  school: 'American International University-Bangladesh (AIUB)',
  degree: 'BSc in Computer Science and Engineering (CSE)',
  year: '2025',
  detail: 'CGPA 3.87 / 4.00',
};

export const honors: Honor[] = [
  { title: 'Second Highest Academic Distinction (Cum Laude)', detail: 'AIUB' },
  { title: 'Academic Scholarship Recipient', period: '2022 – 2025' },
  { title: "Dean's List", detail: '4+ times' },
];

export const volunteering: Volunteering[] = [
  {
    org: 'AIUB Volunteer Unit',
    description: 'Assisted with convocation, admissions and international conferences.',
  },
  {
    org: 'AIUB Social Welfare Club (Shomoy)',
    description: 'Organized national charity and relief programs.',
  },
];

export const contacts: ContactLink[] = [
  { label: 'EMAIL', value: 'mdnaserarman57@gmail.com', href: 'mailto:mdnaserarman57@gmail.com' },
  { label: 'PHONE', value: '+880 1877 348817', href: 'tel:+8801877348817' },
  {
    label: 'GITHUB',
    value: 'github.com/NaserArman22',
    href: 'https://github.com/NaserArman22',
  },
];
