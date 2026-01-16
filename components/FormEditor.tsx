import React, { useState } from 'react';
import { ResumeData, WorkExperience, Education, Project } from '../types';
import { ChevronDown, ChevronUp, Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface FormEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  sectionOrder: string[];
  onOrderChange: (order: string[]) => void;
}

const SECTION_LABELS: Record<string, string> = {
  personal_info: 'Personal Information',
  summary: 'Professional Summary',
  work_experience: 'Work Experience',
  education: 'Education',
  projects: 'Projects',
  technical_skills: 'Technical Skills',
  achievements: 'Key Achievements'
};

const FormEditor: React.FC<FormEditorProps> = ({ data, onChange, sectionOrder, onOrderChange }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal_info: true,
    summary: true,
    work_experience: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (section: keyof ResumeData, value: any) => {
    onChange({ ...data, [section]: value });
  };

  const handleDeepChange = (section: keyof ResumeData, index: number | null, field: string, value: any) => {
    if (index === null) {
      // For object sections like personal_info
      handleChange(section, { ...(data[section] as any), [field]: value });
    } else if (Array.isArray(data[section])) {
      // For array sections
      const newArray = [...(data[section] as any[])];
      if (field === 'bullets') {
          // Special handling for bullets if we want to pass them as array
          // But here value assumes passed from input as array or handled in sub-component
      }
      newArray[index] = { ...newArray[index], [field]: value };
      handleChange(section, newArray);
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    onOrderChange(newOrder);
  };

  const addItem = (section: 'work_experience' | 'education' | 'projects' | 'achievements') => {
      let newItem;
      if (section === 'work_experience') {
          newItem = { job_title: 'New Role', company: 'Company', location: 'City, State', dates: 'Date - Date', bullets: ['New bullet point'] };
      } else if (section === 'education') {
          newItem = { degree: 'Degree', major: 'Major', institution: 'University', location: 'City, State', graduation_date: 'Date', gpa: '', honors: [], relevant_coursework: [] };
      } else if (section === 'projects') {
          newItem = { name: 'New Project', dates: 'Date', bullets: ['Project detail'] };
      } else if (section === 'achievements') {
          handleChange('achievements', [...(data.achievements || []), "New Achievement"]);
          return;
      }
      
      if (newItem) {
          handleChange(section, [...(data[section] as any[]), newItem]);
      }
  };

  const removeItem = (section: keyof ResumeData, index: number) => {
      const newArray = [...(data[section] as any[])];
      newArray.splice(index, 1);
      handleChange(section, newArray);
  };

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-4">
      {/* Reorderable Section List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
            Section Ordering
        </div>
        <div className="p-2 space-y-1">
            {sectionOrder.map((key, index) => (
                <div key={key} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">{SECTION_LABELS[key] || key}</span>
                    <div className="flex gap-1">
                        <button 
                            onClick={() => moveSection(index, 'up')} 
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 text-gray-600"
                        >
                            <ArrowUp size={14} />
                        </button>
                        <button 
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === sectionOrder.length - 1} 
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 text-gray-600"
                        >
                            <ArrowDown size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <button 
            onClick={() => toggleSection('personal_info')}
            className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition-colors"
        >
            <span className="font-medium text-gray-800">Personal Information</span>
            {openSections['personal_info'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections['personal_info'] && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" value={data.personal_info.name} onChange={(v) => handleDeepChange('personal_info', null, 'name', v)} />
                <Input label="Email" value={data.personal_info.email} onChange={(v) => handleDeepChange('personal_info', null, 'email', v)} />
                <Input label="Phone" value={data.personal_info.phone} onChange={(v) => handleDeepChange('personal_info', null, 'phone', v)} />
                <Input label="Location" value={data.personal_info.location || ''} onChange={(v) => handleDeepChange('personal_info', null, 'location', v)} />
                <Input label="LinkedIn (URL)" value={data.personal_info.linkedin || ''} onChange={(v) => handleDeepChange('personal_info', null, 'linkedin', v)} />
                <Input label="GitHub (URL)" value={data.personal_info.github || ''} onChange={(v) => handleDeepChange('personal_info', null, 'github', v)} />
                <Input label="Portfolio (URL)" value={data.personal_info.portfolio || ''} onChange={(v) => handleDeepChange('personal_info', null, 'portfolio', v)} />
            </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
         <button 
            onClick={() => toggleSection('summary')}
            className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition-colors"
        >
            <span className="font-medium text-gray-800">Professional Summary</span>
            {openSections['summary'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections['summary'] && (
             <div className="p-4">
                 <textarea 
                    value={data.summary}
                    onChange={(e) => handleChange('summary', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm min-h-[100px] focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Brief professional summary..."
                 />
             </div>
        )}
      </div>

      {/* Work Experience */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
             <button onClick={() => toggleSection('work_experience')} className="flex-1 text-left font-medium text-gray-800 flex items-center justify-between">
                Work Experience
                {openSections['work_experience'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
             </button>
        </div>
        {openSections['work_experience'] && (
            <div className="p-4 space-y-6">
                {data.work_experience.map((job, idx) => (
                    <div key={idx} className="relative p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                        <button onClick={() => removeItem('work_experience', idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                            <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                             <Input label="Company" value={job.company} onChange={(v) => handleDeepChange('work_experience', idx, 'company', v)} />
                             <Input label="Job Title" value={job.job_title} onChange={(v) => handleDeepChange('work_experience', idx, 'job_title', v)} />
                             <Input label="Location" value={job.location} onChange={(v) => handleDeepChange('work_experience', idx, 'location', v)} />
                             <Input label="Dates" value={job.dates} onChange={(v) => handleDeepChange('work_experience', idx, 'dates', v)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600">Bullets (One per line)</label>
                            <textarea 
                                value={job.bullets.join('\n')}
                                onChange={(e) => handleDeepChange('work_experience', idx, 'bullets', e.target.value.split('\n'))}
                                className="w-full p-2 border border-gray-300 rounded text-sm min-h-[80px] focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                ))}
                <button 
                    onClick={() => addItem('work_experience')}
                    className="w-full py-2 flex items-center justify-center gap-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm font-medium"
                >
                    <Plus size={14} /> Add Experience
                </button>
            </div>
        )}
      </div>

      {/* Projects */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
             <button onClick={() => toggleSection('projects')} className="flex-1 text-left font-medium text-gray-800 flex items-center justify-between">
                Projects
                {openSections['projects'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
             </button>
        </div>
        {openSections['projects'] && (
            <div className="p-4 space-y-6">
                {data.projects.map((proj, idx) => (
                    <div key={idx} className="relative p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                        <button onClick={() => removeItem('projects', idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                            <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                             <Input label="Project Name" value={proj.name} onChange={(v) => handleDeepChange('projects', idx, 'name', v)} />
                             <Input label="Dates" value={proj.dates} onChange={(v) => handleDeepChange('projects', idx, 'dates', v)} />
                             <Input label="Link" value={proj.link || ''} onChange={(v) => handleDeepChange('projects', idx, 'link', v)} />
                             <Input label="Association" value={proj.associated_with || ''} onChange={(v) => handleDeepChange('projects', idx, 'associated_with', v)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600">Bullets (One per line)</label>
                            <textarea 
                                value={proj.bullets.join('\n')}
                                onChange={(e) => handleDeepChange('projects', idx, 'bullets', e.target.value.split('\n'))}
                                className="w-full p-2 border border-gray-300 rounded text-sm min-h-[80px] focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                ))}
                <button 
                    onClick={() => addItem('projects')}
                    className="w-full py-2 flex items-center justify-center gap-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm font-medium"
                >
                    <Plus size={14} /> Add Project
                </button>
            </div>
        )}
      </div>

       {/* Education */}
       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
             <button onClick={() => toggleSection('education')} className="flex-1 text-left font-medium text-gray-800 flex items-center justify-between">
                Education
                {openSections['education'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
             </button>
        </div>
        {openSections['education'] && (
            <div className="p-4 space-y-6">
                {data.education.map((edu, idx) => (
                    <div key={idx} className="relative p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                        <button onClick={() => removeItem('education', idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                            <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                             <Input label="Institution" value={edu.institution} onChange={(v) => handleDeepChange('education', idx, 'institution', v)} />
                             <Input label="Degree" value={edu.degree} onChange={(v) => handleDeepChange('education', idx, 'degree', v)} />
                             <Input label="Major" value={edu.major} onChange={(v) => handleDeepChange('education', idx, 'major', v)} />
                             <Input label="Location" value={edu.location} onChange={(v) => handleDeepChange('education', idx, 'location', v)} />
                             <Input label="Graduation Date" value={edu.graduation_date} onChange={(v) => handleDeepChange('education', idx, 'graduation_date', v)} />
                             <Input label="GPA" value={edu.gpa || ''} onChange={(v) => handleDeepChange('education', idx, 'gpa', v)} />
                        </div>
                    </div>
                ))}
                <button 
                    onClick={() => addItem('education')}
                    className="w-full py-2 flex items-center justify-center gap-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm font-medium"
                >
                    <Plus size={14} /> Add Education
                </button>
            </div>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
             <button onClick={() => toggleSection('technical_skills')} className="flex-1 text-left font-medium text-gray-800 flex items-center justify-between">
                Technical Skills
                {openSections['technical_skills'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
             </button>
        </div>
        {openSections['technical_skills'] && (
            <div className="p-4 space-y-4">
                 <div className="text-xs text-gray-500 mb-2">Comma separated values</div>
                 {['languages', 'frameworks', 'databases', 'cloud', 'tools'].map(cat => (
                     <Input 
                        key={cat}
                        label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                        value={(data.technical_skills as any)[cat]?.join(', ') || ''}
                        onChange={(v) => {
                             const arr = v.split(',').map((s: string) => s.trim()).filter(Boolean);
                             handleChange('technical_skills', { ...data.technical_skills, [cat]: arr });
                        }}
                     />
                 ))}
            </div>
        )}
      </div>
      
       {/* Achievements */}
       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
             <button onClick={() => toggleSection('achievements')} className="flex-1 text-left font-medium text-gray-800 flex items-center justify-between">
                Achievements
                {openSections['achievements'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
             </button>
        </div>
        {openSections['achievements'] && (
            <div className="p-4 space-y-2">
                 {data.achievements?.map((ach, idx) => (
                     <div key={idx} className="flex gap-2">
                         <input 
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                            value={ach}
                            onChange={(e) => {
                                const newAch = [...(data.achievements || [])];
                                newAch[idx] = e.target.value;
                                handleChange('achievements', newAch);
                            }}
                         />
                         <button onClick={() => removeItem('achievements', idx)} className="text-gray-400 hover:text-red-500">
                             <Trash2 size={16} />
                         </button>
                     </div>
                 ))}
                  <button 
                    onClick={() => addItem('achievements')}
                    className="w-full py-2 flex items-center justify-center gap-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm font-medium"
                >
                    <Plus size={14} /> Add Achievement
                </button>
            </div>
        )}
      </div>

    </div>
  );
};

const Input = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
        <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
        />
    </div>
);

export default FormEditor;