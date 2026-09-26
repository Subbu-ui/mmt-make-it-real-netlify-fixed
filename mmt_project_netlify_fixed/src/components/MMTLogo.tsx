import React from 'react';

// BRAND LOCK:
// Do not modify the official MakeMyTrip logo/header
// during unrelated UI or functionality changes.
/**
 * Official MakeMyTrip logo asset is locked. Original proportions, colors, typography, and "my" symbol are preserved.
 * Do not crop, stretch, recolor, or add effects.
 */
interface MMTLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'white';
  alt?: string;
}

export const MMTLogo: React.FC<MMTLogoProps> = ({
  className = 'h-7 sm:h-8 w-auto',
  variant = 'full',
  alt = 'MakeMyTrip',
}) => {
  return (
    <img
      src="/makemytrip-logo.svg"
      alt={alt}
      className={`object-contain shrink-0 select-none ${className}`}
      draggable={false}
      onError={(e) => {
        // Safe fallback to PNG if SVG format cannot be rendered
        const target = e.currentTarget;
        if (!target.src.endsWith('makemytrip-logo.png')) {
          target.src = '/makemytrip-logo.png';
        }
      }}
    />
  );
};


