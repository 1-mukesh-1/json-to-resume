import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, Code, Download, Plus, Trash2, ArrowUp, ArrowDown, Settings, X } from 'lucide-react';

const sampleData = {
  personal_info: { name: "Alex Sterling", email: "alex.sterling@example.com", phone: "(555) 123-4567", linkedin: "linkedin.com/in/alexsterling", github: "github.com/alexsterling", portfolio: "alexsterling.dev", location: "San Francisco, CA" },
  summary: "Senior Frontend Engineer with 7+ years of experience building performant, scalable web applications. Deeply proficient in the React ecosystem, TypeScript, and modern state management.",
  education: [{ degree: "Bachelor of Science in Computer Science", institution: "Stanford University", location: "Stanford, CA", graduation_date: "June 2017", gpa: "3.9", honors: ["Phi Beta Kappa"] }],
  technical_skills: { languages: ["TypeScript", "JavaScript", "Python"], frameworks: ["React", "Next.js", "Tailwind CSS"], databases: ["PostgreSQL", "Redis"], cloud: ["AWS", "Docker"], tools: ["Git", "Vite", "Figma"] },
  work_experience: [
    { job_title: "Senior Frontend Engineer", company: "InnovateTech", location: "San Francisco, CA", dates: "August 2021 - Present", bullets: ["Architected micro-frontend framework, reducing build times by 60%", "Led team of 6 engineers rebuilding customer dashboard"] },
    { job_title: "Software Engineer", company: "WebSolutions Inc.", location: "Austin, TX", dates: "July 2017 - July 2021", bullets: ["Developed e-commerce platforms serving 1M+ monthly users", "Achieved 98/100 Lighthouse performance score"] }
  ],
  projects: [{ name: "React Performance Monitor", associated_with: "Open Source", dates: "2023", link: "github.com/alexsterling/rpm", bullets: ["Created lightweight React component for performance monitoring", "1.2k+ GitHub stars"] }],
  achievements: ["Speaker at React Summit 2023", "Winner of 2022 Global Hackathon"]
};

const defaultSectionOrder = ['summary', 'technical_skills', 'work_experience', 'projects', 'education', 'achievements'];

const defaultConfig = {
  fontFamily: 'Arial',
  fontSize: { name: 20, contact: 11, sectionTitle: 12, subheader: 11, body: 10 },
  margins: 0.5,
  lineHeight: 1.35,
  sectionSpacing: 10,
  bulletSpacing: 2,
  colors: { text: '#000000', border: '#000000' }
};

const fontOptions = ['Arial', 'Calibri', 'Georgia', 'Times New Roman', 'Helvetica', 'Verdana', 'Garamond', 'Cambria'];

