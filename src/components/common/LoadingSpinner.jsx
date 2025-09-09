// LoadingSpinner component

const LoadingSpinner = ({ size = 'medium', color = 'primary', text = 'Loading...' }) => {
    const sizeClasses = {
      small: 'w-6 h-6',
      medium: 'w-8 h-8',
      large: 'w-12 h-12'
    };
  
    const colorClasses = {
      primary: 'text-blue-600',
      white: 'text-white',
      gray: 'text-gray-600'
    };
  
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}>
        </div>
        {text && (
          <p className={`mt-4 text-sm font-medium ${colorClasses[color]}`}>
            {text}
          </p>
        )}
      </div>
    );
  };
  
  export default LoadingSpinner;
  