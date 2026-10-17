import React from 'react';

export interface AccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  defaultOpen = false,
  className = '',
}) => {
  return (
    <details className={`faq-item reveal ${className}`.trim()} open={defaultOpen}>
      <summary>{question}</summary>
      <p>{answer}</p>
    </details>
  );
};

export interface AccordionProps {
  items: { question: string; answer: string; id?: string }[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className = '' }) => {
  return (
    <div className={`faq-list ${className}`.trim()}>
      {items.map((item, index) => (
        <AccordionItem key={item.id ?? index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};
