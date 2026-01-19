import React from 'react';
import { ResumeCard } from './ResumeCard';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { FileX } from 'lucide-react';

export function ResumeList({ 
  resumes, 
  loading, 
  onView, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onStatusChange,
  onExport 
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!resumes || resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <FileX size={48} className="mb-3 text-gray-300" />
        <p className="text-lg font-medium">No resumes found</p>
        <p className="text-sm">Create your first resume using the Builder tab</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resumes.map(resume => (
        <ResumeCard
          key={resume.id}
          resume={resume}
          onView={onView}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onExport={onExport}
        />
      ))}
    </div>
  );
}