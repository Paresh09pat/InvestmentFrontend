// DocumentUploadModal component
import { useState } from 'react';
import { 
  FiShield,
  FiUpload,
  FiCheck,
  FiAlertCircle,
  FiX
} from 'react-icons/fi';
import Button from '../common/Button';
import FileUpload from '../forms/FileUpload';

const DocumentUploadModal = ({ 
  isOpen, 
  onClose, 
  documentType, 
  onFileUpload, 
  onFileChange, 
  file, 
  loading, 
  error 
}) => {
  const [localError, setLocalError] = useState('');

  const handleClose = () => {
    setLocalError('');
    onClose();
  };

  const handleSubmit = () => {
    if (!file) {
      setLocalError('Please select a file to upload');
      return;
    }
    onFileUpload();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* Modal panel */}
            <div className="inline-block relative w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl border border-gray-200">
              {/* Content wrapper */}
              <div className="w-full min-h-[400px] bg-white">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    Upload {documentType?.toUpperCase()} Document
                  </h3>
                  <button
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 bg-white">
                {/* Header with document type info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiShield className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        {documentType === 'aadhaar' ? 'Aadhaar Card Verification' : 'PAN Card Verification'}
                      </h4>
                      <p className="text-sm text-blue-700">
                        {documentType === 'aadhaar' 
                          ? 'Upload your Aadhaar card for identity verification'
                          : 'Upload your PAN card for income tax verification'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {(error || localError) && (
                  <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm mb-6">
                    <div className="flex items-center">
                      <FiAlertCircle className="text-red-500 mr-2" size={16} />
                      <span className="font-medium">{error || localError}</span>
                    </div>
                  </div>
                )}

                {/* File Upload Component */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <FileUpload
                    label={`${documentType?.toUpperCase()} Document`}
                    accept="image/*,.pdf"
                    onFileChange={onFileChange}
                    value={file}
                    placeholder="Click to upload or drag and drop your document"
                  />
                </div>

                {/* Upload Guidelines */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg mt-0.5">
                      <FiCheck className="text-green-600" size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-3">Upload Guidelines</h4>
                      <ul className="text-sm text-green-800 space-y-2">
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>File formats: JPG, PNG, PDF</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>Maximum file size: 10MB</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>Document should be clear and readable</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>All corners should be visible</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleClose}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    onClick={handleSubmit}
                    disabled={!file || loading}
                    loading={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? 'Uploading...' : 'Upload Document'}
                  </Button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentUploadModal;
