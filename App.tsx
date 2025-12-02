import React, { useState } from 'react';
import { Send, AlertCircle, RefreshCw, Upload } from 'lucide-react';
import Header from './components/Header';
import { FileUploader } from './components/FileUploader';
import { VideoPlayer } from './components/VideoPlayer';
import { LoadingState } from './components/LoadingState';
import { generateVideo } from './services/api';
import { GenerationStatus, HospitalDetails } from './types';

const App: React.FC = () => {
  // Form State
  const [details, setDetails] = useState<HospitalDetails>({
    name: '',
    email: '',
    doctorName: '',
    specialty: '',
    timings: '',
    services: ''
  });

  const [images, setImages] = useState<File[]>([]);
  
  // Application Status State
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!details.name || !details.email || !details.services) {
       setErrorMessage("Please fill in the Hospital Name, Email ID, and Services.");
       window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }
    
    if (images.length === 0) {
      setErrorMessage("Please upload at least one hospital image.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setStatus(GenerationStatus.LOADING);
    setErrorMessage(null);
    setVideoUrl(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // We only send details and images. The n8n backend handles script generation.
      const url = await generateVideo({ details, images });
      setVideoUrl(url);
      setStatus(GenerationStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
      setErrorMessage(error.message || "An unexpected error occurred while generating the video.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-900">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Create Professional Hospital Videos</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Enter your hospital details below. Our AI Agent will generate the script and video automatically.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 text-sm animate-fade-in shadow-sm whitespace-pre-wrap">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success / Video Display */}
        {status === GenerationStatus.SUCCESS && videoUrl && (
           <div className="mb-10 max-w-3xl mx-auto">
             <VideoPlayer videoUrl={videoUrl} />
             <button 
                onClick={() => {
                    setStatus(GenerationStatus.IDLE);
                    setImages([]);
                    setVideoUrl(null);
                    setDetails({ name: '', email: '', doctorName: '', specialty: '', timings: '', services: '' });
                }}
                className="mt-6 text-medical-700 font-medium hover:underline text-sm flex items-center gap-2 mx-auto"
             >
                <RefreshCw className="w-4 h-4" /> Start Over & Create Another Video
             </button>
           </div>
        )}

        {/* Loading State */}
        {status === GenerationStatus.LOADING && (
            <div className="max-w-xl mx-auto">
              <LoadingState />
            </div>
        )}

        {/* Main Form Interface */}
        {(status === GenerationStatus.IDLE || status === GenerationStatus.ERROR) && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT COLUMN: Hospital Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 h-fit">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-medical-100 flex items-center justify-center text-medical-600 font-bold text-sm">1</div>
                <h3 className="text-xl font-semibold text-slate-900">Hospital Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Name</label>
                  <input
                    type="text"
                    name="name"
                    value={details.name}
                    onChange={handleDetailChange}
                    placeholder="e.g. City General Hospital"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email ID</label>
                  <input
                    type="email"
                    name="email"
                    value={details.email}
                    onChange={handleDetailChange}
                    placeholder="e.g. contact@cityhospital.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Name / Head</label>
                  <input
                    type="text"
                    name="doctorName"
                    value={details.doctorName}
                    onChange={handleDetailChange}
                    placeholder="e.g. Dr. Sarah Smith"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                    <input
                      type="text"
                      name="specialty"
                      value={details.specialty}
                      onChange={handleDetailChange}
                      placeholder="e.g. Cardiology"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Timings</label>
                    <input
                      type="text"
                      name="timings"
                      value={details.timings}
                      onChange={handleDetailChange}
                      placeholder="e.g. 24/7 Emergency"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Key Services Offered</label>
                  <textarea
                    name="services"
                    value={details.services}
                    onChange={handleDetailChange}
                    rows={4}
                    placeholder="e.g. Heart surgery, Rehabilitation, OPD..."
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-medical-500 focus:border-medical-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Images & Action */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col h-full">
               <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-medical-100 flex items-center justify-center text-medical-600 font-bold text-sm">2</div>
                <h3 className="text-xl font-semibold text-slate-900">Media Uploads</h3>
              </div>

              <div className="flex-1 flex flex-col">
                {/* Image Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hospital Images
                  </label>
                  <FileUploader selectedFiles={images} onFilesChange={setImages} />
                </div>

                <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
                   <h4 className="text-sm font-semibold text-slate-700 mb-1">How it works</h4>
                   <p className="text-xs text-slate-500">
                      We will send these details and images to our AI Agent. The agent will write a compelling script and generate your professional video automatically.
                   </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white shadow-md transition-all bg-medical-600 hover:bg-medical-700 hover:shadow-lg active:transform active:scale-[0.99]"
                >
                  <Send className="w-5 h-5" />
                  Generate Video
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
      
      <style>{`
        @keyframes progress {
            0% { width: 0%; margin-left: 0; }
            50% { width: 50%; margin-left: 25%; }
            100% { width: 100%; margin-left: 100%; }
        }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;