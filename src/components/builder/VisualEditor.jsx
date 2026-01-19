import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';
import { useConfig } from '../../contexts/ConfigContext';

export function VisualEditor() {
  const { currentResume, handleDataChange } = useResume();
  const { sectionOrder, setSectionOrder } = useConfig();
  const [expanded, setExpanded] = useState({ personal_info: true, job_metadata: true });

  const toggle = k => setExpanded(p => ({ ...p, [k]: !p[k] }));
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

  const moveSection = (i, dir) => { 
    const arr = [...sectionOrder]; 
    const j = dir === 'up' ? i - 1 : i + 1; 
    [arr[i], arr[j]] = [arr[j], arr[i]]; 
    setSectionOrder(arr); 
  };

  const Input = ({ label, value, onChange, multi }) => (
    <div className="mb-2">
      {label && <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>}
      {multi 
        ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} className="w-full p-2 border rounded text-sm" rows={3} />
        : <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className="w-full p-2 border rounded text-sm" />
      }
    </div>
  );

  const Section = ({ id, title, children, canReorder }) => (
    <div className="border rounded mb-2 bg-white">
      <div className="flex items-center p-2 bg-gray-100">
        {canReorder && (
          <div className="flex flex-col mr-2">
            <button 
              onClick={() => moveSection(sectionOrder.indexOf(id), 'up')} 
              disabled={sectionOrder.indexOf(id) === 0} 
              className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
            >
              <ArrowUp size={12} />
            </button>
            <button 
              onClick={() => moveSection(sectionOrder.indexOf(id), 'down')} 
              disabled={sectionOrder.indexOf(id) === sectionOrder.length - 1} 
              className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
            >
              <ArrowDown size={12} />
            </button>
          </div>
        )}
        <span className="flex-1 font-medium text-sm cursor-pointer" onClick={() => toggle(id)}>{title}</span>
        <button onClick={() => toggle(id)}>
          {expanded[id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {expanded[id] && <div className="p-3">{children}</div>}
    </div>
  );

  const data = currentResume;

  return (
    <div className="h-full overflow-y-auto pr-2 text-sm">
      {/* Job Metadata */}
      <Section id="job_metadata" title="Job Metadata">
        <div className="grid grid-cols-2 gap-2">
          <Input label="Company" value={data.job_metadata?.company} onChange={v => updateNested('job_metadata', null, 'company', v)} />
          <Input label="Role" value={data.job_metadata?.role} onChange={v => updateNested('job_metadata', null, 'role', v)} />
          <Input label="Location" value={data.job_metadata?.location} onChange={v => updateNested('job_metadata', null, 'location', v)} />
          <Input label="Job Type" value={data.job_metadata?.job_type} onChange={v => updateNested('job_metadata', null, 'job_type', v)} />
          <Input label="JD URL" value={data.job_metadata?.jd_url} onChange={v => updateNested('job_metadata', null, 'jd_url', v)} />
        </div>
      </Section>

      {/* Personal Info */}
      <Section id="personal_info" title="Personal Information">
        <div className="grid grid-cols-2 gap-2">
          {['name', 'email', 'phone', 'location', 'linkedin', 'github', 'portfolio'].map(f => (
            <Input 
              key={f} 
              label={f.charAt(0).toUpperCase() + f.slice(1)} 
              value={data.personal_info?.[f]} 
              onChange={v => updateNested('personal_info', null, f, v)} 
            />
          ))}
        </div>
      </Section>

      {sectionOrder.map(sid => {
        if (sid === 'summary') {
          return (
            <Section key={sid} id={sid} title="Summary" canReorder>
              <Input value={data.summary} onChange={v => update('summary', v)} multi />
            </Section>
          );
        }
        
        if (sid === 'technical_skills') {
          return (
            <Section key={sid} id={sid} title="Technical Skills" canReorder>
              <p className="text-xs text-gray-500 mb-2">Comma-separated values. Categories are rendered dynamically.</p>
              {data.technical_skills && Object.keys(data.technical_skills).map(cat => (
                <Input 
                  key={cat} 
                  label={cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ')} 
                  value={data.technical_skills[cat]?.join(', ')} 
                  onChange={v => update('technical_skills', { 
                    ...data.technical_skills, 
                    [cat]: v.split(',').map(s => s.trim()).filter(Boolean) 
                  })} 
                />
              ))}
            </Section>
          );
        }
        
        if (sid === 'work_experience') {
          return (
            <Section key={sid} id={sid} title="Work Experience" canReorder>
              {data.work_experience?.map((job, i) => (
                <div key={i} className="border rounded p-3 mb-2 bg-gray-50 relative">
                  <button 
                    onClick={() => update('work_experience', data.work_experience.filter((_, idx) => idx !== i))} 
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="Company" value={job.company} onChange={v => updateNested('work_experience', i, 'company', v)} />
                    <Input label="Job Title" value={job.job_title} onChange={v => updateNested('work_experience', i, 'job_title', v)} />
                    <Input label="Location" value={job.location} onChange={v => updateNested('work_experience', i, 'location', v)} />
                    <Input label="Dates" value={job.dates} onChange={v => updateNested('work_experience', i, 'dates', v)} />
                  </div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 mt-2">Bullets (one per line)</label>
                  <textarea 
                    value={job.bullets?.join('\n')} 
                    onChange={e => updateNested('work_experience', i, 'bullets', e.target.value.split('\n'))} 
                    className="w-full p-2 border rounded text-sm" 
                    rows={3} 
                  />
                </div>
              ))}
              <button 
                onClick={() => update('work_experience', [...(data.work_experience || []), { job_title: '', company: '', location: '', dates: '', bullets: [''] }])} 
                className="w-full py-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </Section>
          );
        }
        
        if (sid === 'projects') {
          return (
            <Section key={sid} id={sid} title="Projects" canReorder>
              {data.projects?.map((proj, i) => (
                <div key={i} className="border rounded p-3 mb-2 bg-gray-50 relative">
                  <button 
                    onClick={() => update('projects', data.projects.filter((_, idx) => idx !== i))} 
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="Name" value={proj.name} onChange={v => updateNested('projects', i, 'name', v)} />
                    <Input label="Dates" value={proj.dates} onChange={v => updateNested('projects', i, 'dates', v)} />
                    <Input label="Link" value={proj.link} onChange={v => updateNested('projects', i, 'link', v)} />
                    <Input label="Association" value={proj.associated_with} onChange={v => updateNested('projects', i, 'associated_with', v)} />
                  </div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 mt-2">Bullets</label>
                  <textarea 
                    value={proj.bullets?.join('\n')} 
                    onChange={e => updateNested('projects', i, 'bullets', e.target.value.split('\n'))} 
                    className="w-full p-2 border rounded text-sm" 
                    rows={2} 
                  />
                </div>
              ))}
              <button 
                onClick={() => update('projects', [...(data.projects || []), { name: '', associated_with: '', dates: '', link: '', bullets: [''] }])} 
                className="w-full py-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </Section>
          );
        }
        
        if (sid === 'education') {
          return (
            <Section key={sid} id={sid} title="Education" canReorder>
              {data.education?.map((edu, i) => (
                <div key={i} className="border rounded p-3 mb-2 bg-gray-50 relative">
                  <button 
                    onClick={() => update('education', data.education.filter((_, idx) => idx !== i))} 
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="Institution" value={edu.institution} onChange={v => updateNested('education', i, 'institution', v)} />
                    <Input label="Degree" value={edu.degree} onChange={v => updateNested('education', i, 'degree', v)} />
                    <Input label="Location" value={edu.location} onChange={v => updateNested('education', i, 'location', v)} />
                    <Input label="Dates" value={edu.dates} onChange={v => updateNested('education', i, 'dates', v)} />
                    <Input label="GPA" value={edu.gpa} onChange={v => updateNested('education', i, 'gpa', v)} />
                    <Input label="Honors (comma-sep)" value={edu.honors?.join(', ')} onChange={v => updateNested('education', i, 'honors', v.split(',').map(s => s.trim()).filter(Boolean))} />
                  </div>
                  <Input label="Coursework" value={edu.coursework} onChange={v => updateNested('education', i, 'coursework', v)} />
                </div>
              ))}
              <button 
                onClick={() => update('education', [...(data.education || []), { degree: '', institution: '', location: '', dates: '', gpa: '', honors: [], coursework: '' }])} 
                className="w-full py-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </Section>
          );
        }
        
        if (sid === 'achievements') {
          return (
            <Section key={sid} id={sid} title="Achievements" canReorder>
              <p className="text-xs text-gray-500 mb-2">Each achievement as a single line</p>
              {data.achievements?.map((a, i) => (
                <div key={i} className="flex gap-1 mb-1">
                  <input 
                    value={a} 
                    onChange={e => { const arr = [...data.achievements]; arr[i] = e.target.value; update('achievements', arr); }} 
                    className="flex-1 p-2 border rounded text-sm" 
                  />
                  <button 
                    onClick={() => update('achievements', data.achievements.filter((_, idx) => idx !== i))} 
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => update('achievements', [...(data.achievements || []), ''])} 
                className="w-full py-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </Section>
          );
        }
        
        return null;
      })}
    </div>
  );
}