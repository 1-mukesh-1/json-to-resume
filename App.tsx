import React, { useState, useRef } from 'react';
import { GripVertical, ChevronDown, ChevronUp, Eye, Code, Download } from 'lucide-react';

const sampleData = {
  personal_info: {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    portfolio: "johndoe.dev",
    location: "San Francisco, CA"
  },
  summary: "Senior Software Engineer with 6+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud infrastructure. Led teams of 5-8 engineers delivering products used by 2M+ users.",
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      graduation_date: "May 2018",
      gpa: "3.8",
      honors: ["Magna Cum Laude", "Dean's List"]
    }
  ],
  technical_skills: {
    languages: ["JavaScript", "TypeScript", "Python", "Go"],
    frameworks: ["React", "Node.js", "Express", "Next.js"],
    databases: ["PostgreSQL", "MongoDB", "Redis"],
    cloud: ["AWS", "GCP", "Docker", "Kubernetes"],
    tools: ["Git", "Jenkins", "Terraform", "Datadog"]
  },
  work_experience: [
    {
      job_title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      dates: "January 2021 - Present",
      bullets: [
        "Led development of microservices architecture serving 2M+ daily active users, improving response times by 40%",
        "Mentored team of 5 junior engineers, conducting code reviews and establishing best practices",
        "Designed and implemented real-time notification system using WebSockets and Redis pub/sub"
      ]
    },
    {
      job_title: "Software Engineer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      dates: "June 2018 - December 2020",
      bullets: [
        "Built React-based dashboard used by 500+ enterprise clients to manage their accounts",
        "Developed RESTful APIs in Node.js handling 10K+ requests per minute",
        "Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes"
      ]
    }
  ],
  projects: [
    {
      name: "Open Source CLI Tool",
      associated_with: "Personal Project",
      dates: "2023",
      link: "github.com/johndoe/cli-tool",
      bullets: [
        "Created command-line tool for automating deployment workflows with 500+ GitHub stars",
        "Built with Go, supporting Linux, macOS, and Windows platforms"
      ]
    }
  ],
  achievements: [
    "AWS Certified Solutions Architect - Professional (2023)",
    "Speaker at ReactConf 2022 - 'Scaling React Applications'",
    "Hackathon Winner - TechCrunch Disrupt 2021"
  ]
};

const defaultSectionOrder = ['summary', 'technical_skills', 'work_experience', 'projects', 'education', 'achievements'];

const sectionLabels = {
  summary: 'Summary',
  technical_skills: 'Technical Skills',
  work_experience: 'Work Experience',
  projects: 'Projects',
  education: 'Education',
  achievements: 'Achievements'
};

// Interactive Editor Components

interface TextInputProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, multiline }) => (
  <div className="mb-2">
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    {multiline ? (
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} className="w-full p-2 border rounded text-sm" rows={3} />
    ) : (
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className="w-full p-2 border rounded text-sm" />
    )}
  </div>
);

const ArrayEditor = ({ items, onChange, renderItem, addLabel, newItem }) => (
  <div>
    {items?.map((item, i) => (
      <div key={i} className="border rounded p-3 mb-2 bg-gray-50">
        {renderItem(item, i, (field, val) => {
          const updated = [...items];
          updated[i] = { ...updated[i], [field]: val };
          onChange(updated);
        })}
        <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-red-500 text-xs mt-2">Remove</button>
      </div>
    ))}
    <button onClick={() => onChange([...(items || []), newItem()])} className="text-blue-600 text-sm">+ {addLabel}</button>
  </div>
);

