import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_CONFIG, DEFAULT_SECTION_ORDER } from '../utils/constants';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER);

  const updateConfig = (path, value) => {
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
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    setSectionOrder(DEFAULT_SECTION_ORDER);
  };

  return (
    <ConfigContext.Provider value={{
      config, setConfig, updateConfig, resetConfig,
      sectionOrder, setSectionOrder
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);