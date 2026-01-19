import React, { createContext, useContext, useState, useCallback } from 'react';
import * as resumeService from '../services/resumeService';
import { transformResumeData, validateForSave } from '../utils/schemaTransform';

const ResumeContext = createContext();

const SAMPLE_DATA = {
  job_metadata: {
    company: "Sample Company",
    role: "Software Engineer",
    location: "San Francisco, CA",
    job_type: "full-time",
    jd_url: null,
    generated_at: new Date().toISOString()
  },
  personal_info: { 
    name: "Alex Sterling", 
    email: "alex.sterling@example.com", 
    phone: "(555) 123-4567", 
    linkedin: "linkedin.com/in/alexsterling", 
    github: "github.com/alexsterling", 
    portfolio: "alexsterling.dev", 
    location: "San Francisco, CA" 
  },
  summary: "Senior Frontend Engineer with 7+ years of experience building performant, scalable web applications.",
  education: [{ 
    degree: "Bachelor of Science in Computer Science", 
    institution: "Stanford University", 
    location: "Stanford, CA", 
    dates: "June 2017", 
    gpa: "3.9", 
    honors: ["Phi Beta Kappa"],
    coursework: "Data Structures, Algorithms, Machine Learning"
  }],
  technical_skills: { 
    languages: ["TypeScript", "JavaScript", "Python"], 
    frameworks: ["React", "Next.js", "Tailwind CSS"], 
    databases: ["PostgreSQL", "Redis"], 
    cloud: ["AWS", "Docker"], 
    tools: ["Git", "Vite", "Figma"] 
  },
  work_experience: [
    { 
      job_title: "Senior Frontend Engineer", 
      company: "InnovateTech", 
      location: "San Francisco, CA", 
      dates: "August 2021 - Present", 
      bullets: [
        "Architected micro-frontend framework, reducing build times by 60%", 
        "Led team of 6 engineers rebuilding customer dashboard"
      ] 
    }
  ],
  projects: [{ 
    name: "React Performance Monitor", 
    associated_with: "Open Source", 
    dates: "2023", 
    link: "github.com/alexsterling/rpm", 
    bullets: ["Created lightweight React component for performance monitoring", "1.2k+ GitHub stars"] 
  }],
  achievements: ["Speaker at React Summit 2023", "Winner of 2022 Global Hackathon"]
};
