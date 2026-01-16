import { ResumeData } from './types';

export const SAMPLE_RESUME: ResumeData = {
  personal_info: {
    name: "Alex Sterling",
    email: "alex.sterling@example.com",
    phone: "(555) 123-4567",
    linkedin: "linkedin.com/in/alexsterling",
    github: "github.com/alexsterling",
    location: "San Francisco, CA"
  },
  summary: "Senior Frontend Engineer with 7+ years of experience building performant, scalable web applications. deeply proficient in the React ecosystem, TypeScript, and modern state management. Proven track record of leading teams and improving developer velocity.",
  education: [
    {
      degree: "Bachelor of Science",
      major: "Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      graduation_date: "June 2017",
      gpa: "3.9",
      honors: ["Phi Beta Kappa", "President's Award"],
      relevant_coursework: ["Advanced Algorithms", "Web Security", "Human-Computer Interaction"]
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
      dates: "Aug 2021 - Present",
      bullets: [
        "Architected a micro-frontend framework using Module Federation, reducing build times by 60%.",
        "Led a team of 6 engineers in rebuilding the core customer dashboard, resulting in a 25% increase in user engagement.",
        "Implemented a comprehensive design system in React/TypeScript used across 4 different product lines."
      ]
    },
    {
      job_title: "Software Engineer",
      company: "WebSolutions Inc.",
      location: "Austin, TX",
      dates: "July 2017 - July 2021",
      bullets: [
        "Developed and maintained high-traffic e-commerce platforms serving 1M+ monthly users.",
        "Optimized frontend performance, achieving a 98/100 Lighthouse Core Web Vitals score.",
        "Integrated third-party payment gateways (Stripe, PayPal) ensuring PCI compliance."
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
        "Created a lightweight React component for real-time rendering performance monitoring.",
        "Garnered 1.2k+ stars on GitHub and used by several Fortune 500 companies."
      ]
    }
  ],
  achievements: [
    "Speaker at React Summit 2023 on 'Next-Gen State Management'",
    "Winner of the 2022 Global Hackathon for 'Best Accessibility Tool'"
  ]
};
