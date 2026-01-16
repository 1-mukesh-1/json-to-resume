import { ResumeData } from './types';

export const SAMPLE_RESUME: ResumeData = {
  personal_info: {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    location: "San Francisco, CA"
  },
  summary: "Senior Software Engineer with 6+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud infrastructure. Led teams of 5-8 engineers delivering products used by 2M+ users.",
  education: [
    {
      degree: "Bachelor of Science",
      major: "Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      graduation_date: "May 2018",
      gpa: "3.8",
      honors: ["Magna Cum Laude", "Dean's List"],
      relevant_coursework: ["Data Structures", "Algorithms", "Distributed Systems"]
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
      dates: "Jan 2021 - Present",
      bullets: [
        "Led development of microservices architecture serving 2M+ daily active users, improving response times by 40%",
        "Mentored team of 5 junior engineers, conducting code reviews and establishing best practices",
        "Designed and implemented real-time notification system using WebSockets and Redis pub/sub",
        "Reduced infrastructure costs by 30% through optimization of AWS resources and implementing auto-scaling"
      ]
    },
    {
      job_title: "Software Engineer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      dates: "Jun 2018 - Dec 2020",
      bullets: [
        "Built React-based dashboard used by 500+ enterprise clients to manage their accounts",
        "Developed RESTful APIs in Node.js handling 10K+ requests per minute",
        "Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes",
        "Collaborated with product team to define technical requirements for new features"
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
