import React from 'react';
import { Download, CheckCircle2, Film } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
      <div className="bg-green-50 border-b border-green-100 p-4 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-green-800">Video Generated Successfully</h3>
      </div>
      
      <div className="p-6">
        <div className="aspect-video w-full bg-slate-900 rounded-lg overflow-hidden shadow-inner relative group">
            <video 
                controls 
                className="w-full h-full object-contain"
                src={videoUrl}
                poster="https://picsum.photos/800/450?grayscale" // Generic fallback poster
            >
                Your browser does not support the video tag.
            </video>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Film className="w-4 h-4" />
            <span>Promotional Video 1080p</span>
          </div>
          
          <a 
            href={videoUrl} 
            download="hospital-promo-video.mp4"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-medical-600 hover:bg-medical-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500"
          >
            <Download className="w-4 h-4" />
            Download Video
          </a>
        </div>
      </div>
    </div>
  );
};