// Config Panel Component
const ConfigPanel = ({ config, setConfig, onClose }) => {
  const update = (path, val) => {
    const keys = path.split('.');
    setConfig(prev => {
      const next = { ...prev };
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = val;
      return next;
    });
  };

  const Slider = ({ label, path, min, max, step = 1, unit = '' }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1"><span className="text-gray-600">{label}</span><span className="font-mono">{path.split('.').reduce((o, k) => o[k], config)}{unit}</span></div>
      <input type="range" min={min} max={max} step={step} value={path.split('.').reduce((o, k) => o[k], config)} onChange={e => update(path, parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer" />
    </div>
  );

  const ColorPicker = ({ label, path }) => (
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-gray-600">{label}</span>
      <input type="color" value={path.split('.').reduce((o, k) => o[k], config)} onChange={e => update(path, e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-80 bg-white h-full shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="font-bold text-lg">Resume Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Font Family */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Font Family</label>
            <select value={config.fontFamily} onChange={e => update('fontFamily', e.target.value)} className="w-full p-2 border rounded text-sm">
              {fontOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Font Sizes */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase">Font Sizes (pt)</h3>
            <Slider label="Name" path="fontSize.name" min={14} max={28} unit="pt" />
            <Slider label="Contact Info" path="fontSize.contact" min={8} max={14} unit="pt" />
            <Slider label="Section Headers" path="fontSize.sectionTitle" min={10} max={16} unit="pt" />
            <Slider label="Subheaders" path="fontSize.subheader" min={9} max={14} unit="pt" />
            <Slider label="Body Text" path="fontSize.body" min={8} max={12} unit="pt" />
          </div>

          {/* Layout */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase">Layout</h3>
            <Slider label="Page Margins" path="margins" min={0.25} max={1} step={0.05} unit="in" />
            <Slider label="Line Height" path="lineHeight" min={1} max={2} step={0.05} />
            <Slider label="Section Spacing" path="sectionSpacing" min={4} max={20} unit="px" />
            <Slider label="Bullet Spacing" path="bulletSpacing" min={0} max={6} unit="px" />
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase">Colors</h3>
            <ColorPicker label="Text Color" path="colors.text" />
            <ColorPicker label="Border/Lines" path="colors.border" />
          </div>

          {/* Reset */}
          <button onClick={() => setConfig(defaultConfig)} className="w-full py-2 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50">Reset to Defaults</button>
        </div>
      </div>
    </div>
  );
};

// Form Editor Component
const FormEditor = ({ data, setData, sectionOrder, setSectionOrder }) => {
  const [expanded, setExpanded] = useState({ personal_info: true });
  const toggle = k => setExpanded(p => ({ ...p, [k]: !p[k] }));
  const update = (section, value) => setData(p => ({ ...p, [section]: value }));
  const updateNested = (section, idx, field, val) => {
    if (idx === null) update(section, { ...data[section], [field]: val });
    else { const arr = [...data[section]]; arr[idx] = { ...arr[idx], [field]: val }; update(section, arr); }
  };
  const moveSection = (i, dir) => { const arr = [...sectionOrder]; const j = dir === 'up' ? i - 1 : i + 1; [arr[i], arr[j]] = [arr[j], arr[i]]; setSectionOrder(arr); };

  const Input = ({ label, value, onChange, multi }) => (
    <div className="mb-2">
      {label && <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>}
      {multi ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} className="w-full p-2 border rounded text-sm" rows={3} />
        : <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className="w-full p-2 border rounded text-sm" />}
    </div>
  );

  const Section = ({ id, title, children, canReorder }) => (
    <div className="border rounded mb-2 bg-white">
      <div className="flex items-center p-2 bg-gray-100">
        {canReorder && <div className="flex flex-col mr-2">
          <button onClick={() => moveSection(sectionOrder.indexOf(id), 'up')} disabled={sectionOrder.indexOf(id) === 0} className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowUp size={12} /></button>
          <button onClick={() => moveSection(sectionOrder.indexOf(id), 'down')} disabled={sectionOrder.indexOf(id) === sectionOrder.length - 1} className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowDown size={12} /></button>
        </div>}
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
          {['name', 'email', 'phone', 'location', 'linkedin', 'github', 'portfolio'].map(f => (
            <Input key={f} label={f.charAt(0).toUpperCase() + f.slice(1)} value={data.personal_info?.[f]} onChange={v => updateNested('personal_info', null, f, v)} />
          ))}
        </div>
      </Section>

      {sectionOrder.map(sid => {
        if (sid === 'summary') return <Section key={sid} id={sid} title="Summary" canReorder><Input value={data.summary} onChange={v => update('summary', v)} multi /></Section>;
        if (sid === 'technical_skills') return (
          <Section key={sid} id={sid} title="Technical Skills" canReorder>
            <p className="text-xs text-gray-500 mb-2">Comma-separated</p>
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
            <button onClick={() => update('work_experience', [...(data.work_experience || []), { job_title: '', company: '', location: '', dates: '', bullets: [''] }])} className="w-full py-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm flex items-center justify-center gap-1"><Plus size={14} /> Add</button>
          </Section>
        );
        if (sid === 'projects') return (
          <Section key={sid} id={sid} title="Projects" canReorder>
            {data.projects?.map((proj, i) => (
              <div key={i} className="border rounded p-3 mb-2 bg-gray-50 relative">
                <button onClick={() => update('projects', data.projects.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Name" value={proj.name} onChange={v => updateNested('projects', i, 'name', v)} />
                  <Input label="Dates" value={proj.dates} onChange={v => updateNested('projects', i, 'dates', v)} />
                  <Input label="Link" value={proj.link} onChange={v => updateNested('projects', i, 'link', v)} />
                  <Input label="Association" value={proj.associated_with} onChange={v => updateNested('projects', i, 'associated_with', v)} />
                </div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 mt-2">Bullets</label>
                <textarea value={proj.bullets?.join('\n')} onChange={e => updateNested('projects', i, 'bullets', e.target.value.split('\n'))} className="w-full p-2 border rounded text-sm" rows={2} />
              </div>
            ))}
            <button onClick={() => update('projects', [...(data.projects || []), { name: '', associated_with: '', dates: '', link: '', bullets: [''] }])} className="w-full py-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm flex items-center justify-center gap-1"><Plus size={14} /> Add</button>
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
            <button onClick={() => update('education', [...(data.education || []), { degree: '', institution: '', location: '', graduation_date: '', gpa: '', honors: [] }])} className="w-full py-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm flex items-center justify-center gap-1"><Plus size={14} /> Add</button>
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
            <button onClick={() => update('achievements', [...(data.achievements || []), ''])} className="w-full py-2 text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 text-sm flex items-center justify-center gap-1"><Plus size={14} /> Add</button>
          </Section>
        );
        return null;
      })}
    </div>
  );
};

// Resume Preview with Config
const ResumePreview = ({ data, sectionOrder, config }) => {
  if (!data) return null;
  const { personal_info, summary, education, technical_skills, work_experience, projects, achievements } = data;
  const { fontFamily, fontSize, margins, lineHeight, sectionSpacing, bulletSpacing, colors } = config;

  const styles = {
    page: { fontFamily, fontSize: `${fontSize.body}pt`, lineHeight, color: colors.text, background: '#fff', padding: `${margins}in`, width: '8.5in', minHeight: '11in', boxSizing: 'border-box' },
    header: { textAlign: 'center', marginBottom: `${sectionSpacing}px`, paddingBottom: '8px', borderBottom: `1px solid ${colors.border}` },
    name: { fontSize: `${fontSize.name}pt`, fontWeight: 'bold', marginBottom: '4px' },
    contact: { fontSize: `${fontSize.contact}pt` },
    section: { marginBottom: `${sectionSpacing}px` },
    sectionTitle: { fontSize: `${fontSize.sectionTitle}pt`, fontWeight: 'bold', borderBottom: `1px solid ${colors.border}`, marginBottom: '6px', textTransform: 'uppercase' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
    bold: { fontWeight: 'bold', fontSize: `${fontSize.subheader}pt` },
    italic: { fontStyle: 'italic', fontSize: `${fontSize.subheader}pt` },
    bullets: { marginLeft: '18px', marginTop: '4px', listStyleType: 'disc' },
    bullet: { marginBottom: `${bulletSpacing}px` }
  };

  const renderSection = id => {
    switch (id) {
      case 'summary': return summary && <div key={id} style={styles.section}><div style={styles.sectionTitle}>Professional Summary</div><p>{summary}</p></div>;
      case 'technical_skills': return technical_skills && (
        <div key={id} style={styles.section}><div style={styles.sectionTitle}>Technical Skills</div>
          {Object.entries(technical_skills).map(([cat, skills]) => skills?.length > 0 && <div key={cat}><strong style={{ textTransform: 'capitalize' }}>{cat.replace(/_/g, ' ')}:</strong> {skills.join(', ')}</div>)}
        </div>
      );
      case 'work_experience': return work_experience?.length > 0 && (
        <div key={id} style={styles.section}><div style={styles.sectionTitle}>Work Experience</div>
          {work_experience.map((j, i) => <div key={i} style={{ marginBottom: '10px' }}>
            <div style={styles.row}><span style={styles.bold}>{j.company}</span><span style={styles.bold}>{j.dates}</span></div>
            <div style={styles.row}><span style={styles.italic}>{j.job_title}</span><span style={styles.italic}>{j.location}</span></div>
            <ul style={styles.bullets}>{j.bullets?.map((b, k) => <li key={k} style={styles.bullet}>{b}</li>)}</ul>
          </div>)}
        </div>
      );
      case 'projects': return projects?.length > 0 && (
        <div key={id} style={styles.section}><div style={styles.sectionTitle}>Projects</div>
          {projects.map((p, i) => <div key={i} style={{ marginBottom: '10px' }}>
            <div style={styles.row}><span style={styles.bold}>{p.name}{p.link && ` | ${p.link}`}</span><span style={styles.bold}>{p.dates}</span></div>
            {p.associated_with && <div style={styles.italic}>{p.associated_with}</div>}
            <ul style={styles.bullets}>{p.bullets?.map((b, k) => <li key={k} style={styles.bullet}>{b}</li>)}</ul>
          </div>)}
        </div>
      );
      case 'education': return education?.length > 0 && (
        <div key={id} style={styles.section}><div style={styles.sectionTitle}>Education</div>
          {education.map((e, i) => <div key={i} style={{ marginBottom: '8px' }}>
            <div style={styles.row}><span style={styles.bold}>{e.institution}</span><span style={styles.bold}>{e.graduation_date}</span></div>
            <div style={styles.row}><span style={styles.italic}>{e.degree}</span><span style={styles.italic}>{e.location}</span></div>
            {(e.gpa || e.honors?.length > 0) && <div style={{ marginTop: '2px' }}>{e.gpa && <span><strong>GPA:</strong> {e.gpa}</span>}{e.gpa && e.honors?.length > 0 && ' | '}{e.honors?.length > 0 && <span><strong>Honors:</strong> {e.honors.join(', ')}</span>}</div>}
          </div>)}
        </div>
      );
      case 'achievements': return achievements?.length > 0 && <div key={id} style={styles.section}><div style={styles.sectionTitle}>Achievements</div><ul style={styles.bullets}>{achievements.map((a, i) => <li key={i} style={styles.bullet}>{a}</li>)}</ul></div>;
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

// Generate Print HTML with Config
const generatePrintHTML = (data, sectionOrder, config) => {
  const { personal_info, summary, education, technical_skills, work_experience, projects, achievements } = data;
  const { fontFamily, fontSize, margins, lineHeight, sectionSpacing, bulletSpacing, colors } = config;
  const links = [personal_info?.linkedin && 'LinkedIn', personal_info?.github && 'GitHub', personal_info?.portfolio && 'Portfolio'].filter(Boolean);

  const renderSection = id => {
    switch (id) {
      case 'summary': return summary ? `<div class="section"><div class="section-title">PROFESSIONAL SUMMARY</div><p>${summary}</p></div>` : '';
      case 'technical_skills': if (!technical_skills) return ''; return `<div class="section"><div class="section-title">TECHNICAL SKILLS</div>${Object.entries(technical_skills).filter(([_, s]) => s?.length > 0).map(([c, s]) => `<div><strong>${c.replace(/_/g, ' ')}:</strong> ${s.join(', ')}</div>`).join('')}</div>`;
      case 'work_experience': if (!work_experience?.length) return ''; return `<div class="section"><div class="section-title">WORK EXPERIENCE</div>${work_experience.map(j => `<div class="entry"><div class="row"><span class="bold">${j.company}</span><span class="bold">${j.dates}</span></div><div class="row"><span class="italic">${j.job_title}</span><span class="italic">${j.location}</span></div><ul>${j.bullets?.map(b => `<li>${b}</li>`).join('')}</ul></div>`).join('')}</div>`;
      case 'projects': if (!projects?.length) return ''; return `<div class="section"><div class="section-title">PROJECTS</div>${projects.map(p => `<div class="entry"><div class="row"><span class="bold">${p.name}${p.link ? ` | ${p.link}` : ''}</span><span class="bold">${p.dates}</span></div>${p.associated_with ? `<div class="italic">${p.associated_with}</div>` : ''}<ul>${p.bullets?.map(b => `<li>${b}</li>`).join('')}</ul></div>`).join('')}</div>`;
      case 'education': if (!education?.length) return ''; return `<div class="section"><div class="section-title">EDUCATION</div>${education.map(e => `<div class="entry"><div class="row"><span class="bold">${e.institution}</span><span class="bold">${e.graduation_date}</span></div><div class="row"><span class="italic">${e.degree}</span><span class="italic">${e.location}</span></div>${e.gpa || e.honors?.length ? `<div>${e.gpa ? `<strong>GPA:</strong> ${e.gpa}` : ''}${e.gpa && e.honors?.length ? ' | ' : ''}${e.honors?.length ? `<strong>Honors:</strong> ${e.honors.join(', ')}` : ''}</div>` : ''}</div>`).join('')}</div>`;
      case 'achievements': if (!achievements?.length) return ''; return `<div class="section"><div class="section-title">ACHIEVEMENTS</div><ul>${achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>`;
      default: return '';
    }
  };

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${personal_info?.name || 'Resume'}</title><style>
@page{size:letter;margin:${margins}in}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:${fontFamily},sans-serif;font-size:${fontSize.body}pt;line-height:${lineHeight};color:${colors.text};-webkit-print-color-adjust:exact}
.page{padding:${margins}in;max-width:8.5in;margin:0 auto}
.header{text-align:center;margin-bottom:${sectionSpacing}px;padding-bottom:8px;border-bottom:1px solid ${colors.border}}
.name{font-size:${fontSize.name}pt;font-weight:bold;margin-bottom:4px}
.contact{font-size:${fontSize.contact}pt}
.section{margin-bottom:${sectionSpacing}px}
.section-title{font-size:${fontSize.sectionTitle}pt;font-weight:bold;border-bottom:1px solid ${colors.border};margin-bottom:6px;text-transform:uppercase}
.entry{margin-bottom:10px}
.row{display:flex;justify-content:space-between;align-items:baseline}
.bold{font-weight:bold;font-size:${fontSize.subheader}pt}
.italic{font-style:italic;font-size:${fontSize.subheader}pt}
ul{margin-left:18px;margin-top:4px;list-style-type:disc}
li{margin-bottom:${bulletSpacing}px}
strong{text-transform:capitalize}
</style></head><body><div class="page">
<div class="header"><div class="name">${personal_info?.name || ''}</div><div class="contact">${[personal_info?.email, personal_info?.phone, personal_info?.location].filter(Boolean).join(' | ')}</div>${links.length ? `<div class="contact">${links.join(' | ')}</div>` : ''}</div>
${sectionOrder.map(renderSection).join('')}
</div></body></html>`;
};

// Main App
export default function ResumeGenerator() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(sampleData, null, 2));
  const [resumeData, setResumeData] = useState(sampleData);
  const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder);
  const [config, setConfig] = useState(defaultConfig);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState('visual');
  const [showConfig, setShowConfig] = useState(false);

  const handleJsonChange = val => { setJsonInput(val); try { setResumeData(JSON.parse(val)); setError(''); } catch { setError('Invalid JSON'); } };
  const handleDataChange = d => { setResumeData(d); setJsonInput(JSON.stringify(d, null, 2)); };
  const handleDownload = () => { const html = generatePrintHTML(resumeData, sectionOrder, config); const win = window.open('', '_blank'); win.document.write(html); win.document.close(); win.onload = () => win.print(); };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">R</div>
          <h1 className="text-lg font-bold">Resume<span className="text-blue-400">Builder</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowConfig(true)} className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"><Settings size={18} /> Settings</button>
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded font-semibold"><Download size={18} /> Download PDF</button>
        </div>
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
            ) : <FormEditor data={resumeData} setData={handleDataChange} sectionOrder={sectionOrder} setSectionOrder={setSectionOrder} />}
          </div>
        </div>

        <div className="w-1/2 overflow-auto bg-gray-700 p-6 flex justify-center">
          <div className="bg-white shadow-xl origin-top scale-[0.75] xl:scale-[0.85]">
            <ResumePreview data={resumeData} sectionOrder={sectionOrder} config={config} />
          </div>
        </div>
      </div>

      {showConfig && <ConfigPanel config={config} setConfig={setConfig} onClose={() => setShowConfig(false)} />}
    </div>
  );
}