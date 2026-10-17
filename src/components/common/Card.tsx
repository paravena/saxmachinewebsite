import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'dark' | 'light' | 'quote' | 'format';
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'dark', className = '' }) => {
  let baseClass = 'card';
  if (variant === 'quote') {
    baseClass = 'quote';
  } else if (variant === 'format') {
    baseClass = 'format';
  }

  return <div className={`${baseClass} ${className}`.trim()}>{children}</div>;
};
