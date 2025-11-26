import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
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
  // Bubbly base styles: rounded-2xl, transition for 'press' effect
  const baseStyles = "inline-flex items-center justify-center rounded-2xl font-bold transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:translate-y-[2px] active:shadow-none";
  
  const variants = {
    // Primary: Violet with darker border for 3D effect
    primary: "bg-violet-500 text-white border-b-4 border-violet-700 hover:bg-violet-400 hover:border-violet-600 focus:ring-violet-300",
    
    // Secondary: White with gray border
    secondary: "bg-white text-slate-700 border-2 border-b-4 border-slate-200 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-200",
    
    // Ghost: No background, just text interaction
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    
    // Icon: Simple rounded interaction
    icon: "bg-white/80 text-slate-500 hover:bg-white hover:text-violet-600 p-2 rounded-full shadow-sm hover:shadow-md transition-all"
  };

  const activeStyles = active ? "bg-violet-100 text-violet-700 border-violet-300" : "";

  const sizes = {
    sm: "px-3 py-1 text-xs border-b-2",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3 text-lg"
  };

  const finalClass = `${baseStyles} ${variants[variant]} ${variant !== 'icon' ? sizes[size] : ''} ${activeStyles} ${className}`;

  return (
    <button className={finalClass} {...props}>
      {children}
    </button>
  );
};