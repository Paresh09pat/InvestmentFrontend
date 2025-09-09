// FileUpload component
import { useState, useRef } from 'react';
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi';
import Button from '../common/Button';

const FileUpload = ({ 
  label, 
  accept = '*/*', 
  multiple = false, 
  onFileChange,
  error,
  value,
  placeholder = 'Click to upload or drag and drop'
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (files.length === 0) return;

    const file = files[0];
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    if (onFileChange) {
      onFileChange(multiple ? files : file);
    }
  };

  const removeFile = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileChange) {
      onFileChange(null);
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 bg-white
          ${dragOver ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${error ? 'border-red-500 bg-red-50' : ''}
          ${value || preview ? 'bg-green-50 border-green-500 shadow-md' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {preview ? (
          <div className="space-y-6">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto h-40 w-40 object-cover rounded-xl shadow-md border-4 border-white"
              />
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                <FiCheck className="text-white" size={16} />
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <FiCheck className="text-green-500" size={20} />
                <span className="text-green-700 font-semibold">Document uploaded successfully</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="small"
              onClick={removeFile}
              icon={<FiX />}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            >
              Remove File
            </Button>
          </div>
        ) : value ? (
          <div className="space-y-6">
            <div className="relative">
              <div className="mx-auto h-40 w-40 bg-green-100 rounded-xl flex items-center justify-center shadow-md border-4 border-white">
                <FiFile className="text-green-600" size={48} />
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                <FiCheck className="text-white" size={16} />
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <FiCheck className="text-green-500" size={20} />
                <span className="text-green-700 font-semibold">Document uploaded successfully</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="small"
              onClick={removeFile}
              icon={<FiX />}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            >
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="mx-auto h-32 w-32 bg-gray-100 rounded-xl flex items-center justify-center">
              <FiUpload className="text-gray-500" size={48} />
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold text-lg">{placeholder}</p>
              <p className="text-sm text-gray-500">
                {accept === 'image/*' ? 'JPG, PNG, GIF up to 10MB' : 'PNG, JPG, PDF up to 10MB'}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">
                Click to browse or drag and drop your file here
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
