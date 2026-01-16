import React from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
  data: ResumeData | null;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  if (!data) return null;
  
  const { personal_info, summary, education, technical_skills, work_experience, projects, achievements } = data;
  
  return (
    <div id="resume-content" className="bg-white text-black p-8 max-w-[8.5in] mx-auto" style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '1.4' }}>
      {/* Header */}
      <div className="text-center mb-4 border-b border-gray-300 pb-3">
        <h1 className="text-2xl font-bold mb-1">{personal_info?.name}</h1>
        <p className="text-sm">
          {[personal_info?.email, personal_info?.phone, personal_info?.location].filter(Boolean).join(' | ')}
        </p>
        <p className="text-sm">
          {[personal_info?.linkedin, personal_info?.github, personal_info?.portfolio].filter(Boolean).join(' | ')}
        </p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Summary</h2>
          <p className="text-sm">{summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      {technical_skills && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Technical Skills</h2>
          <div className="text-sm">
            {technical_skills.languages && technical_skills.languages.length > 0 && (
              <p><span className="font-semibold">Languages:</span> {technical_skills.languages.join(', ')}</p>
            )}
            {technical_skills.frameworks && technical_skills.frameworks.length > 0 && (
              <p><span className="font-semibold">Frameworks:</span> {technical_skills.frameworks.join(', ')}</p>
            )}
            {technical_skills.databases && technical_skills.databases.length > 0 && (
              <p><span className="font-semibold">Databases:</span> {technical_skills.databases.join(', ')}</p>
            )}
            {technical_skills.cloud && technical_skills.cloud.length > 0 && (
              <p><span className="font-semibold">Cloud & DevOps:</span> {technical_skills.cloud.join(', ')}</p>
            )}
            {technical_skills.tools && technical_skills.tools.length > 0 && (
              <p><span className="font-semibold">Tools:</span> {technical_skills.tools.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {work_experience?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Work Experience</h2>
          {work_experience.map((job, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold">{job.job_title}</span>
                  <span> | {job.company}</span>
                  {job.location && <span>, {job.location}</span>}
                </div>
                <span className="text-sm whitespace-nowrap ml-4">{job.dates}</span>
              </div>
              <ul className="list-disc ml-5 mt-1 text-sm">
                {job.bullets?.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Projects</h2>
          {projects.map((project, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold">{project.name}</span>
                  {project.associated_with && <span> | {project.associated_with}</span>}
                  {project.link && <span> | {project.link}</span>}
                </div>
                <span className="text-sm whitespace-nowrap ml-4">{project.dates}</span>
              </div>
              <ul className="list-disc ml-5 mt-1 text-sm">
                {project.bullets?.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Education</h2>
          {education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold">{edu.degree}</span>
                  {edu.major && <span> in {edu.major}</span>}
                  <span> | {edu.institution}</span>
                  {edu.location && <span>, {edu.location}</span>}
                </div>
                <span className="text-sm whitespace-nowrap ml-4">{edu.graduation_date}</span>
              </div>
              {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
              {edu.honors && edu.honors.length > 0 && <p className="text-sm">Honors: {edu.honors.join(', ')}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Achievements</h2>
          <ul className="list-disc ml-5 text-sm">
            {achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
