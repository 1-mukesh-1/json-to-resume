import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useConfig } from '../../contexts/ConfigContext';
import { FONT_OPTIONS, PAGE_SIZES } from '../../utils/constants';

export function ConfigPanel() {
  const { config, updateConfig, resetConfig } = useConfig();

  const Slider = ({ label, path, min, max, step = 1, unit = '' }) => {
    const value = path.split('.').reduce((o, k) => o[k], config);
    return (
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-600 font-medium">{label}</span>
          <span className="font-mono text-gray-800">{value}{unit}</span>
        </div>
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={e => updateConfig(path, parseFloat(e.target.value))} 
          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-600" 
        />
      </div>
    );
  };

  const ColorPicker = ({ label, path }) => {
    const value = path.split('.').reduce((o, k) => o[k], config);
    return (
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-600 font-medium">{label}</span>
        <input 
          type="color" 
          value={value} 
          onChange={e => updateConfig(path, e.target.value)} 
          className="w-8 h-8 rounded cursor-pointer border border-gray-300" 
        />
      </div>
    );
  };

  const SectionHeader = ({ children }) => (
    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 mt-6 first:mt-0">
      {children}
    </h3>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Page Size */}
        <SectionHeader>Page Size</SectionHeader>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(PAGE_SIZES).map(([key, size]) => (
            <button
              key={key}
              onClick={() => updateConfig('pageSize', key)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                config.pageSize === key 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium">{size.name}</div>
              <div className="text-xs text-gray-500">{size.width}" × {size.height}"</div>
            </button>
          ))}
        </div>

        {/* Font Family */}
        <SectionHeader>Typography</SectionHeader>
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Font Family</label>
          <select 
            value={config.fontFamily} 
            onChange={e => updateConfig('fontFamily', e.target.value)} 
            className="w-full p-2 border rounded-lg text-sm bg-white"
          >
            {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Flatten Skills Toggle */}
        <label className="flex items-center justify-between cursor-pointer mb-4 p-3 bg-gray-50 rounded-lg">
          <div>
            <span className="text-xs font-medium text-gray-700 block">Flatten Skills</span>
            <span className="text-xs text-gray-500">Single comma-separated line</span>
          </div>
          <input
            type="checkbox"
            checked={config.flattenSkills}
            onChange={e => updateConfig('flattenSkills', e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </label>

        {/* Font Sizes */}
        <SectionHeader>Font Sizes</SectionHeader>
        <Slider label="Name" path="fontSize.name" min={14} max={28} unit="pt" />
        <Slider label="Contact Info" path="fontSize.contact" min={8} max={14} unit="pt" />
        <Slider label="Section Headers" path="fontSize.sectionTitle" min={10} max={16} unit="pt" />
        <Slider label="Subheaders" path="fontSize.subheader" min={9} max={14} unit="pt" />
        <Slider label="Body Text" path="fontSize.body" min={8} max={12} unit="pt" />

        {/* Layout */}
        <SectionHeader>Layout & Spacing</SectionHeader>
        <Slider label="Page Margins" path="margins" min={0.25} max={1} step={0.05} unit="in" />
        <Slider label="Line Height" path="lineHeight" min={1} max={2} step={0.05} />
        <Slider label="Section Spacing" path="sectionSpacing" min={4} max={20} unit="px" />
        <Slider label="Bullet Spacing" path="bulletSpacing" min={0} max={6} unit="px" />

        {/* Colors */}
        <SectionHeader>Colors</SectionHeader>
        <ColorPicker label="Text Color" path="colors.text" />
        <ColorPicker label="Border/Lines" path="colors.border" />
      </div>

      {/* Reset Button */}
      <div className="p-4 border-t bg-gray-50">
        <button 
          onClick={resetConfig} 
          className="w-full py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-white flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
