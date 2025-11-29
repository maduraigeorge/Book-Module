import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  active = false,
  ...props 
}) => {
  // Base: clean, rounded-lg (not xl/2xl), focus ring
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Primary: Solid dark or accent color, no 3D border
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-500 shadow-sm",
    
    // Secondary: Thin border, clean white
    secondary: "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 focus:ring-zinc-200 shadow-sm",
    
    // Ghost: Subtle hover
    ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
    
    // Icon: Simple circle/square
    icon: "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 p-2 rounded-md"
  };

  const activeStyles = active ? "bg-indigo-50 text-indigo-600 border-indigo-200 ring-1 ring-indigo-200" : "";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2"
  };

  const finalClass = `${baseStyles} ${variants[variant]} ${variant !== 'icon' ? sizes[size] : ''} ${activeStyles} ${className}`;

  return (
    <button className={finalClass} {...props}>
      {children}
    </button>
  );
};