const InteractiveEditor = ({ data, setData, sectionOrder, setSectionOrder }) => {
  const [expanded, setExpanded] = useState({ personal_info: true });
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));
  const update = (section, value) => setData(p => ({ ...p, [section]: value }));

  const handleDragStart = (idx) => { dragItem.current = idx; };
  const handleDragEnter = (idx) => { dragOverItem.current = idx; };
  const handleDragEnd = () => {
    const newOrder = [...sectionOrder];
    const [removed] = newOrder.splice(dragItem.current, 1);
    newOrder.splice(dragOverItem.current, 0, removed);
    setSectionOrder(newOrder);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const Section = ({ id, title, children }) => (
    <div className="border rounded mb-2 bg-white">
      <div
        className="flex items-center p-2 bg-gray-100 cursor-pointer"
        draggable
        onDragStart={() => handleDragStart(sectionOrder.indexOf(id))}
        onDragEnter={() => handleDragEnter(sectionOrder.indexOf(id))}
        onDragEnd={handleDragEnd}
        onDragOver={e => e.preventDefault()}
      >
        <GripVertical size={16} className="text-gray-400 mr-2 cursor-grab" />
        <span className="flex-1 font-medium text-sm">{title}</span>
        <button onClick={() => toggle(id)}>{expanded[id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
      </div>
      {expanded[id] && <div className="p-3">{children}</div>}
    </div>
  );

  return (
    <div className="text-sm">
      {/* Personal Info - always first */}
      <Section id="personal_info" title="Personal Information">
        <TextInput label="Name" value={data.personal_info?.name} onChange={v => update('personal_info', { ...data.personal_info, name: v })} />
        <TextInput label="Email" value={data.personal_info?.email} onChange={v => update('personal_info', { ...data.personal_info, email: v })} />
        <TextInput label="Phone" value={data.personal_info?.phone} onChange={v => update('personal_info', { ...data.personal_info, phone: v })} />
        <TextInput label="Location" value={data.personal_info?.location} onChange={v => update('personal_info', { ...data.personal_info, location: v })} />
        <TextInput label="LinkedIn" value={data.personal_info?.linkedin} onChange={v => update('personal_info', { ...data.personal_info, linkedin: v })} />
        <TextInput label="GitHub" value={data.personal_info?.github} onChange={v => update('personal_info', { ...data.personal_info, github: v })} />
        <TextInput label="Portfolio" value={data.personal_info?.portfolio} onChange={v => update('personal_info', { ...data.personal_info, portfolio: v })} />
      </Section>

      {/* Draggable sections */}
      {sectionOrder.map(sectionId => {
        if (sectionId === 'summary') return (
          <Section key={sectionId} id={sectionId} title="Summary">
            <TextInput label="Summary" value={data.summary} onChange={v => update('summary', v)} multiline />
          </Section>
        );
        if (sectionId === 'technical_skills') return (
          <Section key={sectionId} id={sectionId} title="Technical Skills">
            {['languages', 'frameworks', 'databases', 'cloud', 'tools'].map(cat => (
              <TextInput key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} value={data.technical_skills?.[cat]?.join(', ')} onChange={v => update('technical_skills', { ...data.technical_skills, [cat]: v.split(',').map(s => s.trim()).filter(Boolean) })} />
            ))}
          </Section>
        );
        if (sectionId === 'work_experience') return (
          <Section key={sectionId} id={sectionId} title="Work Experience">
            <ArrayEditor
              items={data.work_experience}
              onChange={v => update('work_experience', v)}
              addLabel="Add Experience"
              newItem={() => ({ job_title: '', company: '', location: '', dates: '', bullets: [''] })}
              renderItem={(job, i, upd) => (
                <>
                  <TextInput label="Company" value={job.company} onChange={v => upd('company', v)} />
                  <TextInput label="Job Title" value={job.job_title} onChange={v => upd('job_title', v)} />
                  <TextInput label="Location" value={job.location} onChange={v => upd('location', v)} />
                  <TextInput label="Dates" value={job.dates} onChange={v => upd('dates', v)} />
                  <label className="block text-xs font-medium text-gray-600 mb-1">Bullets</label>
                  {job.bullets?.map((b, bi) => (
                    <div key={bi} className="flex gap-1 mb-1">
                      <input value={b} onChange={e => { const nb = [...job.bullets]; nb[bi] = e.target.value; upd('bullets', nb); }} className="flex-1 p-1 border rounded text-sm" />
                      <button onClick={() => upd('bullets', job.bullets.filter((_, idx) => idx !== bi))} className="text-red-500 text-xs">×</button>
                    </div>
                  ))}
                  <button onClick={() => upd('bullets', [...(job.bullets || []), ''])} className="text-blue-600 text-xs">+ Bullet</button>
                </>
              )}
            />
          </Section>
        );
        if (sectionId === 'projects') return (
          <Section key={sectionId} id={sectionId} title="Projects">
            <ArrayEditor
              items={data.projects}
              onChange={v => update('projects', v)}
              addLabel="Add Project"
              newItem={() => ({ name: '', associated_with: '', dates: '', link: '', bullets: [''] })}
              renderItem={(proj, i, upd) => (
                <>
                  <TextInput label="Project Name" value={proj.name} onChange={v => upd('name', v)} />
                  <TextInput label="Associated With" value={proj.associated_with} onChange={v => upd('associated_with', v)} />
                  <TextInput label="Dates" value={proj.dates} onChange={v => upd('dates', v)} />
                  <TextInput label="Link" value={proj.link} onChange={v => upd('link', v)} />
                  <label className="block text-xs font-medium text-gray-600 mb-1">Bullets</label>
                  {proj.bullets?.map((b, bi) => (
                    <div key={bi} className="flex gap-1 mb-1">
                      <input value={b} onChange={e => { const nb = [...proj.bullets]; nb[bi] = e.target.value; upd('bullets', nb); }} className="flex-1 p-1 border rounded text-sm" />
                      <button onClick={() => upd('bullets', proj.bullets.filter((_, idx) => idx !== bi))} className="text-red-500 text-xs">×</button>
                    </div>
                  ))}
                  <button onClick={() => upd('bullets', [...(proj.bullets || []), ''])} className="text-blue-600 text-xs">+ Bullet</button>
                </>
              )}
            />
          </Section>
        );
        if (sectionId === 'education') return (
          <Section key={sectionId} id={sectionId} title="Education">
            <ArrayEditor
              items={data.education}
              onChange={v => update('education', v)}
              addLabel="Add Education"
              newItem={() => ({ degree: '', institution: '', location: '', graduation_date: '', gpa: '', honors: [] })}
              renderItem={(edu, i, upd) => (
                <>
                  <TextInput label="Institution" value={edu.institution} onChange={v => upd('institution', v)} />
                  <TextInput label="Degree" value={edu.degree} onChange={v => upd('degree', v)} />
                  <TextInput label="Location" value={edu.location} onChange={v => upd('location', v)} />
                  <TextInput label="Graduation Date" value={edu.graduation_date} onChange={v => upd('graduation_date', v)} />
                  <TextInput label="GPA" value={edu.gpa} onChange={v => upd('gpa', v)} />
                  <TextInput label="Honors (comma-separated)" value={edu.honors?.join(', ')} onChange={v => upd('honors', v.split(',').map(s => s.trim()).filter(Boolean))} />
                </>
              )}
            />
          </Section>
        );
        if (sectionId === 'achievements') return (
          <Section key={sectionId} id={sectionId} title="Achievements">
            {data.achievements?.map((a, i) => (
              <div key={i} className="flex gap-1 mb-1">
                <input value={a} onChange={e => { const na = [...data.achievements]; na[i] = e.target.value; update('achievements', na); }} className="flex-1 p-1 border rounded text-sm" />
                <button onClick={() => update('achievements', data.achievements.filter((_, idx) => idx !== i))} className="text-red-500 text-xs">×</button>
              </div>
            ))}
            <button onClick={() => update('achievements', [...(data.achievements || []), ''])} className="text-blue-600 text-xs">+ Achievement</button>
          </Section>
        );
        return null;
      })}
    </div>
  );
};

// Resume Preview Component
const ResumePreview = ({ data, sectionOrder }) => {
  if (!data) return null;
  const { personal_info, summary, education, technical_skills, work_experience, projects, achievements } = data;

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return summary && (
          <div key={sectionId} style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '6px' }}>SUMMARY</div>
            <p style={{ fontSize: '10pt' }}>{summary}</p>
          </div>
        );
      case 'technical_skills':
        return technical_skills && (
          <div key={sectionId} style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '6px' }}>TECHNICAL SKILLS</div>
            <div style={{ fontSize: '10pt' }}>
              {technical_skills.languages?.length > 0 && <p><strong>Languages:</strong> {technical_skills.languages.join(', ')}</p>}
              {technical_skills.frameworks?.length > 0 && <p><strong>Frameworks:</strong> {technical_skills.frameworks.join(', ')}</p>}
              {technical_skills.databases?.length > 0 && <p><strong>Databases:</strong> {technical_skills.databases.join(', ')}</p>}
              {technical_skills.cloud?.length > 0 && <p><strong>Cloud & DevOps:</strong> {technical_skills.cloud.join(', ')}</p>}
              {technical_skills.tools?.length > 0 && <p><strong>Tools:</strong> {technical_skills.tools.join(', ')}</p>}
            </div>
          </div>
        );
      case 'work_experience':
        return work_experience?.length > 0 && (
          <div key={sectionId} style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '6px' }}>WORK EXPERIENCE</div>
            {work_experience.map((job, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11pt' }}>
                  <strong>{job.company}</strong>
                  <span>{job.dates}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11pt', fontStyle: 'italic' }}>
                  <span>{job.job_title}</span>
                  <span>{job.location}</span>
                </div>
                <ul style={{ marginLeft: '18px', marginTop: '4px', fontSize: '10pt', listStyleType: 'disc' }}>
                  {job.bullets?.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        );
      case 'projects':
        return projects?.length > 0 && (
          <div key={sectionId} style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '6px' }}>PROJECTS</div>
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11pt' }}>
                  <strong>{proj.name}{proj.link && ` | ${proj.link}`}</strong>
                  <span>{proj.dates}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11pt', fontStyle: 'italic' }}>
                  <span>{proj.associated_with}</span>
                </div>
                <ul style={{ marginLeft: '18px', marginTop: '4px', fontSize: '10pt', listStyleType: 'disc' }}>
                  {proj.bullets?.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        );
      case 'education':
        return education?.length > 0 && (
          <div key={sectionId} style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '6px' }}>EDUCATION</div>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11pt' }}>
                  <strong>{edu.institution}</strong>
                  <span>{edu.graduation_date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11pt', fontStyle: 'italic' }}>
                  <span>{edu.degree}</span>
                  <span>{edu.location}</span>
                </div>
                {edu.gpa && <p style={{ fontSize: '10pt' }}>GPA: {edu.gpa}</p>}
                {edu.honors?.length > 0 && <p style={{ fontSize: '10pt' }}>Honors: {edu.honors.join(', ')}</p>}
              </div>
            ))}
          </div>
        );
      case 'achievements':
        return achievements?.length > 0 && (
          <div key={sectionId} style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '6px' }}>ACHIEVEMENTS</div>
            <ul style={{ marginLeft: '18px', fontSize: '10pt', listStyleType: 'disc' }}>
              {achievements.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div id="resume-content" style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.3', color: '#000', background: '#fff', padding: '0.5in', maxWidth: '8.5in', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '12px', borderBottom: '1px solid #000', paddingBottom: '8px' }}>
        <div style={{ fontSize: '20pt', fontWeight: 'bold', marginBottom: '4px' }}>{personal_info?.name}</div>
        <div style={{ fontSize: '11pt' }}>
          {[personal_info?.email, personal_info?.phone, personal_info?.location].filter(Boolean).join(' | ')}
        </div>
        <div style={{ fontSize: '11pt' }}>
          {[
            personal_info?.linkedin,
            personal_info?.github,
            personal_info?.portfolio ? 'Portfolio' : null
          ].filter(Boolean).join(' | ')}
        </div>
      </div>
      {sectionOrder.map(renderSection)}
    </div>
  );
};

