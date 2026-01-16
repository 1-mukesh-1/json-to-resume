import React from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
  data: ResumeData | null;
  sectionOrder: string[];
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, sectionOrder }) => {
  if (!data) return (
    <div className="w-full h-full flex items-center justify-center text-gray-400">
      No data to display
    </div>
  );

  const { personal_info, summary, education, technical_skills, work_experience, projects, achievements } = data;

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'summary':
        if (!summary) return null;
        return (
          <div key="summary" className="resume-section mb-4">
            <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2 font-serif text-black tracking-wider">Professional Summary</h2>
            <p className="text-[10pt] leading-relaxed text-black font-serif">{summary}</p>
          </div>
        );

      case 'technical_skills':
        if (!technical_skills || Object.keys(technical_skills).length === 0) return null;
        return (
          <div key="technical_skills" className="resume-section mb-4">
            <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2 font-serif text-black tracking-wider">Technical Skills</h2>
            <div className="text-[10pt] space-y-1 font-serif">
              {Object.entries(technical_skills).map(([category, skills]) => {
                const skillList = skills as string[] | undefined;
                if (!skillList || skillList.length === 0) return null;
                return (
                  <div key={category} className="flex">
                    <span className="font-bold w-40 capitalize text-black flex-shrink-0">{category.replace(/_/g, ' ')}:</span>
                    <span className="flex-1 text-black">{skillList.join(', ')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'work_experience':
        if (!work_experience?.length) return null;
        return (
          <div key="work_experience" className="resume-section mb-4">
            <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-3 font-serif text-black tracking-wider">Work Experience</h2>
            <div className="space-y-4 font-serif">
              {work_experience.map((job, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-[11pt] text-black">{job.company}</span>
                    <span className="text-[11pt] text-black text-right whitespace-nowrap font-bold">{job.dates}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[11pt] text-black italic">{job.job_title}</span>
                    <span className="text-[11pt] text-black text-right italic">{job.location}</span>
                  </div>
                  <ul className="list-disc ml-5 text-[10pt] text-black space-y-1 marker:text-black">
                    {job.bullets?.map((bullet, j) => (
                      <li key={j} className="pl-1">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (!projects?.length) return null;
        return (
          <div key="projects" className="resume-section mb-4">
            <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-3 font-serif text-black tracking-wider">Projects</h2>
            <div className="space-y-3 font-serif">
              {projects.map((project, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-[11pt] text-black">{project.name}</span>
                       {project.link && (
                         <span className="text-[10pt] no-print">
                           - <a href={`https://${project.link.replace(/^https?:\/\//, '')}`} className="text-blue-800 hover:underline" target="_blank" rel="noreferrer">Link ↗</a>
                         </span>
                       )}
                    </div>
                    <span className="text-[11pt] text-black font-bold whitespace-nowrap">{project.dates}</span>
                  </div>
                  {project.associated_with && (
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[11pt] text-black italic">{project.associated_with}</span>
                    </div>
                  )}
                  <ul className="list-disc ml-5 text-[10pt] text-black space-y-1 marker:text-black">
                    {project.bullets?.map((bullet, j) => (
                      <li key={j} className="pl-1">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (!education?.length) return null;
        return (
          <div key="education" className="resume-section mb-4">
            <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-3 font-serif text-black tracking-wider">Education</h2>
            <div className="space-y-3 font-serif">
              {education.map((edu, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-[11pt] text-black">{edu.institution}</span>
                    <span className="text-[11pt] text-black font-bold whitespace-nowrap">{edu.graduation_date}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                     <span className="text-[11pt] text-black italic">{edu.degree} in {edu.major}</span>
                     <span className="text-[11pt] text-black italic">{edu.location}</span>
                  </div>
                  <div className="mt-1 text-[10pt] text-black">
                     {edu.gpa && <span className="mr-4"><span className="font-bold">GPA:</span> {edu.gpa}</span>}
                     {edu.honors && edu.honors.length > 0 && <span><span className="font-bold">Honors:</span> {edu.honors.join(', ')}</span>}
                  </div>
                  {edu.relevant_coursework && edu.relevant_coursework.length > 0 && (
                      <div className="mt-0.5 text-[10pt] text-black">
                          <span className="font-bold">Relevant Coursework:</span> {edu.relevant_coursework.join(', ')}
                      </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        if (!achievements?.length) return null;
        return (
          <div key="achievements" className="resume-section mb-4">
            <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2 font-serif text-black tracking-wider">Key Achievements</h2>
            <ul className="list-disc ml-5 text-[10pt] text-black space-y-1 marker:text-black font-serif">
              {achievements.map((achievement, i) => (
                <li key={i} className="pl-1">{achievement}</li>
              ))}
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      id="resume-content" 
      className="bg-white text-black mx-auto shadow-2xl print:shadow-none transition-all duration-300"
      style={{ 
        width: '210mm',
        minHeight: '297mm',
        padding: '0.75in',
        boxSizing: 'border-box'
      }}
    >
      <div className="text-center mb-6 pb-2">
        <h1 className="text-[20pt] font-bold mb-2 uppercase tracking-wide text-black font-serif">{personal_info?.name}</h1>
        <div className="text-[11pt] flex flex-wrap justify-center gap-x-2 text-black font-serif">
          {[personal_info?.location, personal_info?.email, personal_info?.phone].filter(Boolean).map((item, idx, arr) => (
             <React.Fragment key={idx}>
               <span>{item}</span>
               {idx < arr.length - 1 && <span className="text-black">•</span>}
             </React.Fragment>
          ))}
        </div>
        <div className="text-[11pt] flex flex-wrap justify-center gap-x-3 text-black mt-1 font-serif underline decoration-1 underline-offset-2">
          {personal_info?.linkedin && (
              <a href={`https://${personal_info.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer">
                  LinkedIn
              </a>
          )}
          {personal_info?.github && (
              <a href={`https://${personal_info.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer">
                  GitHub
              </a>
          )}
          {personal_info?.portfolio && (
              <a href={`https://${personal_info.portfolio.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer">
                  Portfolio
              </a>
          )}
        </div>
      </div>

      {sectionOrder.map(section => renderSection(section))}
    </div>
  );
};

export default ResumePreview;