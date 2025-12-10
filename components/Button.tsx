import React from 'react';

interface ButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary', className = '' }) => {
  const baseStyle = "h-16 rounded-full text-xl font-medium transition-all active:scale-95 flex items-center justify-center select-none shadow-sm";
  
  const variants = {
    primary: "bg-gray-800 text-white hover:bg-gray-700",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    accent: "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20 shadow-lg",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
