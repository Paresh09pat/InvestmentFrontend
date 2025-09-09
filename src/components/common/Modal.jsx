// Modal component
import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true 
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto scrollbar-hide">
      <div 
        className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleOverlayClick}
      >
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-sm" />

        {/* Modal panel */}
        <div className={`
          modal-container relative modal-white-bg inline-block w-full ${sizeClasses[size]} p-8 my-8 overflow-hidden text-left align-middle 
          transition-all transform shadow-2xl rounded-3xl animate-fade-in border border-gray-100
        `} style={{ 
          backgroundColor: 'white', 
          zIndex: 1000,
          color: '#1f2937',
          '--tw-bg-opacity': '1'
        }}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              {title && (
                <h3 className="text-xl font-bold text-gray-900">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-all duration-200 rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="text-sm text-gray-600" style={{ backgroundColor: 'white', color: '#4b5563' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
