import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import * as resumeService from '../services/resumeService';
import { transformResumeData, validateForSave, injectResumeConfig } from '../utils/schemaTransform';

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

// Autosave delay in milliseconds
const AUTOSAVE_DELAY = 3000;

export function ResumeProvider({ children }) {
  const [currentResume, setCurrentResume] = useState(SAMPLE_DATA);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [resumeList, setResumeList] = useState([]);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_DATA, null, 2));
  const [jsonError, setJsonError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  
  // Refs for autosave
  const autosaveTimeoutRef = useRef(null);
  const currentResumeRef = useRef(currentResume);
  const currentResumeIdRef = useRef(currentResumeId);
  
  // Callback to get current config (set by BuilderPage)
  const getConfigRef = useRef(null);
  
  // Keep refs in sync
  useEffect(() => {
    currentResumeRef.current = currentResume;
  }, [currentResume]);
  
  useEffect(() => {
    currentResumeIdRef.current = currentResumeId;
  }, [currentResumeId]);

  // Set config getter callback
  const setConfigGetter = useCallback((getter) => {
    getConfigRef.current = getter;
  }, []);

  // Autosave function
  const performAutosave = useCallback(async () => {
    const resume = currentResumeRef.current;
    const resumeId = currentResumeIdRef.current;
    
    const validation = validateForSave(resume);
    if (!validation.valid) {
      // Don't autosave if validation fails
      return;
    }

    // Inject config if available
    let dataToSave = resume;
    if (getConfigRef.current) {
      const { config, sectionOrder, sectionVisibility } = getConfigRef.current();
      dataToSave = injectResumeConfig(resume, config, sectionOrder, sectionVisibility);
    }

    setAutoSaveStatus('saving');
    
    try {
      let result;
      if (resumeId) {
        result = await resumeService.updateResume(resumeId, dataToSave);
      } else {
        result = await resumeService.createResume(dataToSave);
        setCurrentResumeId(result.id);
      }
      setIsDirty(false);
      setAutoSaveStatus('saved');
      
      // Reset to idle after showing "saved" for a moment
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Autosave failed:', err);
      setAutoSaveStatus('error');
      // Reset to idle after showing error
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    }
  }, []);

  // Schedule autosave when content changes
  const scheduleAutosave = useCallback(() => {
    // Clear any existing timeout
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    
    // Schedule new autosave
    autosaveTimeoutRef.current = setTimeout(() => {
      performAutosave();
    }, AUTOSAVE_DELAY);
  }, [performAutosave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  // Parse and transform JSON input
  const handleJsonChange = useCallback((value) => {
    setJsonInput(value);
    try {
      const parsed = JSON.parse(value);
      const transformed = transformResumeData(parsed);
      setCurrentResume(transformed);
      setJsonError('');
      setIsDirty(true);
      scheduleAutosave();
    } catch (err) {
      setJsonError('Invalid JSON');
    }
  }, [scheduleAutosave]);

  // Update resume data from visual editor
  const handleDataChange = useCallback((data) => {
    setCurrentResume(data);
    setJsonInput(JSON.stringify(data, null, 2));
    setIsDirty(true);
    scheduleAutosave();
  }, [scheduleAutosave]);

  // Load all resumes from Supabase
  const loadResumes = useCallback(async (filters = {}) => {
    const data = await resumeService.getResumes(filters);
    setResumeList(data);
    return data;
  }, []);

  // Load single resume for editing (callback to load config provided externally)
  const loadResume = useCallback(async (id, loadConfigCallback) => {
    // Cancel any pending autosave
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    
    const data = await resumeService.getResumeById(id);
    const transformed = transformResumeData(data.resume_data);
    setCurrentResume(transformed);
    setJsonInput(JSON.stringify(transformed, null, 2));
    setCurrentResumeId(data.id);
    setIsDirty(false);
    setAutoSaveStatus('idle');
    
    // Load config if available
    if (loadConfigCallback && data.resume_data?.resume_config) {
      loadConfigCallback(data.resume_data.resume_config);
    }
    
    return data;
  }, []);

  // Save current resume (manual save)
  const saveResume = useCallback(async () => {
    // Cancel any pending autosave
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    
    const validation = validateForSave(currentResume);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Inject config if available
    let dataToSave = currentResume;
    if (getConfigRef.current) {
      const { config, sectionOrder, sectionVisibility } = getConfigRef.current();
      dataToSave = injectResumeConfig(currentResume, config, sectionOrder, sectionVisibility);
    }

    let result;
    if (currentResumeId) {
      result = await resumeService.updateResume(currentResumeId, dataToSave);
    } else {
      result = await resumeService.createResume(dataToSave);
      setCurrentResumeId(result.id);
    }
    setIsDirty(false);
    setAutoSaveStatus('saved');
    setTimeout(() => setAutoSaveStatus('idle'), 2000);
    return result;
  }, [currentResume, currentResumeId]);

  // Delete resume
  const deleteResume = useCallback(async (id) => {
    await resumeService.deleteResume(id);
    setResumeList(prev => prev.filter(r => r.id !== id));
    if (currentResumeId === id) {
      // Cancel any pending autosave
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
      setCurrentResumeId(null);
      setCurrentResume(SAMPLE_DATA);
      setJsonInput(JSON.stringify(SAMPLE_DATA, null, 2));
      setIsDirty(false);
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
    // Cancel any pending autosave
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    
    setCurrentResume(SAMPLE_DATA);
    setJsonInput(JSON.stringify(SAMPLE_DATA, null, 2));
    setCurrentResumeId(null);
    setIsDirty(false);
    setAutoSaveStatus('idle');
  }, []);

  return (
    <ResumeContext.Provider value={{
      currentResume, setCurrentResume,
      currentResumeId, setCurrentResumeId,
      resumeList, setResumeList,
      jsonInput, jsonError,
      isDirty,
      autoSaveStatus,
      handleJsonChange,
      handleDataChange,
      loadResumes,
      loadResume,
      saveResume,
      deleteResume,
      duplicateResume,
      updateStatus,
      newResume,
      setConfigGetter
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);
