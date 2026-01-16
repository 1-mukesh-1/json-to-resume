import React from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
  data: ResumeData | null;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  if (!data) return (
    <div className="w-full h-full flex items-center justify-center text-gray-400">
      No data to display
    </div>
  );

  const { personal_info, summary, education, technical_skills, work_experience, projects, achievements } = data;

  return (
    <div 
      id="resume-content" 
      className="bg-white text-black p-12 mx-auto shadow-2xl print:shadow-none print:p-0"
      style={{ 
        width: '210mm', 
        minHeight: '297mm',
        fontFamily: "'Merriweather', serif"
      }}
    >
      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-4xl font-bold mb-2 uppercase tracking-wide text-gray-900">{personal_info?.name}</h1>
        <div className="text-sm flex flex-wrap justify-center gap-3 text-gray-700 font-sans">
          {[personal_info?.email, personal_info?.phone, personal_info?.location].filter(Boolean).map((item, idx) => (
             <span key={idx} className="flex items-center">
               {idx > 0 && <span className="mr-3 text-gray-400">•</span>}
               {item}
             </span>
          ))}
        </div>
        <div className="text-sm flex flex-wrap justify-center gap-3 text-blue-800 mt-1 font-sans">
          {[personal_info?.linkedin, personal_info?.github, personal_info?.portfolio].filter(Boolean).map((item, idx) => (
             <span key={idx} className="flex items-center">
               {idx > 0 && <span className="mr-3 text-gray-300">•</span>}
               <a href={`https://${item?.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                 {item}
               </a>
             </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-2 text-gray-500 font-sans">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-gray-800">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {technical_skills && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-2 text-gray-500 font-sans">Technical Skills</h2>
          <div className="text-sm grid grid-cols-1 gap-y-1">
            {Object.entries(technical_skills).map(([category, skills]) => {
              const skillList = skills as string[] | undefined;
              if (!skillList || skillList.length === 0) return null;
              return (
                <div key={category} className="flex">
                  <span className="font-bold w-32 capitalize text-gray-700">{category.replace('_', ' ')}:</span>
                  <span className="flex-1 text-gray-800">{skillList.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Experience */}
      {work_experience?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-3 text-gray-500 font-sans">Work Experience</h2>
          <div className="space-y-4">
            {work_experience.map((job, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-gray-900">{job.job_title}</span>
                    <span className="text-base text-gray-700 italic font-serif">{job.company}, {job.location}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-sans whitespace-nowrap">{job.dates}</span>
                </div>
                <ul className="list-disc ml-5 text-sm text-gray-800 space-y-1 marker:text-gray-400">
                  {job.bullets?.map((bullet, j) => (
                    <li key={j} className="pl-1">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-3 text-gray-500 font-sans">Projects</h2>
          <div className="space-y-3">
            {projects.map((project, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{project.name}</span>
                    {project.associated_with && <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-sans">{project.associated_with}</span>}
                    {project.link && <a href={`https://${project.link.replace(/^https?:\/\//, '')}`} className="text-xs text-blue-600 hover:underline font-sans" target="_blank" rel="noreferrer">Link ↗</a>}
                  </div>
                  <span className="text-sm text-gray-600 font-sans">{project.dates}</span>
                </div>
                <ul className="list-disc ml-5 text-sm text-gray-800 space-y-1 marker:text-gray-400">
                  {project.bullets?.map((bullet, j) => (
                    <li key={j} className="pl-1">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-3 text-gray-500 font-sans">Education</h2>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                   <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{edu.institution}</span>
                      <span className="text-gray-800">{edu.degree} in {edu.major}</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-sm text-gray-600 font-sans">{edu.location}</span>
                      <span className="text-sm text-gray-600 font-sans">{edu.graduation_date}</span>
                   </div>
                </div>
                <div className="mt-1 text-sm text-gray-700">
                   {edu.gpa && <span className="mr-4"><span className="font-semibold">GPA:</span> {edu.gpa}</span>}
                   {edu.honors && edu.honors.length > 0 && <span><span className="font-semibold">Honors:</span> {edu.honors.join(', ')}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-2 text-gray-500 font-sans">Key Achievements</h2>
          <ul className="list-disc ml-5 text-sm text-gray-800 space-y-1 marker:text-gray-400">
            {achievements.map((achievement, i) => (
              <li key={i} className="pl-1">{achievement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;