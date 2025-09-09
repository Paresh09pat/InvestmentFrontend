// Card component
const Card = ({ 
    children, 
    className = '', 
    hover = false, 
    gradient = false,
    padding = 'medium',
    shadow = 'sm',
    border = true,
    ...props 
  }) => {
    const baseClasses = 'bg-white rounded-xl transition-all duration-300';
    const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
    const gradientClasses = gradient ? 'bg-gradient-to-br from-white to-gray-50' : '';
    const borderClasses = border ? 'border border-gray-100' : '';
    
    const paddingClasses = {
      none: '',
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8'
    };
  
    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    };
  
    return (
      <div 
        className={`
          ${baseClasses} 
          ${hoverClasses} 
          ${gradientClasses} 
          ${borderClasses}
          ${paddingClasses[padding]} 
          ${shadowClasses[shadow]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  };
  
  export default Card;
  