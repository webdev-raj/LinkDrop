import React from 'react';

export default function SiteNav({ variant = 'landing', showCta = true }) {
  return (
    <nav className="site-nav" aria-label="Main">
      <div className="container site-nav__inner">
        <a href="/" className="logo">
          <span className="logo__mark" aria-hidden="true" />
          Link<em>Drop</em>
        </a>

        {variant === 'landing' && (
          <ul className="nav-links">
            <li><a href="#product">Product</a></li>
            <li><a href="#compare">Compare</a></li>
            <li><a href="#how">How it works</a></li>
          </ul>
        )}

        {variant === 'builder' && (
          <div className="nav-builder-meta">
            <span className="nav-status">
              <span className="nav-status__dot" aria-hidden="true" />
              Draft saved locally
            </span>
          </div>
        )}

        <div className="nav-actions">
          {variant === 'landing' && (
            <span className="nav-badge">Free forever</span>
          )}
          {showCta && (
            <a href="/create" className="btn btn--primary btn--sm">
              {variant === 'builder' ? 'New page' : 'Start free'}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
