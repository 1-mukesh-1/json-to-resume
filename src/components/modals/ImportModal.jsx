import React, { useState, useRef } from 'react';
import { X, Upload, FileJson } from 'lucide-react';
import { Button } from '../shared/Button';
import { readJsonFile } from '../../utils/exportUtils';

export function ImportModal({ isOpen, onClose, onImport }) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  if (!isOpen) return null;

  const handleFile = async (file) => {
    setError('');
    try {
      const data = await readJsonFile(file);
      // Handle both single resume and array of resumes
      const resumes = Array.isArray(data) ? data : [data];
      setPreview(resumes);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleImport = () => {
    if (preview) {
      onImport(preview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Import Resumes</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
          >
            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-gray-600">Drag & drop JSON file or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">Supports single resume or backup array</p>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}

          {preview && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileJson size={16} />
                <span>Ready to import {preview.length} resume(s)</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleImport} disabled={!preview}>Import</Button>
        </div>
      </div>
    </div>
  );
}