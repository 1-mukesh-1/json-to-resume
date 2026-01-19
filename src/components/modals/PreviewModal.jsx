import React, { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import { ResumePDFDocument, downloadPDF } from '../pdf/PDFDocument';
import { Button } from '../shared/Button';
import { DEFAULT_CONFIG, DEFAULT_SECTION_ORDER } from '../../utils/constants';

export function PreviewModal({ isOpen, onClose, resume }) {
  const [downloading, setDownloading] = useState(false);
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !resume) return null;

  const resumeData = resume.resume_data;
  const config = resumeData?.config || DEFAULT_CONFIG;
  const sectionOrder = DEFAULT_SECTION_ORDER;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const filename = `${resume.company}_${resume.role}.pdf`.replace(/\s+/g, '_').toLowerCase();
      await downloadPDF(resumeData, config, sectionOrder, filename);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom(z => Math.max(z - 25, 50));
  const handleResetZoom = () => setZoom(100);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{resume.company}</h3>
            <p className="text-sm text-gray-600">{resume.role}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white border rounded-lg px-2 py-1">
              <button onClick={handleZoomOut} className="p-1 hover:bg-gray-100 rounded" title="Zoom Out">
                <ZoomOut size={16} />
              </button>
              <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
              <button onClick={handleZoomIn} className="p-1 hover:bg-gray-100 rounded" title="Zoom In">
                <ZoomIn size={16} />
              </button>
              <button onClick={handleResetZoom} className="p-1 hover:bg-gray-100 rounded ml-1" title="Reset Zoom">
                <RotateCcw size={14} />
              </button>
            </div>

            <Button onClick={handleDownload} disabled={downloading} variant="success">
              <Download size={16} />
              {downloading ? 'Generating...' : 'Download PDF'}
            </Button>
            
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="flex-1 bg-gray-200 overflow-auto p-4">
          <div 
            className="flex justify-center"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <PDFViewer 
              width={650} 
              height={842} 
              showToolbar={false}
              className="shadow-xl"
            >
              <ResumePDFDocument 
                data={resumeData} 
                config={config} 
                sectionOrder={sectionOrder} 
              />
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  );
}
