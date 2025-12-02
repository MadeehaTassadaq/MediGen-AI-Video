import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Plus } from 'lucide-react';
import { ACCEPTED_IMAGE_TYPES } from '../constants';

interface FileUploaderProps {
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ selectedFiles, onFilesChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file: File) => file.type.startsWith('image/'));
    
    if (droppedFiles.length > 0) {
      onFilesChange([...selectedFiles, ...droppedFiles]);
    } else {
      alert("Please upload valid image files.");
    }
  }, [selectedFiles, onFilesChange]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...selectedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          w-full h-32 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center cursor-pointer mb-4
          ${isDragging 
            ? 'border-medical-500 bg-medical-50' 
            : 'border-slate-300 hover:border-medical-400 hover:bg-slate-50'
          }
        `}
      >
        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
          <div className="bg-white p-2 rounded-full shadow-sm mb-2">
            <UploadCloud className={`w-6 h-6 ${isDragging ? 'text-medical-600' : 'text-slate-400'}`} />
          </div>
          <span className="text-sm font-medium text-slate-700">
            Click to upload images
          </span>
          <span className="text-xs text-slate-500 mt-1">
            or drag and drop multiple files
          </span>
          <input 
            type="file" 
            className="hidden" 
            multiple
            accept={ACCEPTED_IMAGE_TYPES}
            onChange={handleFileInput}
          />
        </label>
      </div>

      {/* Preview Grid */}
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
          {selectedFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative group aspect-square bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
              <img 
                src={URL.createObjectURL(file)} 
                alt={`Preview ${index}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <p className="text-white text-xs px-2 text-center truncate w-full">{file.name}</p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                type="button"
                aria-label="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <label className="aspect-square flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg hover:border-medical-400 hover:bg-slate-50 cursor-pointer transition-colors">
             <Plus className="w-6 h-6 text-slate-400" />
             <input 
                type="file" 
                className="hidden" 
                multiple
                accept={ACCEPTED_IMAGE_TYPES}
                onChange={handleFileInput}
            />
          </label>
        </div>
      )}
      
      {selectedFiles.length === 0 && (
        <p className="text-xs text-slate-400 italic text-center mt-2">
           No images selected. Please upload at least one image for the video.
        </p>
      )}
    </div>
  );
};