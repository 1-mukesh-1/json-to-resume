import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';
import { useConfig } from '../../contexts/ConfigContext';

const AutoTextarea = forwardRef(({ value, onChange, placeholder, className = '', minRows = 1 }, ref) => {
  const internalRef = useRef(null);
  const textareaRef = ref || internalRef;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={minRows}
      className={`w-full p-2 border rounded-lg text-sm resize-none overflow-hidden focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
});
AutoTextarea.displayName = 'AutoTextarea';

function BulletListEditor({ bullets = [], onChange, placeholder = '' }) {
  const inputRefs = useRef([]);
  const [hiddenBullets, setHiddenBullets] = useState({});

  const handleChange = (index, value) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    onChange(newBullets);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newBullets = [...bullets];
      newBullets.splice(index + 1, 0, '');
      onChange(newBullets);
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 10);
    } else if (e.key === 'Backspace' && bullets[index] === '' && bullets.length > 1) {
      e.preventDefault();
      onChange(bullets.filter((_, i) => i !== index));
      setTimeout(() => inputRefs.current[Math.max(0, index - 1)]?.focus(), 10);
    }
  };

  const removeBullet = (index) => {
    if (bullets.length > 1) {
      onChange(bullets.filter((_, i) => i !== index));
    } else {
      onChange(['']);
    }
  };

  const toggleVisibility = (index) => {
    setHiddenBullets(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const displayBullets = bullets.length === 0 ? [''] : bullets;

  return (
    <div className="space-y-2">
      {displayBullets.map((bullet, index) => {
        const isHidden = hiddenBullets[index];
        return (
          <div key={index} className={`flex items-start gap-1 group ${isHidden ? 'opacity-40' : ''}`}>
            <span className="text-gray-400 pt-2.5 text-sm">•</span>
            <AutoTextarea
              ref={el => inputRefs.current[index] = el}
              value={bullet}
              onChange={v => handleChange(index, v)}
              onKeyDown={e => handleKeyDown(e, index)}
              placeholder={placeholder}
              className="flex-1 min-h-[38px]"
            />
            <div className="flex items-center gap-0.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => toggleVisibility(index)}
                className={`p-1.5 rounded ${isHidden ? 'text-gray-400 hover:bg-gray-100' : 'text-blue-500 hover:bg-blue-50'}`}
                title={isHidden ? 'Show' : 'Hide'}
                type="button"
              >
                {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={() => removeBullet(index)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                title="Delete"
                type="button"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
      <button
        onClick={() => onChange([...bullets, ''])}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 py-1.5 px-2 hover:bg-blue-50 rounded"
        type="button"
      >
        <Plus size={14} />
        Add bullet
      </button>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder = '', onDelete }) {
  const [isHidden, setIsHidden] = useState(false);
  
  return (
    <div className={`group ${isHidden ? 'opacity-40' : ''}`}>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-medium text-gray-600">{label}</label>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsHidden(!isHidden)}
            className={`p-1 rounded ${isHidden ? 'text-gray-400 hover:bg-gray-100' : 'text-blue-500 hover:bg-blue-50'}`}
            title={isHidden ? 'Show' : 'Hide'}
            type="button"
          >
            {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
              title="Delete"
              type="button"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
      {type === 'textarea' ? (
        <AutoTextarea value={value} onChange={onChange} placeholder={placeholder} />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
}

function Section({ id, title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { sectionVisibility, toggleSectionVisibility } = useConfig();
  const isVisible = sectionVisibility[id] !== false;

  return (
    <div className={`border rounded-lg mb-3 bg-white shadow-sm ${!isVisible ? 'opacity-40' : ''}`}>
      <div className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
        <span className="flex-1 font-semibold text-gray-700 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {title}
        </span>
        <div className="flex items-center gap-1">
          {id && (
            <button
              onClick={() => toggleSectionVisibility(id)}
              className={`p-1.5 rounded ${isVisible ? 'text-blue-500 hover:bg-blue-100' : 'text-gray-400 hover:bg-gray-200'}`}
              title={isVisible ? 'Hide section' : 'Show section'}
              type="button"
            >
              {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-gray-200 rounded">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>
      {isOpen && <div className="p-4 border-t">{children}</div>}
    </div>
  );
}

function EntryCard({ children, onDelete, title }) {
  const [isHidden, setIsHidden] = useState(false);
  
  return (
    <div className={`border rounded-lg p-4 mb-3 bg-gray-50 relative group ${isHidden ? 'opacity-40' : ''}`}>
      {title && <div className="text-sm font-medium text-gray-700 mb-3 pr-16">{title}</div>}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIsHidden(!isHidden)}
          className={`p-1.5 rounded ${isHidden ? 'text-gray-400 hover:bg-gray-200' : 'text-blue-500 hover:bg-blue-100'}`}
          title={isHidden ? 'Show' : 'Hide'}
          type="button"
        >
          {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <button 
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
          title="Delete"
          type="button"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {children}
    </div>
  );
}

export function VisualEditor() {
  const { currentResume, handleDataChange } = useResume();
  const { sectionOrder } = useConfig();

  const update = (section, value) => handleDataChange({ ...currentResume, [section]: value });
  
  const updateNested = (section, idx, field, val) => {
    if (idx === null) {
      update(section, { ...currentResume[section], [field]: val });
    } else { 
      const arr = [...currentResume[section]]; 
      arr[idx] = { ...arr[idx], [field]: val }; 
      update(section, arr); 
    }
  };

  const deleteField = (section, field) => {
    const newSection = { ...currentResume[section] };
    delete newSection[field];
    update(section, newSection);
  };

  const data = currentResume;

  return (
    <div className="h-full overflow-y-auto space-y-1">
      {/* Job Metadata */}
      <Section id="job_metadata" title="Job Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Company" value={data.job_metadata?.company} onChange={v => updateNested('job_metadata', null, 'company', v)} placeholder="Company" onDelete={() => deleteField('job_metadata', 'company')} />
          <Field label="Role" value={data.job_metadata?.role} onChange={v => updateNested('job_metadata', null, 'role', v)} placeholder="Job title" onDelete={() => deleteField('job_metadata', 'role')} />
          <Field label="Location" value={data.job_metadata?.location} onChange={v => updateNested('job_metadata', null, 'location', v)} placeholder="City, State" onDelete={() => deleteField('job_metadata', 'location')} />
          <Field label="Job Type" value={data.job_metadata?.job_type} onChange={v => updateNested('job_metadata', null, 'job_type', v)} placeholder="Full-time" onDelete={() => deleteField('job_metadata', 'job_type')} />
        </div>
        <div className="mt-3">
          <Field label="Job URL" value={data.job_metadata?.jd_url} onChange={v => updateNested('job_metadata', null, 'jd_url', v)} placeholder="https://..." onDelete={() => deleteField('job_metadata', 'jd_url')} />
        </div>
      </Section>

      {/* Personal Info */}
      <Section id="personal_info" title="Personal Information" defaultOpen={true}>
        <div className="space-y-3">
          <Field label="Full Name" value={data.personal_info?.name} onChange={v => updateNested('personal_info', null, 'name', v)} placeholder="John Doe" onDelete={() => deleteField('personal_info', 'name')} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" value={data.personal_info?.email} onChange={v => updateNested('personal_info', null, 'email', v)} placeholder="john@example.com" onDelete={() => deleteField('personal_info', 'email')} />
            <Field label="Phone" value={data.personal_info?.phone} onChange={v => updateNested('personal_info', null, 'phone', v)} placeholder="(555) 123-4567" onDelete={() => deleteField('personal_info', 'phone')} />
          </div>
          <Field label="Location" value={data.personal_info?.location} onChange={v => updateNested('personal_info', null, 'location', v)} placeholder="San Francisco, CA" onDelete={() => deleteField('personal_info', 'location')} />
          <Field label="LinkedIn" value={data.personal_info?.linkedin} onChange={v => updateNested('personal_info', null, 'linkedin', v)} placeholder="linkedin.com/in/johndoe" onDelete={() => deleteField('personal_info', 'linkedin')} />
          <Field label="GitHub" value={data.personal_info?.github} onChange={v => updateNested('personal_info', null, 'github', v)} placeholder="github.com/johndoe" onDelete={() => deleteField('personal_info', 'github')} />
          <Field label="Portfolio" value={data.personal_info?.portfolio} onChange={v => updateNested('personal_info', null, 'portfolio', v)} placeholder="johndoe.com" onDelete={() => deleteField('personal_info', 'portfolio')} />
        </div>
      </Section>

      {/* Dynamic Sections */}
      {sectionOrder.map((sid) => {
        if (sid === 'summary') {
          return (
            <Section key={sid} id={sid} title="Professional Summary">
              <AutoTextarea 
                value={data.summary} 
                onChange={v => update('summary', v)} 
                placeholder="Write summary..."
                minRows={3}
              />
            </Section>
          );
        }
        
        if (sid === 'technical_skills') {
          return (
            <Section key={sid} id={sid} title="Technical Skills">
              <p className="text-xs text-gray-500 mb-3">Comma-separated skills</p>
              {data.technical_skills && Object.keys(data.technical_skills).map(cat => (
                <div key={cat} className="mb-3">
                  <Field 
                    label={cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ')} 
                    value={data.technical_skills[cat]?.join(', ')} 
                    onChange={v => update('technical_skills', { 
                      ...data.technical_skills, 
                      [cat]: v.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="React, TypeScript"
                    onDelete={() => {
                      const newSkills = { ...data.technical_skills };
                      delete newSkills[cat];
                      update('technical_skills', newSkills);
                    }}
                  />
                </div>
              ))}
            </Section>
          );
        }
        
        if (sid === 'work_experience') {
          return (
            <Section key={sid} id={sid} title="Work Experience">
              {data.work_experience?.map((job, i) => (
                <EntryCard 
                  key={i} 
                  onDelete={() => update('work_experience', data.work_experience.filter((_, idx) => idx !== i))}
                  title={job.company ? `${job.company} — ${job.job_title}` : `Experience ${i + 1}`}
                >
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Field label="Company" value={job.company} onChange={v => updateNested('work_experience', i, 'company', v)} placeholder="Company" />
                    <Field label="Job Title" value={job.job_title} onChange={v => updateNested('work_experience', i, 'job_title', v)} placeholder="Engineer" />
                    <Field label="Location" value={job.location} onChange={v => updateNested('work_experience', i, 'location', v)} placeholder="City" />
                    <Field label="Dates" value={job.dates} onChange={v => updateNested('work_experience', i, 'dates', v)} placeholder="2022 - Present" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Accomplishments</label>
                    <BulletListEditor
                      bullets={job.bullets || ['']}
                      onChange={v => updateNested('work_experience', i, 'bullets', v)}
                      placeholder="Describe accomplishment..."
                    />
                  </div>
                </EntryCard>
              ))}
              <button 
                onClick={() => update('work_experience', [...(data.work_experience || []), { job_title: '', company: '', location: '', dates: '', bullets: [''] }])} 
                className="w-full py-3 text-blue-600 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 text-sm flex items-center justify-center gap-2"
                type="button"
              >
                <Plus size={16} /> Add Work Experience
              </button>
            </Section>
          );
        }
        
        if (sid === 'projects') {
          return (
            <Section key={sid} id={sid} title="Projects">
              {data.projects?.map((proj, i) => (
                <EntryCard 
                  key={i} 
                  onDelete={() => update('projects', data.projects.filter((_, idx) => idx !== i))}
                  title={proj.name || `Project ${i + 1}`}
                >
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Field label="Name" value={proj.name} onChange={v => updateNested('projects', i, 'name', v)} placeholder="Project" />
                    <Field label="Dates" value={proj.dates} onChange={v => updateNested('projects', i, 'dates', v)} placeholder="2023" />
                    <Field label="Link" value={proj.link} onChange={v => updateNested('projects', i, 'link', v)} placeholder="github.com" />
                    <Field label="Association" value={proj.associated_with} onChange={v => updateNested('projects', i, 'associated_with', v)} placeholder="Company" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Description</label>
                    <BulletListEditor
                      bullets={proj.bullets || ['']}
                      onChange={v => updateNested('projects', i, 'bullets', v)}
                      placeholder="Describe project..."
                    />
                  </div>
                </EntryCard>
              ))}
              <button 
                onClick={() => update('projects', [...(data.projects || []), { name: '', associated_with: '', dates: '', link: '', bullets: [''] }])} 
                className="w-full py-3 text-blue-600 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 text-sm flex items-center justify-center gap-2"
                type="button"
              >
                <Plus size={16} /> Add Project
              </button>
            </Section>
          );
        }
        
        if (sid === 'education') {
          return (
            <Section key={sid} id={sid} title="Education">
              {data.education?.map((edu, i) => (
                <EntryCard 
                  key={i} 
                  onDelete={() => update('education', data.education.filter((_, idx) => idx !== i))}
                  title={edu.institution || `Education ${i + 1}`}
                >
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Field label="Institution" value={edu.institution} onChange={v => updateNested('education', i, 'institution', v)} placeholder="University" />
                    <Field label="Degree" value={edu.degree} onChange={v => updateNested('education', i, 'degree', v)} placeholder="B.S." />
                    <Field label="Location" value={edu.location} onChange={v => updateNested('education', i, 'location', v)} placeholder="City" />
                    <Field label="Dates" value={edu.dates} onChange={v => updateNested('education', i, 'dates', v)} placeholder="2022" />
                    <Field label="GPA" value={edu.gpa} onChange={v => updateNested('education', i, 'gpa', v)} placeholder="3.8" />
                    <Field 
                      label="Honors" 
                      value={edu.honors?.join(', ')} 
                      onChange={v => updateNested('education', i, 'honors', v.split(',').map(s => s.trim()).filter(Boolean))} 
                      placeholder="Dean's List"
                    />
                  </div>
                  <Field 
                    label="Coursework" 
                    value={edu.coursework} 
                    onChange={v => updateNested('education', i, 'coursework', v)} 
                    placeholder="Algorithms"
                  />
                </EntryCard>
              ))}
              <button 
                onClick={() => update('education', [...(data.education || []), { degree: '', institution: '', location: '', dates: '', gpa: '', honors: [], coursework: '' }])} 
                className="w-full py-3 text-blue-600 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 text-sm flex items-center justify-center gap-2"
                type="button"
              >
                <Plus size={16} /> Add Education
              </button>
            </Section>
          );
        }
        
        if (sid === 'achievements') {
          return (
            <Section key={sid} id={sid} title="Achievements">
              <BulletListEditor
                bullets={data.achievements || ['']}
                onChange={v => update('achievements', v)}
                placeholder="Achievement..."
              />
            </Section>
          );
        }
        
        return null;
      })}
    </div>
  );
}
