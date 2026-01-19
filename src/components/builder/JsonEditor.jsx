import React from 'react';
import { useResume } from '../../contexts/ResumeContext';

export function JsonEditor() {
  const { jsonInput, jsonError, handleJsonChange } = useResume();

  return (
    <div className="h-full flex flex-col">
      {jsonError && (
        <p className="text-red-500 text-sm mb-2 px-1">{jsonError}</p>
      )}
      <textarea 
        value={jsonInput} 
        onChange={e => handleJsonChange(e.target.value)} 
        className="flex-1 p-3 font-mono text-xs border rounded bg-gray-900 text-green-400 resize-none" 
        spellCheck={false}
        placeholder="Paste your AI-generated resume JSON here..."
      />
    </div>
  );
}