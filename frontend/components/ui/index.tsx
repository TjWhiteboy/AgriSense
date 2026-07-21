import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick, hover = false }) => (
  <div
    onClick={onClick}
    className={`rounded-2xl p-6 ${hover ? 'cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1' : ''} glass-light dark:glass ${className}`}
  >
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', loading = false, icon, className = '', disabled, ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };
  const variants: Record<string, string> = {
    primary: 'bg-primary-800 hover:bg-primary-700 text-white focus:ring-primary-600 shadow-lg hover:shadow-primary-800/30',
    secondary: 'bg-white dark:bg-gray-800 border border-primary-800 text-primary-800 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 focus:ring-primary-600',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg',
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : icon}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">{icon}</span>}
      <input
        className={`w-full rounded-xl border bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent backdrop-blur-sm transition-all ${icon ? 'pl-10' : ''} ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'green', className = '' }) => {
  const colors: Record<string, string> = {
    green:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    blue:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    red:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    gray:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]} ${className}`}>{children}</span>;
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`rounded-2xl p-6 glass-light dark:glass ${className}`}>
    <div className="skeleton h-4 w-3/4 rounded mb-3" />
    <div className="skeleton h-3 w-1/2 rounded mb-2" />
    <div className="skeleton h-3 w-2/3 rounded" />
  </div>
);
