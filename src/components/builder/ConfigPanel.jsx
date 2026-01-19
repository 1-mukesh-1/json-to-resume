import React from 'react';
import { X } from 'lucide-react';
import { useConfig } from '../../contexts/ConfigContext';
import { FONT_OPTIONS } from '../../utils/constants';

export function ConfigPanel({ onClose }) {
  const { config, updateConfig, resetConfig } = useConfig();

  const Slider = ({ label, path, min, max, step = 1, unit = '' }) => {
    const value = path.split('.').reduce((o, k) => o[k], config);
    return (
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="font-mono">{value}{unit}</span>
        </div>
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={e => updateConfig(path, parseFloat(e.target.value))} 
          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer" 
        />
      </div>
    );
  };

  const ColorPicker = ({ label, path }) => {
    const value = path.split('.').reduce((o, k) => o[k], config);
    return (
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-600">{label}</span>
        <input 
          type="color" 
          value={value} 
          onChange={e => updateConfig(path, e.target.value)} 
          className="w-8 h-8 rounded cursor-pointer border" 
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-80 bg-white h-full shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="font-bold text-lg">Resume Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Font Family */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Font Family</label>
            <select 
              value={config.fontFamily} 
              onChange={e => updateConfig('fontFamily', e.target.value)} 
              className="w-full p-2 border rounded text-sm"
            >
              {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Flatten Skills Toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-gray-700">Flatten Skills to One Line</span>
              <input
                type="checkbox"
                checked={config.flattenSkills}
                onChange={e => updateConfig('flattenSkills', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">Combines all skills into a single comma-separated line</p>
          </div>

          {/* Font Sizes */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase">Font Sizes (pt)</h3>
            <Slider label="Name" path="fontSize.name" min={14} max={28} unit="pt" />
            <Slider label="Contact Info" path="fontSize.contact" min={8} max={14} unit="pt" />
            <Slider label="Section Headers" path="fontSize.sectionTitle" min={10} max={16} unit="pt" />
            <Slider label="Subheaders" path="fontSize.subheader" min={9} max={14} unit="pt" />
            <Slider label="Body Text" path="fontSize.body" min={8} max={12} unit="pt" />
          </div>

          {/* Layout */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase">Layout</h3>
            <Slider label="Page Margins" path="margins" min={0.25} max={1} step={0.05} unit="in" />
            <Slider label="Line Height" path="lineHeight" min={1} max={2} step={0.05} />
            <Slider label="Section Spacing" path="sectionSpacing" min={4} max={20} unit="px" />
            <Slider label="Bullet Spacing" path="bulletSpacing" min={0} max={6} unit="px" />
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase">Colors</h3>
            <ColorPicker label="Text Color" path="colors.text" />
            <ColorPicker label="Border/Lines" path="colors.border" />
          </div>

          {/* Reset */}
          <button 
            onClick={resetConfig} 
            className="w-full py-2 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}