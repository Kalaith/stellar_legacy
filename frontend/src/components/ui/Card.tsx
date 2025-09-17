// components/ui/Card.tsx
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = React.memo(({ title, children, className = '' }) => {
  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 ${className}`}>
      {title && (
        <h3 className="text-lg font-bold text-white px-6 py-4 border-b border-slate-700">
          {title}
        </h3>
      )}
      <div className={title ? 'p-6' : 'p-6'}>
        {children}
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;