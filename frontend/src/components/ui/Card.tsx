// components/ui/Card.tsx
import React from 'react';
import { uiConstants } from '../../constants/uiConstants';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = React.memo(({ title, children, className = '' }) => {
  return (
    <div
      className={`${uiConstants.CARDS.BACKGROUND} ${uiConstants.CARDS.BASE} ${uiConstants.CARDS.BORDER} ${className}`}
    >
      {title && <h3 className={uiConstants.CARDS.HEADER}>{title}</h3>}
      <div className={uiConstants.SPACING.CARD_PADDING}>{children}</div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
