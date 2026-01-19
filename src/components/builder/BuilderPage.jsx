import React, { useState } from 'react';
import { Eye, Code, Download, Settings, Save } from 'lucide-react';
import { JsonEditor } from './JsonEditor';
import { VisualEditor } from './VisualEditor';
import { ResumePreview } from './ResumePreview';
import { ConfigPanel } from './ConfigPanel';
import { useResume } from '../../contexts/ResumeContext';
import { useConfig } from '../../contexts/ConfigContext';
import { useUI } from '../../contexts/UIContext';
import { Button } from '../shared/Button';
import { flattenSkills } from '../../utils/schemaTransform';

export function BuilderPage() {
  const { currentResume, saveResume, isDirty } = useResume();
  const { config, sectionOrder } = useConfig();
  const { showToast } = useUI();
  
  const [editMode, setEditMode] = useState('visual');
  const [showConfig, setShowConfig] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResume();
      showToast('Resume saved successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    const html = generatePrintHTML(currentResume, sectionOrder, config);
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.onload = () => win.print();
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Panel - Editor */}
      <div className="w-1/2 border-r bg-white flex flex-col">
        <div className="p-2 border-b flex gap-2 bg-gray-50">
          <button 
            onClick={() => setEditMode('visual')} 
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${editMode === 'visual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Eye size={16} /> Visual
          </button>
          <button 
            onClick={() => setEditMode('json')} 
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${editMode === 'json' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Code size={16} /> JSON
          </button>
          
          <div className="flex-1" />
          
          {isDirty && (
            <span className="text-xs text-orange-600 self-center">Unsaved changes</span>
          )}
          
          <Button onClick={handleSave} disabled={saving} variant="success" size="sm">
            {saving ? <span className="animate-pulse">Saving...</span> : <><Save size={16} /> Save</>}
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-3">
          {editMode === 'json' ? <JsonEditor /> : <VisualEditor />}
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-1/2 flex flex-col bg-gray-700">
        <div className="p-2 border-b border-gray-600 flex justify-end gap-2">
          <Button onClick={() => setShowConfig(true)} variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-600">
            <Settings size={18} /> Settings
          </Button>
          <Button onClick={handleDownload} variant="success" size="sm">
            <Download size={18} /> Download PDF
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-6 flex justify-center">
          <div className="bg-white shadow-xl origin-top scale-[0.75] xl:scale-[0.85]">
            <ResumePreview />
          </div>
        </div>
      </div>

      {showConfig && <ConfigPanel onClose={() => setShowConfig(false)} />}
    </div>
  );
}

// Generate Print HTML helper function
function generatePrintHTML(data, sectionOrder, config) {
  const { personal_info, summary, education, technical_skills, work_experience, projects, achievements } = data;
  const { fontFamily, fontSize, margins, lineHeight, sectionSpacing, bulletSpacing, colors, flattenSkills: shouldFlatten } = config;
  
  const links = [
    personal_info?.linkedin && { label: 'LinkedIn', url: personal_info.linkedin },
    personal_info?.github && { label: 'GitHub', url: personal_info.github },
    personal_info?.portfolio && { label: 'Portfolio', url: personal_info.portfolio }
  ].filter(Boolean);
  const linksHTML = links.map(l => `<a href="${l.url.startsWith('http') ? l.url : `https://${l.url}`}" target="_blank">${l.label}</a>`).join(' | ');

  const renderSection = id => {
    switch (id) {
      case 'summary': 
        return summary ? `<div class="section"><div class="section-title">Professional Summary</div><p>${summary}</p></div>` : '';
      
      case 'technical_skills': 
        if (!technical_skills) return '';
        if (shouldFlatten) {
          return `<div class="section"><div class="section-title">Skills</div><div>${flattenSkills(technical_skills)}</div></div>`;
        }
        return `<div class="section"><div class="section-title">Technical Skills</div>${Object.entries(technical_skills).filter(([_, s]) => s?.length > 0).map(([c, s]) => `<div><strong>${c.replace(/_/g, ' ')}:</strong> ${s.join(', ')}</div>`).join('')}</div>`;
      
      case 'work_experience': 
        if (!work_experience?.length) return ''; 
        return `<div class="section"><div class="section-title">Work Experience</div>${work_experience.map(j => `<div class="entry"><div class="row"><span class="bold">${j.company}</span><span class="bold">${j.dates}</span></div><div class="row"><span class="italic">${j.job_title}</span><span class="italic">${j.location}</span></div><ul>${j.bullets?.filter(Boolean).map(b => `<li>${b}</li>`).join('')}</ul></div>`).join('')}</div>`;
      
      case 'projects': 
        if (!projects?.length) return ''; 
        return `<div class="section"><div class="section-title">Projects</div>${projects.map(p => `<div class="entry"><div class="row"><span class="bold">${p.name}${p.link ? ` | ${p.link}` : ''}</span><span class="bold">${p.dates}</span></div>${p.associated_with ? `<div class="italic">${p.associated_with}</div>` : ''}<ul>${p.bullets?.filter(Boolean).map(b => `<li>${b}</li>`).join('')}</ul></div>`).join('')}</div>`;
      
      case 'education': 
        if (!education?.length) return ''; 
        return `<div class="section"><div class="section-title">Education</div>${education.map(e => `<div class="entry"><div class="row"><span class="bold">${e.institution}</span><span class="bold">${e.dates}</span></div><div class="row"><span class="italic">${e.degree}</span><span class="italic">${e.location}</span></div>${e.gpa || e.honors?.length ? `<div>${e.gpa ? `<strong>GPA:</strong> ${e.gpa}` : ''}${e.gpa && e.honors?.length ? ' | ' : ''}${e.honors?.length ? `<strong>Honors:</strong> ${e.honors.join(', ')}` : ''}</div>` : ''}${e.coursework ? `<div><strong>Coursework:</strong> ${e.coursework}</div>` : ''}</div>`).join('')}</div>`;
      
      case 'achievements': 
        if (!achievements?.length) return ''; 
        return `<div class="section"><div class="section-title">Achievements</div><ul>${achievements.filter(Boolean).map(a => `<li>${a}</li>`).join('')}</ul></div>`;
      
      default: 
        return '';
    }
  };

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${personal_info?.name || 'Resume'}</title><style>
@page{size:letter;margin:${margins}in}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:${fontFamily},sans-serif;font-size:${fontSize.body}pt;line-height:${lineHeight};color:${colors.text};-webkit-print-color-adjust:exact}
.page{padding:${margins}in;max-width:8.5in;margin:0 auto}
.header{text-align:center;margin-bottom:${sectionSpacing}px}
.name{font-size:${fontSize.name}pt;font-weight:bold;margin-bottom:4px}
.contact{font-size:${fontSize.contact}pt}
.contact a{color:${colors.text};text-decoration:underline}
.section{margin-bottom:${sectionSpacing}px}
.section-title{font-size:${fontSize.sectionTitle}pt;font-weight:bold;border-bottom:1px solid ${colors.border};margin-bottom:6px}
.entry{margin-bottom:10px}
.row{display:flex;justify-content:space-between;align-items:baseline}
.bold{font-weight:bold;font-size:${fontSize.subheader}pt}
.italic{font-style:italic;font-size:${fontSize.subheader}pt}
ul{margin-left:18px;margin-top:4px;list-style-type:disc}
li{margin-bottom:${bulletSpacing}px}
strong{text-transform:capitalize}
</style></head><body><div class="page">
<div class="header"><div class="name">${personal_info?.name || ''}</div><div class="contact">${[personal_info?.email, personal_info?.phone, personal_info?.location].filter(Boolean).join(' | ')}</div>${linksHTML ? `<div class="contact">${linksHTML}</div>` : ''}</div>
${sectionOrder.map(renderSection).join('')}
</div></body></html>`;
}