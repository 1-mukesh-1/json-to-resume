import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { 
  Eye, Code, Download, Save, Settings, PanelLeftClose, PanelRightClose,
  PanelLeft, PanelRight, ZoomIn, ZoomOut, RotateCcw, FileText, Sliders, 
  GripVertical, Cloud, CloudOff, Loader2, Check
} from 'lucide-react';
import { JsonEditor } from './JsonEditor';
import { VisualEditor } from './VisualEditor';
import { ResumePreview } from './ResumePreview';
import { ConfigPanel } from './ConfigPanel';
import { PageFillIndicator } from './PageFillIndicator';
import { useResume } from '../../contexts/ResumeContext';
import { useConfig } from '../../contexts/ConfigContext';
import { useUI } from '../../contexts/UIContext';
import { Button } from '../shared/Button';
import { downloadPDF } from '../pdf/PDFDocument';

// Custom hook for responsive breakpoints
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
}

// Custom resizable divider component
function ResizeDivider({ onResize }) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      onResize(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, onResize]);

  return (
    <div
      onMouseDown={() => setIsDragging(true)}
      className={`flex-shrink-0 w-1.5 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors flex items-center justify-center group ${isDragging ? 'bg-blue-500' : ''}`}
    >
      <GripVertical size={12} className="text-gray-400 group-hover:text-white" />
    </div>
  );
}

