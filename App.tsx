import React, { useState, useEffect } from 'react';
import { SAMPLE_RESUME } from './constants';
import ResumePreview from './components/ResumePreview';
import JsonEditor from './components/JsonEditor';
import FormEditor from './components/FormEditor';
import { generateResumeWithAI, improveSummaryWithAI } from './services/geminiService';
import { ResumeData } from './types';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(SAMPLE_RESUME);
  const [jsonString, setJsonString] = useState<string>(JSON.stringify(SAMPLE_RESUME, null, 2));
  const [jsonError, setJsonError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  
  const [editorMode, setEditorMode] = useState<'form' | 'json'>('form');
  const [sectionOrder, setSectionOrder] = useState<string[]>([
      'summary',
      'technical_skills',
      'work_experience',
      'projects',
      'education',
      'achievements'
  ]);

  const handleJsonChange = (newJson: string) => {
    setJsonString(newJson);
    try {
      const parsed = JSON.parse(newJson);
      setResumeData(parsed);
      setJsonError('');
    } catch (e) {
      if (e instanceof Error) {
        setJsonError(e.message);
      } else {
        setJsonError('Invalid JSON');
      }
    }
  };

  const handleFormDataChange = (newData: ResumeData) => {
      setResumeData(newData);
      setJsonString(JSON.stringify(newData, null, 2));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateResume = async () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    try {
      const newData = await generateResumeWithAI(promptInput);
      setResumeData(newData);
      setJsonString(JSON.stringify(newData, null, 2));
      setShowPromptModal(false);
      setPromptInput('');
    } catch (error) {
      alert("Failed to generate resume. Please check your API Key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImproveSummary = async () => {
    if (!resumeData.summary) return;
    setIsGenerating(true);
    try {
      const newSummary = await improveSummaryWithAI(resumeData.summary);
      const newData = { ...resumeData, summary: newSummary };
      setResumeData(newData);
      setJsonString(JSON.stringify(newData, null, 2));
    } catch (error) {
      alert("Failed to improve summary.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center no-print shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">R</div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Resume<span className="text-blue-600">Builder</span></h1>
        </div>

        <div className="flex items-center gap-4">
            <button 
                onClick={handleImproveSummary} 
                disabled={isGenerating}
                className="hidden md:flex text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-md transition-colors items-center gap-2"
            >
                {isGenerating ? 'Wait...' : '✨ Enhance Summary'}
            </button>
            
            <button 
                onClick={() => setShowPromptModal(true)}
                className="text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
            >
                Generate New
            </button>
            <button 
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                </svg>
                PDF / Print
            </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex relative">
        <div className="w-1/2 min-w-[320px] max-w-[600px] border-r border-gray-200 bg-gray-50 flex flex-col no-print z-0 h-full">
            <div className="px-4 py-2 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
                <span className="font-semibold text-gray-700">Editor</span>
                <div className="flex bg-gray-100 rounded p-1">
                    <button 
                        onClick={() => setEditorMode('form')}
                        className={`px-3 py-1 text-xs font-medium rounded transition-all ${editorMode === 'form' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Interactive
                    </button>
                    <button 
                        onClick={() => setEditorMode('json')}
                        className={`px-3 py-1 text-xs font-medium rounded transition-all ${editorMode === 'json' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        JSON
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-hidden p-4">
                {editorMode === 'form' ? (
                    <FormEditor 
                        data={resumeData} 
                        onChange={handleFormDataChange} 
                        sectionOrder={sectionOrder}
                        onOrderChange={setSectionOrder}
                    />
                ) : (
                    <JsonEditor 
                        value={jsonString} 
                        onChange={handleJsonChange} 
                        error={jsonError}
                    />
                )}
            </div>
        </div>

        <div className="flex-1 h-full overflow-auto bg-[#33373e] p-8 flex justify-center print-container">
            <div className="print:transform-none scale-[0.75] xl:scale-90 2xl:scale-100 origin-top transition-transform h-fit">
                <ResumePreview data={resumeData} sectionOrder={sectionOrder} />
            </div>
        </div>
      </main>

      {showPromptModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 no-print">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <h3 className="text-lg font-bold mb-2">Generate Resume with AI</h3>
                <p className="text-gray-600 text-sm mb-4">Enter a job title or short description (e.g., "Senior Marketing Manager" or "React Developer for FinTech").</p>
                
                <input 
                    type="text" 
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Full Stack Engineer..."
                    autoFocus
                />

                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => setShowPromptModal(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleGenerateResume}
                        disabled={isGenerating || !promptInput}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                         {isGenerating ? (
                             <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                             </>
                         ) : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;