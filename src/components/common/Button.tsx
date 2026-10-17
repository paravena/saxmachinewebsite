import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost' | 'outline';
  href?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'gold',
  href,
  className = '',
  children,
  ...rest
}) => {
  const variantClass = variant === 'ghost' ? 'btn-ghost' : 'btn-gold';
  const combinedClass = `btn ${variantClass} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={combinedClass}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClass} {...rest}>
      {children}
    </button>
  );
};
