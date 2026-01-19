import React from 'react';
import { UIProvider, useUI } from './contexts/UIContext';
import { ConfigProvider } from './contexts/ConfigContext';
import { ResumeProvider } from './contexts/ResumeContext';
import { Header } from './components/layout/Header';
import { BuilderPage } from './components/builder/BuilderPage';
import { ResumesPage } from './components/resumes/ResumesPage';
import { Toast } from './components/shared/Toast';

function AppContent() {
  const { activeTab, toast } = useUI();

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      
      {activeTab === 'builder' && <BuilderPage />}
      {activeTab === 'resumes' && <ResumesPage />}
      
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default function App() {
  return (
    <UIProvider>
      <ConfigProvider>
        <ResumeProvider>
          <AppContent />
        </ResumeProvider>
      </ConfigProvider>
    </UIProvider>
  );
}