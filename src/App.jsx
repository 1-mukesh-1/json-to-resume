import React, { useState, useRef } from 'react';
import { GripVertical, ChevronDown, ChevronUp, Eye, Code, Download, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const sampleData = {
  personal_info: {
    name: "Alex Sterling",
    email: "alex.sterling@example.com",
    phone: "(555) 123-4567",
    linkedin: "linkedin.com/in/alexsterling",
    github: "github.com/alexsterling",
    portfolio: "alexsterling.dev",
    location: "San Francisco, CA"
  },
  summary: "Senior Frontend Engineer with 7+ years of experience building performant, scalable web applications. Deeply proficient in the React ecosystem, TypeScript, and modern state management. Proven track record of leading teams and improving developer velocity.",
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      graduation_date: "June 2017",
      gpa: "3.9",
      honors: ["Phi Beta Kappa", "President's Award"]
    }
  ],
  technical_skills: {
    languages: ["TypeScript", "JavaScript (ES6+)", "Python", "Rust"],
    frameworks: ["React", "Next.js", "Vue.js", "Tailwind CSS"],
    databases: ["PostgreSQL", "Redis", "Firebase"],
    cloud: ["AWS (S3, CloudFront, Lambda)", "Vercel", "Docker"],
    tools: ["Git", "Webpack", "Vite", "Figma"]
  },
  work_experience: [
    {
      job_title: "Senior Frontend Engineer",
      company: "InnovateTech",
      location: "San Francisco, CA",
      dates: "August 2021 - Present",
      bullets: [
        "Architected a micro-frontend framework using Module Federation, reducing build times by 60%",
        "Led a team of 6 engineers in rebuilding the core customer dashboard, resulting in a 25% increase in user engagement",
        "Implemented a comprehensive design system in React/TypeScript used across 4 different product lines"
      ]
    },
    {
      job_title: "Software Engineer",
      company: "WebSolutions Inc.",
      location: "Austin, TX",
      dates: "July 2017 - July 2021",
      bullets: [
        "Developed and maintained high-traffic e-commerce platforms serving 1M+ monthly users",
        "Optimized frontend performance, achieving a 98/100 Lighthouse Core Web Vitals score",
        "Integrated third-party payment gateways (Stripe, PayPal) ensuring PCI compliance"
      ]
    }
  ],
  projects: [
    {
      name: "React Performance Monitor",
      associated_with: "Open Source",
      dates: "2023",
      link: "github.com/alexsterling/rpm",
      bullets: [
        "Created a lightweight React component for real-time rendering performance monitoring",
        "Garnered 1.2k+ stars on GitHub and used by several Fortune 500 companies"
      ]
    }
  ],
  achievements: [
    "Speaker at React Summit 2023 on 'Next-Gen State Management'",
    "Winner of the 2022 Global Hackathon for 'Best Accessibility Tool'"
  ]
};

const defaultSectionOrder = ['summary', 'technical_skills', 'work_experience', 'projects', 'education', 'achievements'];
const sectionLabels = {
  summary: 'Professional Summary',
  technical_skills: 'Technical Skills',
  work_experience: 'Work Experience',
  projects: 'Projects',
  education: 'Education',
  achievements: 'Achievements'
};

