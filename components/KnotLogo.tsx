import React from 'react';

export const KnotLogo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`text-2xl font-bold font-serif text-brand-primary ${className}`} aria-label="Knot app logo">
    Knot
  </div>
);
