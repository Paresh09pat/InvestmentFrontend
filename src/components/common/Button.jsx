// Button component
const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'medium', 
    loading = false, 
    disabled = false,
    fullWidth = false,
    onClick,
    type = 'button',
    className = '',
    icon = null,
    ...props 
  }) => {
    const baseClasses = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 btn-hover-fix';
    
    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl hover-lift',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 focus:ring-gray-500 border border-gray-300 hover:border-gray-400 hover-lift',
      success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white focus:ring-green-500 shadow-lg hover:shadow-xl hover-lift',
      warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white focus:ring-yellow-500 shadow-lg hover:shadow-xl hover-lift',
      danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white focus:ring-red-500 shadow-lg hover:shadow-xl hover-lift',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500 bg-transparent btn-custom-outline',
      ghost: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 btn-custom-ghost',
      'outline-success': 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500 bg-transparent transition-colors duration-200',
      'outline-warning': 'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white focus:ring-yellow-500 bg-transparent transition-colors duration-200',
      'outline-danger': 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500 bg-transparent transition-colors duration-200'
    };
  
    const sizes = {
      small: 'px-3 py-2 text-sm',
      medium: 'px-4 py-2.5 text-sm',
      large: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg'
    };
  
    const widthClass = fullWidth ? 'w-full' : '';
  
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`
          ${baseClasses} 
          ${variants[variant]} 
          ${sizes[size]} 
          ${widthClass} 
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin btn-loading-spinner"></div>
            Loading...
          </>
        ) : (
          <>
            {icon && <span className="text-lg">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  };
  
  export default Button;
  