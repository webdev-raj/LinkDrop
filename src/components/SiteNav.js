import React from 'react';

export default function SiteNav({ variant = 'landing', showCta = true }) {
  const isLanding = variant === 'landing';
  const isBuilder = variant === 'builder';

  return (
    <nav
      className={`site-nav ${isLanding ? 'site-nav--landing' : ''} ${isBuilder ? 'site-nav--studio' : ''}`}
      aria-label="Main"
    >
      <div className="container site-nav__inner">
        {/* <BrandLogo size={isLanding ? 'md' : 'sm'} suffix="" /> */}
        <a href="/" className="brand-logo">
        <h1 className="drop-header">LinkDrop</h1>
        </a>

        {isLanding && (
          <ul className="nav-links nav-links--landing">
            <li><a href="#features">Features</a></li>
            <li><a href="#compare">Compare</a></li>
            <li><a href="#start">Start</a></li>
          </ul>
        )}

        {isBuilder && (
          <div className="nav-builder-meta">
            <span className="nav-status">
              <span className="nav-status__dot" aria-hidden="true" />
              Draft saved locally
            </span>
          </div>
        )}

        <div className="nav-actions">
          {isBuilder && (
            <a href="/" className="studio-back-nav">← Home</a>
          )}
          {isLanding && (
            <span className="nav-badge nav-badge--landing">Free · No signup</span>
          )}
          {showCta && (
            <a
              href="/create"
              className={`btn btn--sm ${isLanding || isBuilder ? 'btn--landing-primary' : 'btn--primary'}`}
            >
              {isBuilder ? 'New page' : 'Build free'}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
