import { useMemo } from 'react';

/**
 * Hook to calculate various resume metrics for user feedback
 */
export function useResumeMetrics(resume, config) {
  return useMemo(() => {
    if (!resume) {
      return {
        bullets: {
          total: 0,
          avgLength: 0,
          longest: 0,
          perSection: {}
        },
        content: {
          totalWords: 0,
          sectionsIncluded: 0,
          avgWordsPerBullet: 0
        },
        typography: {
          smallestFontSize: 0,
          avgCharsPerLine: 0
        }
      };
    }

    // Calculate bullet point metrics
    const bullets = [];
    let bulletsBySection = {};

    // Work experience bullets
    if (resume.work_experience?.length > 0) {
      const workBullets = resume.work_experience.flatMap(job => 
        (job.bullets || []).filter(Boolean)
      );
      bullets.push(...workBullets);
      bulletsBySection.work_experience = workBullets.length;
    }

    // Project bullets
    if (resume.projects?.length > 0) {
      const projectBullets = resume.projects.flatMap(proj => 
        (proj.bullets || []).filter(Boolean)
      );
      bullets.push(...projectBullets);
      bulletsBySection.projects = projectBullets.length;
    }

    // Achievement bullets
    if (resume.achievements?.length > 0) {
      const achievementBullets = resume.achievements.filter(Boolean);
      bullets.push(...achievementBullets);
      bulletsBySection.achievements = achievementBullets.length;
    }

    // Bullet metrics
    const bulletLengths = bullets.map(b => b.length);
    const totalBullets = bullets.length;
    const avgBulletLength = totalBullets > 0 
      ? Math.round(bulletLengths.reduce((a, b) => a + b, 0) / totalBullets)
      : 0;
    const longestBullet = totalBullets > 0 ? Math.max(...bulletLengths) : 0;

    // Calculate total words
    const getAllText = () => {
      const texts = [];
      if (resume.summary) texts.push(resume.summary);
      if (resume.work_experience) {
        resume.work_experience.forEach(job => {
          texts.push(...(job.bullets || []).filter(Boolean));
        });
      }
      if (resume.projects) {
        resume.projects.forEach(proj => {
          texts.push(...(proj.bullets || []).filter(Boolean));
        });
      }
      if (resume.achievements) {
        texts.push(...resume.achievements.filter(Boolean));
      }
      return texts.join(' ');
    };

    const allText = getAllText();
    const totalWords = allText.split(/\s+/).filter(Boolean).length;
    const avgWordsPerBullet = totalBullets > 0 
      ? Math.round(totalWords / totalBullets)
      : 0;

    // Count included sections
    const sections = [
      resume.summary,
      resume.work_experience?.length > 0,
      resume.projects?.length > 0,
      resume.education?.length > 0,
      resume.technical_skills,
      resume.achievements?.length > 0
    ];
    const sectionsIncluded = sections.filter(Boolean).length;

    // Typography metrics
    const fontSizes = Object.values(config.fontSize).filter(f => typeof f === 'number');
    const smallestFontSize = Math.min(...fontSizes);

    // Estimate characters per line based on page width and font size
    const pageWidth = config.pageSize === 'a4' ? 8.27 : 8.5; // inches
    const contentWidth = pageWidth - (config.margins * 2);
    const charsPerInch = 10; // rough estimate for typical fonts
    const avgCharsPerLine = Math.round((contentWidth * charsPerInch * 12) / config.fontSize.body);

    return {
      bullets: {
        total: totalBullets,
        avgLength: avgBulletLength,
        longest: longestBullet,
        perSection: bulletsBySection
      },
      content: {
        totalWords,
        sectionsIncluded,
        avgWordsPerBullet
      },
      typography: {
        smallestFontSize,
        avgCharsPerLine
      }
    };
  }, [resume, config]);
}
