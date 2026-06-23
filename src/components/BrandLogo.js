import React from 'react';

const ICON = `${process.env.PUBLIC_URL}/favicon/perfecticon-removebg-preview.png`;

export default function BrandLogo({ size = 'md', suffix = 'Drop', className = '' }) {
  const heights = { sm: 28, md: 42, lg: 52, xl: 72 };
  const height = heights[size] || heights.md;

  return (
    <a href="/" className={`brand-logo ${className}`} aria-label="LinkDrop home">
      <img
        src={ICON}
        alt=""
        className="brand-logo__icon"
        style={{ height }}
        width={height}
        decoding="async"
      />
      {suffix && <span className="brand-logo__suffix">{suffix}</span>}
    </a>
  );
}
