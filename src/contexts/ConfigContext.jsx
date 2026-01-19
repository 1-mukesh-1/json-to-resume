import React, { createContext, useContext, useState, useCallback } from 'react';
import { DEFAULT_CONFIG, DEFAULT_SECTION_ORDER, PAGE_SIZES } from '../utils/constants';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(true);
  const [editorPanelOpen, setEditorPanelOpen] = useState(true);

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
  }, []);

  // Get current page dimensions
  const getPageDimensions = useCallback(() => {
    return PAGE_SIZES[config.pageSize] || PAGE_SIZES.letter;
  }, [config.pageSize]);

  // Auto-fit function - reduces settings until content fits
  const autoFit = useCallback((currentFillPercent) => {
    if (currentFillPercent <= 100) return;

    // Progressive reduction strategy
    const reductions = [
      { path: 'bulletSpacing', min: 0, step: 1 },
      { path: 'sectionSpacing', min: 6, step: 2 },
      { path: 'lineHeight', min: 1.15, step: 0.05 },
      { path: 'fontSize.body', min: 9, step: 0.5 },
      { path: 'fontSize.subheader', min: 9, step: 0.5 },
      { path: 'margins', min: 0.3, step: 0.05 },
    ];

    setConfig(prev => {
      const next = { ...prev };
      
      for (const reduction of reductions) {
        const keys = reduction.path.split('.');
        let obj = next;
        for (let i = 0; i < keys.length - 1; i++) {
          obj = obj[keys[i]];
        }
        const currentVal = obj[keys[keys.length - 1]];
        if (currentVal > reduction.min) {
          obj[keys[keys.length - 1]] = Math.max(reduction.min, currentVal - reduction.step);
          return next;
        }
      }
      
      return next;
    });
  }, []);

  return (
    <ConfigContext.Provider value={{
      config, 
      setConfig, 
      updateConfig, 
      resetConfig,
      sectionOrder, 
      setSectionOrder,
      settingsPanelOpen,
      setSettingsPanelOpen,
      editorPanelOpen,
      setEditorPanelOpen,
      getPageDimensions,
      autoFit
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
