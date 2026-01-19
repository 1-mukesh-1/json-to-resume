import React from 'react';
import { FileText, List, Plus } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import { useResume } from '../../contexts/ResumeContext';
import { Button } from '../shared/Button';

export function Header() {
  const { activeTab, setActiveTab } = useUI();
  const { newResume, isDirty } = useResume();

  const tabs = [
    { id: 'builder', label: 'Builder', icon: FileText },
    { id: 'resumes', label: 'My Resumes', icon: List }
  ];

  const handleNewResume = () => {
    if (isDirty && !confirm('You have unsaved changes. Create new resume anyway?')) {
      return;
    }
    newResume();
    setActiveTab('builder');
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">R</div>
            <h1 className="text-lg font-bold">Resume<span className="text-blue-400">Builder</span></h1>
          </div>
          
          <nav className="flex items-center ml-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <Button onClick={handleNewResume} variant="primary" size="sm">
          <Plus size={16} />
          New Resume
        </Button>
      </div>
    </header>
  );
}