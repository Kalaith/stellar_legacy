// components/ui/Card.tsx
import React from 'react';
import { UI_CONSTANTS } from '../../constants/uiConstants';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = React.memo(({ title, children, className = '' }) => {
  return (
    <div className={`${UI_CONSTANTS.CARDS.BACKGROUND} ${UI_CONSTANTS.CARDS.BASE} ${UI_CONSTANTS.CARDS.BORDER} ${className}`}>
      {title && (
        <h3 className={UI_CONSTANTS.CARDS.HEADER}>
          {title}
        </h3>
      )}
      <div className={UI_CONSTANTS.SPACING.CARD_PADDING}>
        {children}
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;