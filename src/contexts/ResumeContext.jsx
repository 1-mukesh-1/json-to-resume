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

export function ResumeProvider({ children }) {
  const [currentResume, setCurrentResume] = useState(SAMPLE_DATA);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [resumeList, setResumeList] = useState([]);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_DATA, null, 2));
  const [jsonError, setJsonError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Parse and transform JSON input
  const handleJsonChange = useCallback((value) => {
    setJsonInput(value);
    try {
      const parsed = JSON.parse(value);
      const transformed = transformResumeData(parsed);
      setCurrentResume(transformed);
      setJsonError('');
      setIsDirty(true);
    } catch (err) {
      setJsonError('Invalid JSON');
    }
  }, []);

  // Update resume data from visual editor
  const handleDataChange = useCallback((data) => {
    setCurrentResume(data);
    setJsonInput(JSON.stringify(data, null, 2));
    setIsDirty(true);
  }, []);

  // Load all resumes from Supabase
  const loadResumes = useCallback(async (filters = {}) => {
    const data = await resumeService.getResumes(filters);
    setResumeList(data);
    return data;
  }, []);

  // Load single resume for editing
  const loadResume = useCallback(async (id) => {
    const data = await resumeService.getResumeById(id);
    const transformed = transformResumeData(data.resume_data);
    setCurrentResume(transformed);
    setJsonInput(JSON.stringify(transformed, null, 2));
    setCurrentResumeId(data.id);
    setIsDirty(false);
    return data;
  }, []);

  // Save current resume
  const saveResume = useCallback(async () => {
    const validation = validateForSave(currentResume);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    let result;
    if (currentResumeId) {
      result = await resumeService.updateResume(currentResumeId, currentResume);
    } else {
      result = await resumeService.createResume(currentResume);
      setCurrentResumeId(result.id);
    }
    setIsDirty(false);
    return result;
  }, [currentResume, currentResumeId]);

  // Delete resume
  const deleteResume = useCallback(async (id) => {
    await resumeService.deleteResume(id);
    setResumeList(prev => prev.filter(r => r.id !== id));
    if (currentResumeId === id) {
      setCurrentResumeId(null);
      setCurrentResume(SAMPLE_DATA);
      setJsonInput(JSON.stringify(SAMPLE_DATA, null, 2));
    }
  }, [currentResumeId]);

  // Duplicate resume
  const duplicateResume = useCallback(async (id) => {
    const result = await resumeService.duplicateResume(id);
    await loadResumes();
    return result;
  }, [loadResumes]);

  // Update status
  const updateStatus = useCallback(async (id, status) => {
    const appliedDate = status === 'applied' ? new Date().toISOString().split('T')[0] : null;
    const result = await resumeService.updateResumeStatus(id, status, appliedDate);
    setResumeList(prev => prev.map(r => r.id === id ? result : r));
    return result;
  }, []);

  // Create new resume
  const newResume = useCallback(() => {
    setCurrentResume(SAMPLE_DATA);
    setJsonInput(JSON.stringify(SAMPLE_DATA, null, 2));
    setCurrentResumeId(null);
    setIsDirty(false);
  }, []);

  return (
    <ResumeContext.Provider value={{
      currentResume, setCurrentResume,
      currentResumeId, setCurrentResumeId,
      resumeList, setResumeList,
      jsonInput, jsonError,
      isDirty,
      handleJsonChange,
      handleDataChange,
      loadResumes,
      loadResume,
      saveResume,
      deleteResume,
      duplicateResume,
      updateStatus,
      newResume
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);