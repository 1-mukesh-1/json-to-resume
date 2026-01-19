import React, { useState } from 'react';
import { FileText, List, Plus, Menu, X } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import { useResume } from '../../contexts/ResumeContext';
import { Button } from '../shared/Button';

export function Header() {
  const { activeTab, setActiveTab } = useUI();
  const { newResume, isDirty } = useResume();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">R</div>
          <h1 className="text-lg font-bold">
            Resume<span className="text-blue-400">Builder</span>
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 ml-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${activeTab === tab.id 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button onClick={handleNewResume} variant="primary" size="sm">
            <Plus size={16} />
            New Resume
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-700 rounded-lg"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-700 px-4 py-3 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${activeTab === tab.id 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          
          <div className="pt-2 border-t border-gray-700">
            <Button onClick={handleNewResume} variant="primary" size="sm" className="w-full justify-center">
              <Plus size={16} />
              New Resume
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