// Autosave status indicator
function AutosaveIndicator({ status }) {
  const getContent = () => {
    switch (status) {
      case 'saving':
        return (
          <span className="flex items-center gap-1.5 text-blue-400">
            <Loader2 size={14} className="animate-spin" />
            Saving...
          </span>
        );
      case 'saved':
        return (
          <span className="flex items-center gap-1.5 text-green-400">
            <Check size={14} />
            Saved
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1.5 text-red-400">
            <CloudOff size={14} />
            Save failed
          </span>
        );
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  return (
    <div className="text-xs bg-gray-800/50 px-2 py-1 rounded">
      {content}
    </div>
  );
}

export function BuilderPage() {
  const { currentResume, saveResume, isDirty, autoSaveStatus, setConfigGetter } = useResume();
  const { config, sectionOrder, sectionVisibility, settingsPanelOpen, setSettingsPanelOpen, editorPanelOpen, setEditorPanelOpen, autoFit, loadConfig } = useConfig();
  const { showToast } = useUI();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [editMode, setEditMode] = useState('visual');
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fillPercent, setFillPercent] = useState(0);
  const [mobileTab, setMobileTab] = useState('preview');
  
  // Panel widths (in pixels)
  const [editorWidth, setEditorWidth] = useState(350);
  const [settingsWidth, setSettingsWidth] = useState(280);
  const containerRef = useRef(null);

  // Setup config getter for resume save/autosave
  useEffect(() => {
    setConfigGetter(() => ({
      config,
      sectionOrder,
      sectionVisibility
    }));
  }, [setConfigGetter, config, sectionOrder, sectionVisibility]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResume();
      showToast('Resume saved successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const meta = currentResume.job_metadata || {};
      const filename = `${meta.company || 'resume'}_${meta.role || 'document'}.pdf`.replace(/\s+/g, '_').toLowerCase();
      await downloadPDF(currentResume, config, sectionOrder, sectionVisibility, filename);
      showToast('PDF downloaded!', 'success');
    } catch (err) {
      showToast('Failed to generate PDF', 'error');
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleFillPercentChange = useCallback((percent) => {
    setFillPercent(percent);
  }, []);

  const handleAutoFit = () => {
    // Call autoFit which now applies all reductions at once
    autoFit();
  };

  const handleEditorResize = (clientX) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const maxWidth = containerRect.width * 0.5; // Allow up to 50% of screen
    const newWidth = Math.max(250, Math.min(maxWidth, clientX - containerRect.left));
    setEditorWidth(newWidth);
  };

  const handleSettingsResize = (clientX) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = Math.max(200, Math.min(400, containerRect.right - clientX));
    setSettingsWidth(newWidth);
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Tab Bar */}
        <div className="flex border-b bg-white">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'editor' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <FileText size={16} />
            Editor
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            onClick={() => setMobileTab('settings')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <Sliders size={16} />
            Settings
          </button>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-hidden">
          {mobileTab === 'editor' && (
            <div className="h-full flex flex-col bg-white">
              <div className="p-2 border-b flex items-center gap-2 bg-gray-50">
                <button 
                  onClick={() => setEditMode('visual')} 
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium ${
                    editMode === 'visual' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  <Eye size={14} /> Visual
                </button>
                <button 
                  onClick={() => setEditMode('json')} 
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium ${
                    editMode === 'json' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  <Code size={14} /> JSON
                </button>
                <div className="flex-1" />
                <AutosaveIndicator status={autoSaveStatus} />
              </div>
              <div className="flex-1 overflow-auto p-3">
                {editMode === 'json' ? <JsonEditor /> : <VisualEditor />}
              </div>
            </div>
          )}

          {mobileTab === 'preview' && (
            <div className="h-full flex flex-col bg-gray-700">
              <div className="p-2 border-b border-gray-600 flex items-center gap-2">
                <AutosaveIndicator status={autoSaveStatus} />
                {isDirty && autoSaveStatus === 'idle' && (
                  <span className="text-xs text-orange-400">Unsaved</span>
                )}
                <div className="flex-1" />
                <Button onClick={handleSave} disabled={saving} variant="ghost" size="sm" className="text-gray-300">
                  <Save size={16} />
                </Button>
                <Button onClick={handleDownload} disabled={downloading} variant="success" size="sm">
                  <Download size={16} />
                </Button>
              </div>
              <div className="px-2 py-1 bg-gray-800">
                <PageFillIndicator fillPercent={fillPercent} onAutoFit={handleAutoFit} />
              </div>
              <div className="flex-1 overflow-auto relative">
                <TransformWrapper initialScale={0.4} minScale={0.2} maxScale={2} centerOnInit>
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      <div className="absolute top-2 right-2 z-10 flex gap-1 bg-gray-800/90 rounded-lg p-1">
                        <button onClick={() => zoomOut()} className="p-2 text-white"><ZoomOut size={14} /></button>
                        <button onClick={() => resetTransform()} className="p-2 text-white"><RotateCcw size={14} /></button>
                        <button onClick={() => zoomIn()} className="p-2 text-white"><ZoomIn size={14} /></button>
                      </div>
                      <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ padding: '16px' }}>
                        <div className="shadow-2xl">
                          <ResumePreview onFillPercentChange={handleFillPercentChange} />
                        </div>
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              </div>
            </div>
          )}

          {mobileTab === 'settings' && (
            <div className="h-full overflow-auto bg-white">
              <ConfigPanel fillPercent={fillPercent} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div ref={containerRef} className="flex flex-1 overflow-hidden">
      {/* Left Panel - Editor */}
      {editorPanelOpen && (
        <>
          <div style={{ width: editorWidth }} className="flex-shrink-0 h-full flex flex-col bg-white border-r">
            {/* Editor Header */}
            <div className="p-2 border-b flex items-center gap-2 bg-gray-50">
              <button 
                onClick={() => setEditMode('visual')} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  editMode === 'visual' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Eye size={14} /> Visual
              </button>
              <button 
                onClick={() => setEditMode('json')} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  editMode === 'json' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Code size={14} /> JSON
              </button>
              
              <div className="flex-1" />
              
              <button 
                onClick={() => setEditorPanelOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded text-gray-500"
                title="Collapse Editor"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>
            
            {/* Editor Content */}
            <div className="flex-1 overflow-auto p-3">
              {editMode === 'json' ? <JsonEditor /> : <VisualEditor />}
            </div>
          </div>
          
          <ResizeDivider onResize={handleEditorResize} />
        </>
      )}

      {/* Center Panel - Preview */}
      <div className="flex-1 h-full flex flex-col bg-gray-700 min-w-0">
        {/* Preview Header */}
        <div className="p-2 border-b border-gray-600 flex items-center gap-2">
          {!editorPanelOpen && (
            <button 
              onClick={() => setEditorPanelOpen(true)}
              className="p-1.5 hover:bg-gray-600 rounded text-gray-300"
              title="Show Editor"
            >
              <PanelLeft size={16} />
            </button>
          )}
          
          <AutosaveIndicator status={autoSaveStatus} />
          
          {isDirty && autoSaveStatus === 'idle' && (
            <span className="text-xs text-orange-400 bg-orange-400/20 px-2 py-1 rounded">
              Unsaved changes
            </span>
          )}
          
          <div className="flex-1" />

          <Button onClick={handleSave} disabled={saving} variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-600">
            <Save size={16} />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          
          <Button 
            onClick={handleDownload} 
            disabled={downloading} 
            variant="success" 
            size="sm"
          >
            <Download size={16} />
            {downloading ? 'Generating...' : 'Download PDF'}
          </Button>

          {!settingsPanelOpen && (
            <button 
              onClick={() => setSettingsPanelOpen(true)}
              className="p-1.5 hover:bg-gray-600 rounded text-gray-300"
              title="Show Settings"
            >
              <PanelRight size={16} />
            </button>
          )}
        </div>
        
        {/* Page Fill Indicator */}
        <div className="px-4 py-2 bg-gray-800">
          <PageFillIndicator fillPercent={fillPercent} onAutoFit={handleAutoFit} />
        </div>
        
        {/* Preview Area with Zoom/Pan */}
        <div className="flex-1 overflow-hidden relative">
          <TransformWrapper
            initialScale={0.6}
            minScale={0.3}
            maxScale={2}
            centerOnInit
            wheel={{ step: 0.1 }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Zoom Controls */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-gray-800/90 rounded-lg p-1">
                  <button 
                    onClick={() => zoomOut()} 
                    className="p-2 hover:bg-gray-700 rounded text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button 
                    onClick={() => resetTransform()} 
                    className="p-2 hover:bg-gray-700 rounded text-white"
                    title="Reset Zoom"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button 
                    onClick={() => zoomIn()} 
                    className="p-2 hover:bg-gray-700 rounded text-white"
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
                
                <TransformComponent
                  wrapperStyle={{ width: '100%', height: '100%' }}
                  contentStyle={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '24px' }}
                >
                  <div className="shadow-2xl">
                    <ResumePreview onFillPercentChange={handleFillPercentChange} />
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      </div>

      {/* Right Panel - Settings */}
      {settingsPanelOpen && (
        <>
          <ResizeDivider onResize={handleSettingsResize} />
          
          <div style={{ width: settingsWidth }} className="flex-shrink-0 h-full flex flex-col bg-white border-l">
            {/* Settings Header */}
            <div className="p-3 border-b flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-gray-500" />
                <span className="font-semibold text-gray-700">Settings</span>
              </div>
              <button 
                onClick={() => setSettingsPanelOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded text-gray-500"
                title="Collapse Settings"
              >
                <PanelRightClose size={16} />
              </button>
            </div>
            
            {/* Settings Content */}
            <div className="flex-1 overflow-hidden">
              <ConfigPanel fillPercent={fillPercent} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
