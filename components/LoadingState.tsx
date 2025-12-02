import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="relative">
        <div className="absolute inset-0 bg-medical-200 rounded-full blur-lg opacity-50 animate-pulse"></div>
        <div className="relative bg-white p-4 rounded-full shadow-sm mb-6">
            <Loader2 className="w-10 h-10 text-medical-600 animate-spin" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
        AI Processing <Sparkles className="w-4 h-4 text-amber-400" />
      </h3>
      <p className="text-slate-500 max-w-sm">
        Generating professional voiceover, animating scenes, and rendering your video. This typically takes 30-60 seconds.
      </p>
      
      <div className="w-64 h-1.5 bg-slate-100 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-medical-500 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};