export default function ResumeGenerator() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(sampleData, null, 2));
  const [resumeData, setResumeData] = useState(sampleData);
  const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState('visual'); // 'json' or 'visual'

  const handleJsonChange = (val) => {
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      setResumeData(parsed);
      setError('');
    } catch (e) {
      setError('Invalid JSON');
    }
  };

  const handleDataChange = (newData) => {
    setResumeData(newData);
    setJsonInput(JSON.stringify(newData, null, 2));
  };

  const handleDownload = () => {
    const content = document.getElementById('resume-content');
    const printWindow = window.open('', '_blank', 'width=850,height=1100');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>${resumeData?.personal_info?.name || 'Resume'}</title>
<style>
@page { size: letter; margin: 0.5in; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.3; color: #000; -webkit-print-color-adjust: exact; }
ul { margin-left: 18px; }
li { margin-bottom: 2px; }
</style></head><body>${content.innerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); printWindow.close(); };
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <h1 className="text-lg font-bold">ATS Resume Generator</h1>
        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded font-semibold">
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-1/2 border-r bg-white flex flex-col">
          <div className="p-2 border-b flex gap-2 bg-gray-50">
            <button
              onClick={() => setEditMode('visual')}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${editMode === 'visual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              <Eye size={16} /> Visual Editor
            </button>
            <button
              onClick={() => setEditMode('json')}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${editMode === 'json' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              <Code size={16} /> JSON
            </button>
          </div>
          <div className="flex-1 overflow-auto p-3">
            {editMode === 'json' ? (
              <div>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <textarea
                  value={jsonInput}
                  onChange={e => handleJsonChange(e.target.value)}
                  className="w-full h-full min-h-[600px] p-3 font-mono text-xs border rounded"
                  spellCheck={false}
                />
              </div>
            ) : (
              <InteractiveEditor
                data={resumeData}
                setData={handleDataChange}
                sectionOrder={sectionOrder}
                setSectionOrder={setSectionOrder}
              />
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 overflow-auto bg-gray-200 p-4">
          <div className="bg-white shadow-lg mx-auto" style={{ maxWidth: '8.5in' }}>
            <ResumePreview data={resumeData} sectionOrder={sectionOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}