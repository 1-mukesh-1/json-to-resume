import { supabase } from '../config/supabase';

/**
 * Convert app resume data to Supabase row format
 */
function toSupabaseRow(resumeData) {
  const meta = resumeData.job_metadata || {};
  return {
    company: meta.company || 'Unknown Company',
    role: meta.role || 'Unknown Role',
    location: meta.location || null,
    job_type: meta.job_type || 'full-time',
    jd_url: meta.jd_url || null,
    status: meta.status || 'draft',
    applied_date: meta.applied_date || null,
    generated_at: meta.generated_at || new Date().toISOString(),
    resume_data: resumeData
  };
}

/**
 * Get all resumes with optional filters
 */
export async function getResumes(filters = {}) {
  let query = supabase
    .from('resumes')
    .select('*')
    .order('generated_at', { ascending: false });
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.company) {
    query = query.ilike('company', `%${filters.company}%`);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Get single resume by ID
 */
export async function getResumeById(id) {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Create new resume
 */
export async function createResume(resumeData) {
  const row = toSupabaseRow(resumeData);
  
  const { data, error } = await supabase
    .from('resumes')
    .insert(row)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Update existing resume
 */
export async function updateResume(id, resumeData) {
  const row = toSupabaseRow(resumeData);
  
  const { data, error } = await supabase
    .from('resumes')
    .update(row)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Update just the status of a resume
 */
export async function updateResumeStatus(id, status, appliedDate = null) {
  const updates = { status };
  if (appliedDate) updates.applied_date = appliedDate;
  
  const { data, error } = await supabase
    .from('resumes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Delete resume
 */
export async function deleteResume(id) {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

/**
 * Duplicate resume
 */
export async function duplicateResume(id) {
  const original = await getResumeById(id);
  
  const newResumeData = {
    ...original.resume_data,
    job_metadata: {
      ...original.resume_data.job_metadata,
      company: `${original.company} (Copy)`,
      status: 'draft',
      generated_at: new Date().toISOString()
    }
  };
  
  return createResume(newResumeData);
}

/**
 * Import multiple resumes
 */
export async function importResumes(resumesArray) {
  const rows = resumesArray.map(toSupabaseRow);
  
  const { data, error } = await supabase
    .from('resumes')
    .insert(rows)
    .select();
  
  if (error) throw error;
  return data;
}