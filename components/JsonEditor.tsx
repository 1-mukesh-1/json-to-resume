import React from 'react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ value, onChange, error }) => {
  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden shadow-inner border border-gray-700">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
        <span className="text-xs font-mono text-gray-400">resume.json</span>
        {error && <span className="text-xs text-red-400 bg-red-900/20 px-2 py-0.5 rounded animate-pulse">{error}</span>}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full bg-[#1e1e1e] text-green-400 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50"
        spellCheck={false}
        style={{
          lineHeight: '1.5',
          caretColor: 'white'
        }}
      />
    </div>
  );
};

export default JsonEditor;
