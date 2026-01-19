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

// Page size configurations
export const PAGE_SIZES = {
  letter: {
    name: 'US Letter',
    width: 8.5,    // inches
    height: 11,    // inches
    widthPt: 612,  // points (72 per inch)
    heightPt: 792,
  },
  a4: {
    name: 'A4',
    width: 8.27,   // inches (210mm)
    height: 11.69, // inches (297mm)
    widthPt: 595,
    heightPt: 842,
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
