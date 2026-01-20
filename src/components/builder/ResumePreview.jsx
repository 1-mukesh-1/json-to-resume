import React, { useRef, useEffect, useState } from 'react';
import { useResume } from '../../contexts/ResumeContext';
import { useConfig } from '../../contexts/ConfigContext';
import { flattenSkills } from '../../utils/schemaTransform';

export function ResumePreview({ onFillPercentChange }) {
  const { currentResume } = useResume();
  const { config, sectionOrder, sectionVisibility, getPageDimensions } = useConfig();
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  
  const pageSize = getPageDimensions();
  
  // Calculate fill percentage
  useEffect(() => {
    if (contentRef.current && containerRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const pageHeight = containerRef.current.clientHeight;
      const fillPercent = (contentHeight / pageHeight) * 100;
      setIsOverflowing(fillPercent > 100);
      onFillPercentChange?.(fillPercent);
    }
  }, [currentResume, config, sectionOrder, onFillPercentChange]);
  
  if (!currentResume) return null;
  
  const { personal_info, summary, education, technical_skills, work_experience, projects, achievements } = currentResume;
  const { fontFamily, fontSize, margins, lineHeight, sectionSpacing, bulletSpacing, colors, flattenSkills: shouldFlatten } = config;

  const styles = {
    page: { 
      fontFamily, 
      fontSize: `${fontSize.body}pt`, 
      lineHeight, 
      color: colors.text, 
      background: '#fff', 
      width: `${pageSize.width}in`, 
      height: `${pageSize.height}in`, 
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isOverflowing ? '0 0 0 3px #ef4444' : '0 4px 6px -1px rgba(0,0,0,0.1)',
    },
    content: {
      padding: `${margins}in`,
      height: '100%',
      boxSizing: 'border-box',
    },
    header: { textAlign: 'center', marginBottom: `${sectionSpacing}px` },
    name: { fontSize: `${fontSize.name}pt`, fontWeight: 'bold', marginBottom: '4px' },
    contact: { fontSize: `${fontSize.contact}pt` },
    section: { marginBottom: `${sectionSpacing}px` },
    sectionTitle: { fontSize: `${fontSize.sectionTitle}pt`, fontWeight: 'bold', borderBottom: `1px solid ${colors.border}`, marginBottom: '6px' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
    bold: { fontWeight: 'bold', fontSize: `${fontSize.subheader}pt` },
    italic: { fontStyle: 'italic', fontSize: `${fontSize.subheader}pt` },
    bullets: { marginLeft: '18px', marginTop: '4px', listStyleType: 'disc' },
    bullet: { marginBottom: `${bulletSpacing}px` },
    overflowIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '40px',
      background: 'linear-gradient(transparent, rgba(239, 68, 68, 0.2))',
      display: isOverflowing ? 'block' : 'none',
    }
  };

  const renderSection = id => {
    switch (id) {
      case 'summary': 
        return summary && (
          <div key={id} style={styles.section}>
            <div style={styles.sectionTitle}>Professional Summary</div>
            <p>{summary}</p>
          </div>
        );
      
      case 'technical_skills': 
        if (!technical_skills) return null;
        return (
          <div key={id} style={styles.section}>
            <div style={styles.sectionTitle}>{shouldFlatten ? 'Skills' : 'Technical Skills'}</div>
            {shouldFlatten ? (
              <div>{flattenSkills(technical_skills)}</div>
            ) : (
              Object.entries(technical_skills).map(([cat, skills]) => 
                skills?.length > 0 && (
                  <div key={cat}>
                    <strong style={{ textTransform: 'capitalize' }}>{cat.replace(/_/g, ' ')}:</strong> {skills.join(', ')}
                  </div>
                )
              )
            )}
          </div>
        );
      
      case 'work_experience': 
        return work_experience?.length > 0 && (
          <div key={id} style={styles.section}>
            <div style={styles.sectionTitle}>Work Experience</div>
            {work_experience.map((j, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={styles.row}>
                  <span style={styles.bold}>{j.company}</span>
                  <span style={styles.bold}>{j.dates}</span>
                </div>
                <div style={styles.row}>
                  <span style={styles.italic}>{j.job_title}</span>
                  <span style={styles.italic}>{j.location}</span>
                </div>
                <ul style={styles.bullets}>
                  {j.bullets?.map((b, k) => b && <li key={k} style={styles.bullet}>{b}</li>)}
                </ul>
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
                <div style={styles.row}>
                  <span style={styles.bold}>{p.name}{p.link && ` | ${p.link}`}</span>
                  <span style={styles.bold}>{p.dates}</span>
                </div>
                {p.associated_with && <div style={styles.italic}>{p.associated_with}</div>}
                <ul style={styles.bullets}>
                  {p.bullets?.map((b, k) => b && <li key={k} style={styles.bullet}>{b}</li>)}
                </ul>
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
                <div style={styles.row}>
                  <span style={styles.bold}>{e.institution}</span>
                  <span style={styles.bold}>{e.dates}</span>
                </div>
                <div style={styles.row}>
                  <span style={styles.italic}>{e.degree}</span>
                  <span style={styles.italic}>{e.location}</span>
                </div>
                {(e.gpa || e.honors?.length > 0) && (
                  <div style={{ marginTop: '2px' }}>
                    {e.gpa && <span><strong>GPA:</strong> {e.gpa}</span>}
                    {e.gpa && e.honors?.length > 0 && ' | '}
                    {e.honors?.length > 0 && <span><strong>Honors:</strong> {e.honors.join(', ')}</span>}
                  </div>
                )}
                {e.coursework && (
                  <div style={{ marginTop: '2px' }}>
                    <strong>Coursework:</strong> {e.coursework}
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
            <ul style={styles.bullets}>
              {achievements.map((a, i) => a && <li key={i} style={styles.bullet}>{a}</li>)}
            </ul>
          </div>
        );
      
      default: 
        return null;
    }
  };

  const links = [
    personal_info?.linkedin && { label: 'LinkedIn', url: personal_info.linkedin },
    personal_info?.github && { label: 'GitHub', url: personal_info.github },
    personal_info?.portfolio && { label: 'Portfolio', url: personal_info.portfolio }
  ].filter(Boolean);

  return (
    <div ref={containerRef} style={styles.page}>
      <div ref={contentRef} style={styles.content}>
        <div style={styles.header}>
          <div style={styles.name}>{personal_info?.name}</div>
          <div style={styles.contact}>
            {[personal_info?.email, personal_info?.phone, personal_info?.location].filter(Boolean).join(' | ')}
          </div>
          {links.length > 0 && (
            <div style={styles.contact}>
              {links.map((l, i) => (
                <span key={l.label}>
                  {i > 0 && ' | '}
                  <a 
                    href={l.url.startsWith('http') ? l.url : `https://${l.url}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ color: colors.text, textDecoration: 'underline' }}
                  >
                    {l.label}
                  </a>
                </span>
              ))}
            </div>
          )}
        </div>
        {sectionOrder.filter(id => sectionVisibility[id]).map(renderSection)}
      </div>
      <div style={styles.overflowIndicator} />
    </div>
  );
}
