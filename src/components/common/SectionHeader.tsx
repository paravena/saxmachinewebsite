import React from 'react';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`section-head reveal ${className}`.trim()}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
};
