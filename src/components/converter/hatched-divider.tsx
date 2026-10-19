import React from 'react';

interface HatchedDividerProps {
  className?: string;
  height?: number | string;
}

export function HatchedDivider({ className = '', height = 48 }: HatchedDividerProps) {
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      role="presentation"
      aria-hidden="true"
      style={{ height: heightStyle }}
      className={`hatched-divider ${className}`}
    />
  );
}

export default HatchedDivider;
