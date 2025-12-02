import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp, Save } from 'lucide-react';

interface ConfigPanelProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ webhookUrl, setWebhookUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(webhookUrl);

  const handleSave = () => {
    setWebhookUrl(tempUrl);
    setIsOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <Settings className="w-5 h-5 text-slate-500" />
          <span>API Configuration</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      
      {isOpen && (
        <div className="p-6 border-t border-slate-200 animate-fade-in">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              n8n Webhook URL (POST)
            </label>
            <p className="text-xs text-slate-500 mb-2">
              The endpoint where the video generation workflow is hosted.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://your-n8n-instance.com/webhook/..."
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-medical-500 focus:border-medical-500 text-sm text-slate-900 bg-white"
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};