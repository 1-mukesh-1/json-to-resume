export function transformResumeData(data) {
  if (!data) return data;
  
  return {
    ...data,
    education: transformEducation(data.education),
    achievements: transformAchievements(data.achievements),
    technical_skills: normalizeSkillCategories(data.technical_skills)
  };
}

function transformEducation(education) {
  if (!Array.isArray(education)) return education;
  
  return education.map(edu => ({
    ...edu,
    dates: edu.dates || edu.graduation_date || '',
    coursework: edu.coursework || null
  }));
}

function transformAchievements(achievements) {
  if (!Array.isArray(achievements)) return achievements;
  
  return achievements.map(achievement => {
    if (typeof achievement === 'string') return achievement;
    
    if (typeof achievement === 'object' && achievement !== null) {
      const { title, issuer, description } = achievement;
      
      if (issuer && description) {
        return `${title} – ${issuer}: ${description}`;
      } else if (issuer && !description) {
        return `${title} – ${issuer}`;
      } else if (description && !issuer) {
        return `${title}: ${description}`;
      } else {
        return title || '';
      }
    }
    
    return String(achievement);
  });
}

function normalizeSkillCategories(skills) {
  if (!skills || typeof skills !== 'object') return skills;
  return skills;
}

export function flattenSkills(technicalSkills) {
  if (!technicalSkills || typeof technicalSkills !== 'object') return '';
  
  const allSkills = [];
  const seen = new Set();
  
  for (const category of Object.keys(technicalSkills)) {
    const skills = technicalSkills[category];
    if (Array.isArray(skills)) {
      for (const skill of skills) {
        const lower = skill.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          allSkills.push(skill);
        }
      }
    }
  }
  
  return allSkills.join(', ');
}

export function validateForSave(data) {
  const errors = [];
  
  if (!data.job_metadata) {
    errors.push('Missing job_metadata section');
  } else {
    if (!data.job_metadata.company) errors.push('Missing company in job_metadata');
    if (!data.job_metadata.role) errors.push('Missing role in job_metadata');
  }
  
  return { valid: errors.length === 0, errors };
}