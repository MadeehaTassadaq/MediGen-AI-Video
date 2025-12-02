import React from 'react';
import { Activity, Video } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-medical-600 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">MediGen AI</h1>
            <p className="text-xs text-slate-500 font-medium">Hospital Video Generator</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500 text-sm">
          <Video className="w-4 h-4" />
          <span>Automated Marketing Engine</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
