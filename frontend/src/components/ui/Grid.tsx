// components/ui/Grid.tsx
import React from 'react';

interface GridProps {
  columns?: number;
  gap?: number;
  children: React.ReactNode;
  className?: string;
}

const Grid: React.FC<GridProps> = React.memo(
  ({ columns = 1, gap = 4, children, className = '' }) => {
    const gridClasses = `grid gap-${gap} grid-cols-${columns}`;

    return <div className={`${gridClasses} ${className}`}>{children}</div>;
  }
);

Grid.displayName = 'Grid';

export default Grid;
