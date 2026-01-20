export const RESUME_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
  { value: 'screening', label: 'Screening', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'interviewing', label: 'Interviewing', color: 'bg-purple-100 text-purple-700' },
  { value: 'offer', label: 'Offer', color: 'bg-green-100 text-green-700' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'bg-orange-100 text-orange-700' },
  { value: 'accepted', label: 'Accepted', color: 'bg-emerald-100 text-emerald-700' }
];

export const DEFAULT_SECTION_ORDER = [
  'summary', 'technical_skills', 'work_experience', 'projects', 'education', 'achievements'
];

export const DEFAULT_SECTION_VISIBILITY = {
  summary: true,
  technical_skills: true,
  work_experience: true,
  projects: true,
  education: true,
  achievements: true
};

export const SECTION_LABELS = {
  summary: 'Professional Summary',
  technical_skills: 'Technical Skills',
  work_experience: 'Work Experience',
  projects: 'Projects',
  education: 'Education',
  achievements: 'Achievements'
};

// Page size configurations
// Standard paper sizes verified:
// US Letter: 8.5" × 11" (215.9mm × 279.4mm) - wider, shorter
// A4: 8.27" × 11.69" (210mm × 297mm) - narrower, taller
export const PAGE_SIZES = {
  letter: {
    name: 'US Letter',
    width: 8.5,
    height: 11,
    widthPt: 612,   // 8.5 × 72
    heightPt: 792,  // 11 × 72
    dimensions: '8.5" × 11" (216 × 279 mm)'
  },
  a4: {
    name: 'A4',
    width: 8.27,
    height: 11.69,
    widthPt: 595,   // 8.27 × 72
    heightPt: 842,  // 11.69 × 72
    dimensions: '210 × 297 mm (8.3" × 11.7")'
  }
};

export const DEFAULT_CONFIG = {
  pageSize: 'letter',
  fontFamily: 'Arial',
  fontSize: { name: 20, contact: 11, sectionTitle: 12, subheader: 11, body: 10 },
  margins: 0.5,
  lineHeight: 1.35,
  sectionSpacing: 10,
  bulletSpacing: 2,
  colors: { text: '#000000', border: '#000000' },
  flattenSkills: false
};

export const FONT_OPTIONS = [
  'Arial', 'Calibri', 'Georgia', 'Times New Roman', 
  'Helvetica', 'Verdana', 'Garamond', 'Cambria'
];

// PDF Font mapping (for @react-pdf/renderer)
export const PDF_FONTS = {
  'Arial': 'Helvetica',
  'Calibri': 'Helvetica',
  'Helvetica': 'Helvetica',
  'Verdana': 'Helvetica',
  'Georgia': 'Times-Roman',
  'Times New Roman': 'Times-Roman',
  'Garamond': 'Times-Roman',
  'Cambria': 'Times-Roman'
};
