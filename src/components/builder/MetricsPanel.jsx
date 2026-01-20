import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useResumeMetrics } from '../../hooks/useResumeMetrics';

export function MetricsPanel({ resume, config, fillPercent }) {
  const [collapsed, setCollapsed] = useState(false);
  const metrics = useResumeMetrics(resume, config);

  const getStatusColor = (value, warn, danger) => {
    if (value >= danger) return 'text-red-600';
    if (value >= warn) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (collapsed) {
    return (
      <div className="p-3 bg-gray-50 border-t cursor-pointer hover:bg-gray-100" onClick={() => setCollapsed(false)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Resume Metrics</span>
          </div>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-t">
      <div 
        className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
        onClick={() => setCollapsed(true)}
      >
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Resume Metrics</span>
        </div>
        <ChevronUp size={16} className="text-gray-500" />
      </div>
      
      <div className="p-3 space-y-2">
        {/* Page Fill */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Page Fill</span>
          <span className={`font-bold ${getStatusColor(fillPercent, 90, 100)}`}>
            {fillPercent.toFixed(1)}%
          </span>
        </div>
        
        {/* Metrics Table */}
        <table className="w-full text-xs">
          <tbody className="divide-y">
            <tr>
              <td className="py-1.5 text-gray-600">Bullet Points</td>
              <td className="py-1.5 text-right font-medium">{metrics.bullets.total}</td>
            </tr>
            <tr>
              <td className="py-1.5 text-gray-600">Avg Length</td>
              <td className={`py-1.5 text-right font-medium ${getStatusColor(metrics.bullets.avgLength, 100, 120)}`}>
                {metrics.bullets.avgLength} chars
              </td>
            </tr>
            <tr>
              <td className="py-1.5 text-gray-600">Longest</td>
              <td className={`py-1.5 text-right font-medium ${getStatusColor(metrics.bullets.longest, 100, 120)}`}>
                {metrics.bullets.longest} chars
              </td>
            </tr>
            <tr>
              <td className="py-1.5 text-gray-600">Total Words</td>
              <td className="py-1.5 text-right font-medium">{metrics.content.totalWords}</td>
            </tr>
            <tr>
              <td className="py-1.5 text-gray-600">Sections</td>
              <td className="py-1.5 text-right font-medium">{metrics.content.sectionsIncluded}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
