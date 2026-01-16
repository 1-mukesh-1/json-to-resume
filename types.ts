export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  location?: string;
}

export interface Education {
  degree: string;
  major: string;
  institution: string;
  location: string;
  graduation_date: string;
  gpa?: string;
  honors?: string[];
  relevant_coursework?: string[];
}

export interface TechnicalSkills {
  languages?: string[];
  frameworks?: string[];
  databases?: string[];
  cloud?: string[];
  tools?: string[];
}

export interface WorkExperience {
  job_title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

export interface Project {
  name: string;
  associated_with?: string;
  dates: string;
  link?: string;
  bullets: string[];
}

export interface ResumeData {
  personal_info: PersonalInfo;
  summary: string;
  education: Education[];
  technical_skills: TechnicalSkills;
  work_experience: WorkExperience[];
  projects: Project[];
  achievements: string[];
}
