import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'chip';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gold', className = '' }) => {
  const baseClass = variant === 'chip' ? 'chip' : 'badge';
  return <span className={`${baseClass} ${className}`.trim()}>{children}</span>;
};
