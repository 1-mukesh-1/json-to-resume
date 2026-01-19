import { supabase } from '../config/supabase';

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

export async function getResumeById(id) {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

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