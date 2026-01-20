import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { DEFAULT_CONFIG, DEFAULT_SECTION_ORDER, DEFAULT_SECTION_VISIBILITY, PAGE_SIZES } from '../utils/constants';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER);
  const [sectionVisibility, setSectionVisibility] = useState(DEFAULT_SECTION_VISIBILITY);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(true);
  const [editorPanelOpen, setEditorPanelOpen] = useState(true);
  
  // Store current fill percent for auto-fit
  const fillPercentRef = useRef(0);

  const updateConfig = useCallback((path, value) => {
    const keys = path.split('.');
    setConfig(prev => {
      const next = { ...prev };
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setSectionOrder(DEFAULT_SECTION_ORDER);
    setSectionVisibility(DEFAULT_SECTION_VISIBILITY);
  }, []);

  // Toggle section visibility
  const toggleSectionVisibility = useCallback((sectionId) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  // Load full config (for restoring from database)
  const loadConfig = useCallback((resumeConfig) => {
    if (resumeConfig?.settings) {
      setConfig(resumeConfig.settings);
    }
    if (resumeConfig?.sectionOrder) {
      setSectionOrder(resumeConfig.sectionOrder);
    }
    if (resumeConfig?.sectionVisibility) {
      setSectionVisibility(resumeConfig.sectionVisibility);
    }
  }, []);

  // Get current page dimensions
  const getPageDimensions = useCallback(() => {
    return PAGE_SIZES[config.pageSize] || PAGE_SIZES.letter;
  }, [config.pageSize]);

  // Update fill percent ref (called from ResumePreview)
  const setFillPercent = useCallback((percent) => {
    fillPercentRef.current = percent;
  }, []);

  // Auto-fit function - aggressively reduces settings until content should fit
  // Applies MULTIPLE reduction steps in a single update
  const autoFit = useCallback(() => {
    setConfig(prev => {
      const next = JSON.parse(JSON.stringify(prev)); // Deep clone
      
      // Define reduction steps with more aggressive values
      // Each reduction includes: path, min value, step size, and priority (lower = try first)
      const reductions = [
        // Start with spacing reductions (least impact on readability)
        { path: 'bulletSpacing', min: 0, step: 2 },
        { path: 'sectionSpacing', min: 6, step: 2 },
        { path: 'lineHeight', min: 1.1, step: 0.1 },
        // Then font sizes (more impactful)
        { path: 'fontSize.body', min: 9, step: 0.5 },
        { path: 'fontSize.subheader', min: 9, step: 0.5 },
        { path: 'fontSize.sectionTitle', min: 10, step: 0.5 },
        { path: 'fontSize.contact', min: 9, step: 0.5 },
        // Finally margins (last resort)
        { path: 'margins', min: 0.35, step: 0.05 },
      ];

      // Apply multiple iterations of reductions in a single update
      // This makes auto-fit much more responsive
      let iterations = 3; // Apply 3 rounds of reductions per click
      let anyChanged = false;
      
      for (let iter = 0; iter < iterations; iter++) {
        for (const reduction of reductions) {
          const keys = reduction.path.split('.');
          let obj = next;
          for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
          }
          const key = keys[keys.length - 1];
          const currentVal = obj[key];
          
          if (typeof currentVal === 'number' && currentVal > reduction.min) {
            obj[key] = Math.max(reduction.min, currentVal - reduction.step);
            anyChanged = true;
          }
        }
      }

      return anyChanged ? next : prev;
    });
  }, []);

  return (
    <ConfigContext.Provider value={{
      config, 
      setConfig, 
      updateConfig, 
      resetConfig,
      loadConfig,
      sectionOrder, 
      setSectionOrder,
      sectionVisibility,
      setSectionVisibility,
      toggleSectionVisibility,
      settingsPanelOpen,
      setSettingsPanelOpen,
      editorPanelOpen,
      setEditorPanelOpen,
      getPageDimensions,
      autoFit,
      setFillPercent
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
