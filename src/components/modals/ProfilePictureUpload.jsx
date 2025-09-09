import { useState, useRef } from 'react';
import { FiUpload, FiX, FiUser, FiCamera } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Modal from '../common/Modal';

const ProfilePictureUpload = ({ 
  isOpen, 
  onClose, 
  currentProfilePicture, 
  onUploadSuccess 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      const response = await fetch('/api/profile/upload-profile-picture', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      // Check if response is ok and has content
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response:', responseText);
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      toast.success('Profile picture uploaded successfully!', {
        position: "top-right",
        autoClose: 3000,
      });

      onUploadSuccess(data.user);
      handleClose();

    } catch (error) {
      console.error('Profile picture upload error:', error);
      toast.error(error.message || 'Failed to upload profile picture', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    onClose();
  };

  const handleRemovePicture = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile/delete-profile-picture', {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Delete failed');
      }

      toast.success('Profile picture removed successfully!', {
        position: "top-right",
        autoClose: 3000,
      });

      onUploadSuccess(data.user);
      handleClose();

    } catch (error) {
      console.error('Profile picture deletion error:', error);
      toast.error(error.message || 'Failed to remove profile picture', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Profile Picture"
      size="md"
    >
      <div className="space-y-6">
        {/* Current Profile Picture */}
        {currentProfilePicture && (
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Current Picture</h3>
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={currentProfilePicture}
                alt="Current profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* File Upload Area */}
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              selectedFile
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {preview ? (
              <div className="space-y-3">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-green-600 font-medium">
                  {selectedFile?.name}
                </p>
                <p className="text-xs text-gray-500">
                  Click to change or drag another image
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <FiCamera className="text-gray-400" size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* File Info */}
          {selectedFile && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">File:</span>
                <span className="font-medium">{selectedFile.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          
          {selectedFile && (
            <Button
              onClick={handleUpload}
              loading={loading}
              className="flex-1"
              icon={<FiUpload />}
            >
              Upload Picture
            </Button>
          )}
        </div>

        {/* Remove Current Picture */}
        {currentProfilePicture && !selectedFile && (
          <div className="pt-4 border-t">
            <Button
              variant="danger"
              onClick={handleRemovePicture}
              loading={loading}
              icon={<FiX />}
              className="w-full"
            >
              Remove Current Picture
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProfilePictureUpload;
