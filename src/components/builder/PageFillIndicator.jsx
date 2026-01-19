import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export function PageFillIndicator({ fillPercent, onAutoFit }) {
  const getStatus = () => {
    if (fillPercent < 50) return { 
      color: 'text-blue-600', 
      bg: 'bg-blue-100', 
      barColor: 'bg-blue-500',
      icon: AlertCircle,
      message: 'Consider adding more content' 
    };
    if (fillPercent <= 85) return { 
      color: 'text-green-600', 
      bg: 'bg-green-100', 
      barColor: 'bg-green-500',
      icon: CheckCircle,
      message: 'Good fit' 
    };
    if (fillPercent <= 100) return { 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100', 
      barColor: 'bg-yellow-500',
      icon: AlertCircle,
      message: 'Nearly full' 
    };
    return { 
      color: 'text-red-600', 
      bg: 'bg-red-100', 
      barColor: 'bg-red-500',
      icon: AlertTriangle,
      message: 'Content overflows!' 
    };
  };

  const status = getStatus();
  const Icon = status.icon;
  const displayPercent = Math.min(fillPercent, 120);

  return (
    <div className={`px-3 py-2 rounded-lg ${status.bg} flex items-center gap-3`}>
      <Icon size={16} className={status.color} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-medium ${status.color}`}>
            Page Fill: {Math.round(fillPercent)}%
          </span>
          <span className={`text-xs ${status.color}`}>
            {status.message}
          </span>
        </div>
        
        <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
          <div 
            className={`h-full ${status.barColor} transition-all duration-300`}
            style={{ width: `${Math.min(displayPercent, 100)}%` }}
          />
        </div>
      </div>

      {fillPercent > 100 && (
        <button
          onClick={onAutoFit}
          className="px-2 py-1 text-xs font-medium bg-white rounded border border-red-300 text-red-600 hover:bg-red-50 whitespace-nowrap"
        >
          Auto-fit
        </button>
      )}
    </div>
  );
}
