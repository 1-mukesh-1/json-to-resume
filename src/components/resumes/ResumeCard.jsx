import React, { useState } from 'react';
import { Eye, Edit, Copy, Trash2, ExternalLink, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Button } from '../shared/Button';
import { Select } from '../shared/Select';
import { RESUME_STATUSES } from '../../utils/constants';

export function ResumeCard({ resume, onView, onEdit, onDuplicate, onDelete, onStatusChange, onExport }) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const status = RESUME_STATUSES.find(s => s.value === resume.status) || RESUME_STATUSES[0];
  const formattedDate = new Date(resume.generated_at).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    await onStatusChange(resume.id, newStatus);
    setIsUpdating(false);
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        {/* Left side - Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{resume.company}</h3>
            {resume.jd_url && (
              <a 
                href={resume.jd_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-gray-400 hover:text-blue-600"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
          
          <p className="text-sm text-gray-600 truncate mb-2">{resume.role}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {resume.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {resume.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Briefcase size={12} />
              {resume.job_type || 'full-time'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Right side - Status & Actions */}
        <div className="flex flex-col items-end gap-2">
          <Select
            value={resume.status}
            onChange={handleStatusChange}
            options={RESUME_STATUSES}
            className={`text-xs px-2 py-1 ${status.color} border-0 font-medium`}
          />
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => onView(resume)} title="View">
              <Eye size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(resume)} title="Edit">
              <Edit size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDuplicate(resume.id)} title="Duplicate">
              <Copy size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onExport(resume)} title="Export JSON">
              <ExternalLink size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(resume)} title="Delete" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      {resume.applied_date && (
        <div className="mt-2 pt-2 border-t text-xs text-gray-500">
          Applied: {new Date(resume.applied_date).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}