const FormEditor = ({ data, setData, sectionOrder, setSectionOrder }) => {
  const [expanded, setExpanded] = useState({ personal_info: true });
  const toggle = (k) => setExpanded(p => ({ ...p, [k]: !p[k] }));
  const update = (section, value) => setData(p => ({ ...p, [section]: value }));
  const updateNested = (section, idx, field, val) => {
    if (idx === null) {
      update(section, { ...data[section], [field]: val });
    } else {
      const arr = [...data[section]];
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
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {multi ? (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} className="w-full p-2 border rounded text-sm" rows={3} />
      ) : (
        <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className="w-full p-2 border rounded text-sm" />
      )}
    </div>
  );

  const Section = ({ id, title, children, canReorder }) => (
    <div className="border rounded mb-2 bg-white">
      <div className="flex items-center p-2 bg-gray-100">
        {canReorder && (
          <div className="flex flex-col mr-2">
            <button onClick={() => moveSection(sectionOrder.indexOf(id), 'up')} disabled={sectionOrder.indexOf(id) === 0} className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowUp size={12} /></button>
            <button onClick={() => moveSection(sectionOrder.indexOf(id), 'down')} disabled={sectionOrder.indexOf(id) === sectionOrder.length - 1} className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowDown size={12} /></button>
          </div>
        )}
        <span className="flex-1 font-medium text-sm cursor-pointer" onClick={() => toggle(id)}>{title}</span>
        <button onClick={() => toggle(id)}>{expanded[id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
      </div>
      {expanded[id] && <div className="p-3">{children}</div>}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto pr-2 text-sm">
      <Section id="personal_info" title="Personal Information">
        <div className="grid grid-cols-2 gap-2">
          <Input label="Name" value={data.personal_info?.name} onChange={v => updateNested('personal_info', null, 'name', v)} />
          <Input label="Email" value={data.personal_info?.email} onChange={v => updateNested('personal_info', null, 'email', v)} />
          <Input label="Phone" value={data.personal_info?.phone} onChange={v => updateNested('personal_info', null, 'phone', v)} />
          <Input label="Location" value={data.personal_info?.location} onChange={v => updateNested('personal_info', null, 'location', v)} />
          <Input label="LinkedIn" value={data.personal_info?.linkedin} onChange={v => updateNested('personal_info', null, 'linkedin', v)} />
          <Input label="GitHub" value={data.personal_info?.github} onChange={v => updateNested('personal_info', null, 'github', v)} />
          <Input label="Portfolio URL" value={data.personal_info?.portfolio} onChange={v => updateNested('personal_info', null, 'portfolio', v)} />
        </div>
      </Section>

      {sectionOrder.map(sid => {
        if (sid === 'summary') return (
          <Section key={sid} id={sid} title="Summary" canReorder>
            <Input label="" value={data.summary} onChange={v => update('summary', v)} multi />
          </Section>
        );
        if (sid === 'technical_skills') return (
          <Section key={sid} id={sid} title="Technical Skills" canReorder>
            <p className="text-xs text-gray-500 mb-2">Comma-separated values</p>
            {['languages', 'frameworks', 'databases', 'cloud', 'tools'].map(cat => (
              <Input key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} value={data.technical_skills?.[cat]?.join(', ')} onChange={v => update('technical_skills', { ...data.technical_skills, [cat]: v.split(',').map(s => s.trim()).filter(Boolean) })} />
            ))}
          </Section>
        );
        if (sid === 'work_experience') return (
          <Section key={sid} id={sid} title="Work Experience" canReorder>
            {data.work_experience?.map((job, i) => (
              <div key={i} className="border rounded p-3 mb-2 bg-gray-50 relative">
                <button onClick={() => update('work_experience', data.work_experience.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Company" value={job.company} onChange={v => updateNested('work_experience', i, 'company', v)} />
                  <Input label="Job Title" value={job.job_title} onChange={v => updateNested('work_experience', i, 'job_title', v)} />
                  <Input label="Location" value={job.location} onChange={v => updateNested('work_experience', i, 'location', v)} />
                  <Input label="Dates" value={job.dates} onChange={v => updateNested('work_experience', i, 'dates', v)} />
                </div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 mt-2">Bullets (one per line)</label>
                <textarea value={job.bullets?.join('\n')} onChange={e => updateNested('work_experience', i, 'bullets', e.target.value.split('\n'))} className="w-full p-2 border rounded text-sm" rows={3} />
              </div>
            ))}
            <button onClick={() => update('work_experience', [...(data.work_experience || []), { job_title: '', company: '', location: '', dates: '', bullets: [''] }])} className="w-full py-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm flex items-center justify-center gap-1"><Plus size={14} /> Add Experience</button>
          </Section>
        );
        if (sid === 'projects') return (
          <Section key={sid} id={sid} title="Projects" canReorder>
            {data.projects?.map((proj, i) => (
              <div key={i} className="border rounded p-3 mb-2 bg-gray-50 relative">
                <button onClick={() => update('projects', data.projects.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Project Name" value={proj.name} onChange={v => updateNested('projects', i, 'name', v)} />
                  <Input label="Dates" value={proj.dates} onChange={v => updateNested('projects', i, 'dates', v)} />
                  <Input label="Link" value={proj.link} onChange={v => updateNested('projects', i, 'link', v)} />
                  <Input label="Association" value={proj.associated_with} onChange={v => updateNested('projects', i, 'associated_with', v)} />
                </div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 mt-2">Bullets (one per line)</label>
                <textarea value={proj.bullets?.join('\n')} onChange={e => updateNested('projects', i, 'bullets', e.target.value.split('\n'))} className="w-full p-2 border rounded text-sm" rows={3} />
              </div>
            ))}
            <button onClick={() => update('projects', [...(data.projects || []), { name: '', associated_with: '', dates: '', link: '', bullets: [''] }])} className="w-full py-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm flex items-center justify-center gap-1"><Plus size={14} /> Add Project</button>
          </Section>
        );
        if (sid === 'education') return (
          <Section key={sid} id={sid} title="Education" canReorder>
            {data.education?.map((edu, i) => (
              <div key={i} className="border rounded p-3 mb-2 bg-gray-50 relative">
                <button onClick={() => update('education', data.education.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Institution" value={edu.institution} onChange={v => updateNested('education', i, 'institution', v)} />
                  <Input label="Degree" value={edu.degree} onChange={v => updateNested('education', i, 'degree', v)} />
                  <Input label="Location" value={edu.location} onChange={v => updateNested('education', i, 'location', v)} />
                  <Input label="Graduation Date" value={edu.graduation_date} onChange={v => updateNested('education', i, 'graduation_date', v)} />
                  <Input label="GPA" value={edu.gpa} onChange={v => updateNested('education', i, 'gpa', v)} />
                  <Input label="Honors (comma-sep)" value={edu.honors?.join(', ')} onChange={v => updateNested('education', i, 'honors', v.split(',').map(s => s.trim()).filter(Boolean))} />
                </div>
              </div>
            ))}
            <button onClick={() => update('education', [...(data.education || []), { degree: '', institution: '', location: '', graduation_date: '', gpa: '', honors: [] }])} className="w-full py-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm flex items-center justify-center gap-1"><Plus size={14} /> Add Education</button>
          </Section>
        );
        if (sid === 'achievements') return (
          <Section key={sid} id={sid} title="Achievements" canReorder>
            {data.achievements?.map((a, i) => (
              <div key={i} className="flex gap-1 mb-1">
                <input value={a} onChange={e => { const arr = [...data.achievements]; arr[i] = e.target.value; update('achievements', arr); }} className="flex-1 p-2 border rounded text-sm" />
                <button onClick={() => update('achievements', data.achievements.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            ))}
            <button onClick={() => update('achievements', [...(data.achievements || []), ''])} className="w-full py-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm flex items-center justify-center gap-1"><Plus size={14} /> Add Achievement</button>
          </Section>
        );
        return null;
      })}
    </div>
  );
};

const ResumePreview = ({ data, sectionOrder }) => {
  if (!data) return null;
  const { personal_info, summary, education, technical_skills, work_experience, projects, achievements } = data;

  const styles = {
    page: { fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '1.35', color: '#000', background: '#fff', padding: '0.5in', width: '8.5in', minHeight: '11in', boxSizing: 'border-box' },
    header: { textAlign: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #000' },
    name: { fontSize: '20pt', fontWeight: 'bold', marginBottom: '4px' },
    contact: { fontSize: '11pt' },
    section: { marginBottom: '10px' },
    sectionTitle: { fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '6px', textTransform: 'uppercase' },
    subheaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
    bold: { fontWeight: 'bold', fontSize: '11pt' },
    italic: { fontStyle: 'italic', fontSize: '11pt' },
    bullets: { marginLeft: '18px', marginTop: '4px', listStyleType: 'disc' },
    bullet: { marginBottom: '2px' }
  };

  const renderSection = (id) => {
    switch (id) {
      case 'summary':
        return summary && (
          <div key={id} style={styles.section}>
            <div style={styles.sectionTitle}>Professional Summary</div>
            <p>{summary}</p>
          </div>
        );
      case 'technical_skills':
        return technical_skills && (
          <div key={id} style={styles.section}>
            <div style={styles.sectionTitle}>Technical Skills</div>
            {Object.entries(technical_skills).map(([cat, skills]) => skills?.length > 0 && (
              <div key={cat}><strong style={{ textTransform: 'capitalize' }}>{cat.replace(/_/g, ' ')}:</strong> {skills.join(', ')}</div>
            ))}
          </div>
        );
      case 'work_experience':
        return work_experience?.length > 0 && (
          <div key={id} style={styles.section}>
            <div style={styles.sectionTitle}>Work Experience</div>
            {work_experience.map((job, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={styles.subheaderRow}><span style={styles.bold}>{job.company}</span><span style={styles.bold}>{job.dates}</span></div>
                <div style={styles.subheaderRow}><span style={styles.italic}>{job.job_title}</span><span style={styles.italic}>{job.location}</span></div>
                <ul style={styles.bullets}>{job.bullets?.map((b, j) => <li key={j} style={styles.bullet}>{b}</li>)}</ul>
              </div>
            ))}
          </div>
        );
      case 'projects':
        return projects?.length > 0 && (
          <div key={id} style={styles.section}>
            <div style={styles.sectionTitle}>Projects</div>
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={styles.subheaderRow}><span style={styles.bold}>{p.name}{p.link && ` | ${p.link}`}</span><span style={styles.bold}>{p.dates}</span></div>
                {p.associated_with && <div style={styles.italic}>{p.associated_with}</div>}
                <ul style={styles.bullets}>{p.bullets?.map((b, j) => <li key={j} style={styles.bullet}>{b}</li>)}</ul>
              </div>
            ))}
          </div>
        );
      case 'education':
        return education?.length > 0 && (
          <div key={id} style={styles.section}>
            <div style={styles.sectionTitle}>Education</div>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <div style={styles.subheaderRow}><span style={styles.bold}>{e.institution}</span><span style={styles.bold}>{e.graduation_date}</span></div>
                <div style={styles.subheaderRow}><span style={styles.italic}>{e.degree}</span><span style={styles.italic}>{e.location}</span></div>
                {(e.gpa || e.honors?.length > 0) && (
                  <div style={{ marginTop: '2px' }}>
                    {e.gpa && <span><strong>GPA:</strong> {e.gpa}</span>}
                    {e.gpa && e.honors?.length > 0 && ' | '}
                    {e.honors?.length > 0 && <span><strong>Honors:</strong> {e.honors.join(', ')}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'achievements':
        return achievements?.length > 0 && (
          <div key={id} style={styles.section}>
            <div style={styles.sectionTitle}>Achievements</div>
            <ul style={styles.bullets}>{achievements.map((a, i) => <li key={i} style={styles.bullet}>{a}</li>)}</ul>
          </div>
        );
      default: return null;
    }
  };

  const links = [personal_info?.linkedin && 'LinkedIn', personal_info?.github && 'GitHub', personal_info?.portfolio && 'Portfolio'].filter(Boolean);

  return (
    <div id="resume-content" style={styles.page}>
      <div style={styles.header}>
        <div style={styles.name}>{personal_info?.name}</div>
        <div style={styles.contact}>{[personal_info?.email, personal_info?.phone, personal_info?.location].filter(Boolean).join(' | ')}</div>
        {links.length > 0 && <div style={styles.contact}>{links.join(' | ')}</div>}
      </div>
      {sectionOrder.map(renderSection)}
    </div>
  );
};

const generatePrintHTML = (data, sectionOrder) => {
  const { personal_info, summary, education, technical_skills, work_experience, projects, achievements } = data;
  const links = [personal_info?.linkedin && 'LinkedIn', personal_info?.github && 'GitHub', personal_info?.portfolio && 'Portfolio'].filter(Boolean);

  const renderSection = (id) => {
    switch (id) {
      case 'summary':
        return summary ? `<div class="section"><div class="section-title">PROFESSIONAL SUMMARY</div><p>${summary}</p></div>` : '';
      case 'technical_skills':
        if (!technical_skills) return '';
        const skillsHTML = Object.entries(technical_skills).filter(([_, s]) => s?.length > 0).map(([cat, skills]) => `<div><strong>${cat.replace(/_/g, ' ')}:</strong> ${skills.join(', ')}</div>`).join('');
        return `<div class="section"><div class="section-title">TECHNICAL SKILLS</div>${skillsHTML}</div>`;
      case 'work_experience':
        if (!work_experience?.length) return '';
        const expHTML = work_experience.map(j => `<div class="entry"><div class="row"><span class="bold">${j.company}</span><span class="bold">${j.dates}</span></div><div class="row"><span class="italic">${j.job_title}</span><span class="italic">${j.location}</span></div><ul>${j.bullets?.map(b => `<li>${b}</li>`).join('')}</ul></div>`).join('');
        return `<div class="section"><div class="section-title">WORK EXPERIENCE</div>${expHTML}</div>`;
      case 'projects':
        if (!projects?.length) return '';
        const projHTML = projects.map(p => `<div class="entry"><div class="row"><span class="bold">${p.name}${p.link ? ` | ${p.link}` : ''}</span><span class="bold">${p.dates}</span></div>${p.associated_with ? `<div class="italic">${p.associated_with}</div>` : ''}<ul>${p.bullets?.map(b => `<li>${b}</li>`).join('')}</ul></div>`).join('');
        return `<div class="section"><div class="section-title">PROJECTS</div>${projHTML}</div>`;
      case 'education':
        if (!education?.length) return '';
        const eduHTML = education.map(e => `<div class="entry"><div class="row"><span class="bold">${e.institution}</span><span class="bold">${e.graduation_date}</span></div><div class="row"><span class="italic">${e.degree}</span><span class="italic">${e.location}</span></div>${e.gpa || e.honors?.length ? `<div>${e.gpa ? `<strong>GPA:</strong> ${e.gpa}` : ''}${e.gpa && e.honors?.length ? ' | ' : ''}${e.honors?.length ? `<strong>Honors:</strong> ${e.honors.join(', ')}` : ''}</div>` : ''}</div>`).join('');
        return `<div class="section"><div class="section-title">EDUCATION</div>${eduHTML}</div>`;
      case 'achievements':
        if (!achievements?.length) return '';
        return `<div class="section"><div class="section-title">ACHIEVEMENTS</div><ul>${achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>`;
      default: return '';
    }
  };

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${personal_info?.name || 'Resume'}</title><style>
@page{size:letter;margin:0.5in}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;font-size:10pt;line-height:1.35;color:#000;-webkit-print-color-adjust:exact}
.page{padding:0.5in;max-width:8.5in;margin:0 auto}
.header{text-align:center;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #000}
.name{font-size:20pt;font-weight:bold;margin-bottom:4px}
.contact{font-size:11pt}
.section{margin-bottom:10px}
.section-title{font-size:12pt;font-weight:bold;border-bottom:1px solid #000;margin-bottom:6px;text-transform:uppercase}
.entry{margin-bottom:10px}
.row{display:flex;justify-content:space-between;align-items:baseline}
.bold{font-weight:bold;font-size:11pt}
.italic{font-style:italic;font-size:11pt}
ul{margin-left:18px;margin-top:4px;list-style-type:disc}
li{margin-bottom:2px}
strong{text-transform:capitalize}
</style></head><body><div class="page">
<div class="header"><div class="name">${personal_info?.name || ''}</div><div class="contact">${[personal_info?.email, personal_info?.phone, personal_info?.location].filter(Boolean).join(' | ')}</div>${links.length ? `<div class="contact">${links.join(' | ')}</div>` : ''}</div>
${sectionOrder.map(renderSection).join('')}
</div></body></html>`;
};

export default function ResumeGenerator() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(sampleData, null, 2));
  const [resumeData, setResumeData] = useState(sampleData);
  const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState('visual');

  const handleJsonChange = (val) => {
    setJsonInput(val);
    try { setResumeData(JSON.parse(val)); setError(''); } catch (e) { setError('Invalid JSON'); }
  };

  const handleDataChange = (newData) => {
    setResumeData(newData);
    setJsonInput(JSON.stringify(newData, null, 2));
  };

  const handleDownload = () => {
    const html = generatePrintHTML(resumeData, sectionOrder);
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.onload = () => { win.print(); };
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">R</div>
          <h1 className="text-lg font-bold">Resume<span className="text-blue-400">Builder</span></h1>
        </div>
        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded font-semibold">
          <Download size={18} /> Download PDF
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r bg-white flex flex-col">
          <div className="p-2 border-b flex gap-2 bg-gray-50">
            <button onClick={() => setEditMode('visual')} className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${editMode === 'visual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}><Eye size={16} /> Visual</button>
            <button onClick={() => setEditMode('json')} className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${editMode === 'json' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}><Code size={16} /> JSON</button>
          </div>
          <div className="flex-1 overflow-auto p-3">
            {editMode === 'json' ? (
              <div className="h-full flex flex-col">
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <textarea value={jsonInput} onChange={e => handleJsonChange(e.target.value)} className="flex-1 p-3 font-mono text-xs border rounded bg-gray-900 text-green-400" spellCheck={false} />
              </div>
            ) : (
              <FormEditor data={resumeData} setData={handleDataChange} sectionOrder={sectionOrder} setSectionOrder={setSectionOrder} />
            )}
          </div>
        </div>

        <div className="w-1/2 overflow-auto bg-gray-700 p-6 flex justify-center">
          <div className="bg-white shadow-xl origin-top scale-[0.85] xl:scale-90">
            <ResumePreview data={resumeData} sectionOrder={sectionOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}
