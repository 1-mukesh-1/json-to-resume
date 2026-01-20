import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, pdf } from '@react-pdf/renderer';
import { PAGE_SIZES, PDF_FONTS } from '../../utils/constants';
import { flattenSkills } from '../../utils/schemaTransform';

// Create styles dynamically based on config
const createStyles = (config, pageSize) => StyleSheet.create({
  page: {
    padding: config.margins * 72, // Convert inches to points
    fontFamily: PDF_FONTS[config.fontFamily] || 'Helvetica',
    fontSize: config.fontSize.body,
    lineHeight: config.lineHeight,
    color: config.colors.text,
  },
  header: {
    textAlign: 'center',
    marginBottom: config.sectionSpacing,
  },
  name: {
    fontSize: config.fontSize.name,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contact: {
    fontSize: config.fontSize.contact,
    marginBottom: 2,
  },
  link: {
    color: config.colors.text,
    textDecoration: 'underline',
  },
  section: {
    marginBottom: config.sectionSpacing,
  },
  sectionTitle: {
    fontSize: config.fontSize.sectionTitle,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: config.colors.border,
    borderBottomStyle: 'solid',
    marginBottom: 6,
    paddingBottom: 2,
  },
  entry: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  bold: {
    fontWeight: 'bold',
    fontSize: config.fontSize.subheader,
  },
  italic: {
    fontStyle: 'italic',
    fontSize: config.fontSize.subheader,
  },
  bulletList: {
    marginLeft: 12,
    marginTop: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: config.bulletSpacing,
  },
  bullet: {
    width: 10,
    fontSize: config.fontSize.body,
  },
  bulletText: {
    flex: 1,
    fontSize: config.fontSize.body,
  },
  skillLine: {
    marginBottom: 2,
  },
  skillCategory: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

// Bullet list component
const BulletList = ({ items, styles }) => (
  <View style={styles.bulletList}>
    {items?.filter(Boolean).map((item, i) => (
      <View key={i} style={styles.bulletItem}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
);

// Main PDF Document component
export const ResumePDFDocument = ({ data, config, sectionOrder, sectionVisibility = {} }) => {
  const pageSize = PAGE_SIZES[config.pageSize] || PAGE_SIZES.letter;
  const styles = createStyles(config, pageSize);
  
  const { personal_info, summary, education, technical_skills, work_experience, projects, achievements } = data;

  const links = [
    personal_info?.linkedin && { label: 'LinkedIn', url: personal_info.linkedin },
    personal_info?.github && { label: 'GitHub', url: personal_info.github },
    personal_info?.portfolio && { label: 'Portfolio', url: personal_info.portfolio }
  ].filter(Boolean);

  const renderSection = (id) => {
    switch (id) {
      case 'summary':
        return summary ? (
          <View key={id} style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text>{summary}</Text>
          </View>
        ) : null;

      case 'technical_skills':
        if (!technical_skills) return null;
        return (
          <View key={id} style={styles.section}>
            <Text style={styles.sectionTitle}>{config.flattenSkills ? 'Skills' : 'Technical Skills'}</Text>
            {config.flattenSkills ? (
              <Text>{flattenSkills(technical_skills)}</Text>
            ) : (
              Object.entries(technical_skills).map(([cat, skills]) =>
                skills?.length > 0 && (
                  <View key={cat} style={styles.skillLine}>
                    <Text>
                      <Text style={styles.skillCategory}>{cat.replace(/_/g, ' ')}: </Text>
                      {skills.join(', ')}
                    </Text>
                  </View>
                )
              )
            )}
          </View>
        );

      case 'work_experience':
        return work_experience?.length > 0 ? (
          <View key={id} style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {work_experience.map((job, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{job.company}</Text>
                  <Text style={styles.bold}>{job.dates}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.italic}>{job.job_title}</Text>
                  <Text style={styles.italic}>{job.location}</Text>
                </View>
                <BulletList items={job.bullets} styles={styles} />
              </View>
            ))}
          </View>
        ) : null;

      case 'projects':
        return projects?.length > 0 ? (
          <View key={id} style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.row}>
                  <Text style={styles.bold}>
                    {proj.name}{proj.link ? ` | ${proj.link}` : ''}
                  </Text>
                  <Text style={styles.bold}>{proj.dates}</Text>
                </View>
                {proj.associated_with && <Text style={styles.italic}>{proj.associated_with}</Text>}
                <BulletList items={proj.bullets} styles={styles} />
              </View>
            ))}
          </View>
        ) : null;

      case 'education':
        return education?.length > 0 ? (
          <View key={id} style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{edu.institution}</Text>
                  <Text style={styles.bold}>{edu.dates}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.italic}>{edu.degree}</Text>
                  <Text style={styles.italic}>{edu.location}</Text>
                </View>
                {(edu.gpa || edu.honors?.length > 0) && (
                  <Text>
                    {edu.gpa && <Text><Text style={styles.skillCategory}>GPA:</Text> {edu.gpa}</Text>}
                    {edu.gpa && edu.honors?.length > 0 && ' | '}
                    {edu.honors?.length > 0 && <Text><Text style={styles.skillCategory}>Honors:</Text> {edu.honors.join(', ')}</Text>}
                  </Text>
                )}
                {edu.coursework && (
                  <Text><Text style={styles.skillCategory}>Coursework:</Text> {edu.coursework}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'achievements':
        return achievements?.length > 0 ? (
          <View key={id} style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <BulletList items={achievements} styles={styles} />
          </View>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size={[pageSize.widthPt, pageSize.heightPt]} style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal_info?.name}</Text>
          <Text style={styles.contact}>
            {[personal_info?.email, personal_info?.phone, personal_info?.location].filter(Boolean).join(' | ')}
          </Text>
          {links.length > 0 && (
            <Text style={styles.contact}>
              {links.map((l, i) => (
                <Text key={l.label}>
                  {i > 0 && ' | '}
                  <Link src={l.url.startsWith('http') ? l.url : `https://${l.url}`} style={styles.link}>
                    {l.label}
                  </Link>
                </Text>
              ))}
            </Text>
          )}
        </View>

        {/* Sections */}
        {sectionOrder.filter(id => sectionVisibility[id] !== false).map(renderSection)}
      </Page>
    </Document>
  );
};

// Generate PDF blob for download
export const generatePDFBlob = async (data, config, sectionOrder, sectionVisibility) => {
  const doc = <ResumePDFDocument data={data} config={config} sectionOrder={sectionOrder} sectionVisibility={sectionVisibility} />;
  const blob = await pdf(doc).toBlob();
  return blob;
};

// Download PDF
export const downloadPDF = async (data, config, sectionOrder, sectionVisibility, filename = 'resume.pdf') => {
  const blob = await generatePDFBlob(data, config, sectionOrder, sectionVisibility);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
