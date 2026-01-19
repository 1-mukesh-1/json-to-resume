import React, { useEffect, useState } from 'react';
import { Search, Download, Upload, Filter } from 'lucide-react';
import { ResumeList } from './ResumeList';
import { ConfirmModal } from '../modals/ConfirmModal';
import { ImportModal } from '../modals/ImportModal';
import { Button } from '../shared/Button';
import { Select } from '../shared/Select';
import { useResume } from '../../contexts/ResumeContext';
import { useUI } from '../../contexts/UIContext';
import { RESUME_STATUSES } from '../../utils/constants';
import { downloadJson, generateFilename } from '../../utils/exportUtils';
import * as resumeService from '../../services/resumeService';

export function ResumesPage() {
  const { 
    resumeList, 
    loadResumes, 
    loadResume, 
    deleteResume, 
    duplicateResume, 
    updateStatus 
  } = useResume();
  const { setActiveTab, showToast } = useUI();
  
  const [loading, setLocalLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showImport, setShowImport] = useState(false);

  // Load resumes on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLocalLoading(true);
    try {
      await loadResumes(filters.status ? { status: filters.status } : {});
    } catch (err) {
      showToast('Failed to load resumes', 'error');
    } finally {
      setLocalLoading(false);
    }
  };

  // Reload when filters change
  useEffect(() => {
    loadData();
  }, [filters.status]);

  // Filter by search locally
  const filteredResumes = resumeList.filter(r => {
    if (!filters.search) return true;
    const search = filters.search.toLowerCase();
    return (
      r.company?.toLowerCase().includes(search) ||
      r.role?.toLowerCase().includes(search)
    );
  });

  const handleView = (resume) => {
    loadResume(resume.id);
    setActiveTab('builder');
  };

  const handleEdit = (resume) => {
    loadResume(resume.id);
    setActiveTab('builder');
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateResume(id);
      showToast('Resume duplicated', 'success');
    } catch (err) {
      showToast('Failed to duplicate', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteResume(deleteTarget.id);
      showToast('Resume deleted', 'success');
    } catch (err) {
      showToast('Failed to delete', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus(id, status);
      showToast('Status updated', 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleExportSingle = (resume) => {
    const data = resume.resume_data;
    const filename = generateFilename(resume);
    downloadJson(data, filename);
    showToast('Resume exported', 'success');
  };

  const handleExportAll = () => {
    const data = resumeList.map(r => r.resume_data);
    const filename = `resumes_backup_${new Date().toISOString().split('T')[0]}.json`;
    downloadJson(data, filename);
    showToast(`Exported ${data.length} resumes`, 'success');
  };

  const handleImport = async (resumes) => {
    try {
      await resumeService.importResumes(resumes);
      await loadResumes();
      showToast(`Imported ${resumes.length} resume(s)`, 'success');
    } catch (err) {
      showToast('Failed to import: ' + err.message, 'error');
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Resumes</h2>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowImport(true)}>
              <Upload size={16} /> Import
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportAll} disabled={resumeList.length === 0}>
              <Download size={16} /> Export All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company or role..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <Select
              value={filters.status}
              onChange={v => setFilters(f => ({ ...f, status: v }))}
              options={[{ value: '', label: 'All Statuses' }, ...RESUME_STATUSES]}
              className="min-w-[140px]"
            />
          </div>
        </div>

        {/* Resume List */}
        <ResumeList
          resumes={filteredResumes}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={setDeleteTarget}
          onStatusChange={handleStatusChange}
          onExport={handleExportSingle}
        />

        {/* Summary */}
        {!loading && resumeList.length > 0 && (
          <div className="mt-6 text-sm text-gray-500 text-center">
            Showing {filteredResumes.length} of {resumeList.length} resumes
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Resume"
        message={`Are you sure you want to delete the resume for "${deleteTarget?.company} - ${deleteTarget?.role}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />

      <ImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImport}
      />
    </div>
  );
}