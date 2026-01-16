import React, { useState } from 'react';
import { SAMPLE_RESUME } from './constants';
import ResumePreview from './components/ResumePreview';
import { ResumeData } from './types';
import { generateResumeWithAI } from './services/geminiService';

export default function App() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_RESUME, null, 2));
  const [resumeData, setResumeData] = useState<ResumeData>(SAMPLE_RESUME);
  const [error, setError] = useState('');
  const [view, setView] = useState<'editor' | 'preview'>('preview');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    setError('');
  };

  const parseJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setResumeData(parsed);
      setError('');
      setView('preview');
    } catch (e) {
        if (e instanceof Error) {
            setError('Invalid JSON: ' + e.message);
        } else {
            setError('Invalid JSON');
        }
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('resume-content');
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${resumeData?.personal_info?.name || 'Resume'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #000; }
          .resume { padding: 0.5in; max-width: 8.5in; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 16px; border-bottom: 1px solid #ccc; padding-bottom: 12px; }
          .header h1 { font-size: 24px; font-weight: bold; margin-bottom: 4px; }
          .header p { font-size: 11pt; }
          .section { margin-bottom: 16px; }
          .section-title { font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #666; margin-bottom: 8px; }
          .job, .project, .edu { margin-bottom: 12px; }
          .job-header, .project-header, .edu-header { display: flex; justify-content: space-between; align-items: flex-start; }
          .job-header span, .project-header span, .edu-header span { font-size: 11pt; }
          .bold { font-weight: 600; }
          ul { margin-left: 20px; margin-top: 4px; }
          li { font-size: 11pt; margin-bottom: 2px; }
          .skills p { font-size: 11pt; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .resume { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="resume">
          ${printContent.innerHTML}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleGenerateAI = async () => {
    const role = prompt("Enter a job title to generate a resume for (e.g. 'Senior React Developer'):");
    if (!role) return;
    
    setIsGenerating(true);
    try {
      const newData = await generateResumeWithAI(role);
      setResumeData(newData);
      setJsonInput(JSON.stringify(newData, null, 2));
      // Optional: Don't auto-switch to preview so they can see the JSON first, or switch if preferred.
      // setView('preview'); 
    } catch (error) {
      alert("Failed to generate resume. Please check your API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 shrink-0">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">ATS Resume Generator</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setView('editor')}
              className={`px-4 py-2 rounded ${view === 'editor' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
            >
              Edit JSON
            </button>
            <button
              onClick={() => setView('preview')}
              className={`px-4 py-2 rounded ${view === 'preview' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
            >
              Preview
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded font-semibold"
            >
              Generate PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 w-full flex-1 overflow-hidden">
        {view === 'editor' ? (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Paste your resume JSON below:</p>
              <div className="flex gap-2">
                 <button
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 text-sm disabled:opacity-50"
                  >
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </button>
                  <button
                    onClick={parseJson}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm"
                  >
                    Apply Changes
                  </button>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <textarea
              value={jsonInput}
              onChange={handleJsonChange}
              className="w-full flex-1 p-4 font-mono text-sm border rounded bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="bg-white shadow-lg h-full overflow-auto p-8 rounded">
            <ResumePreview data={resumeData} />
          </div>
        )}
      </div>
    </div>
  );
}
