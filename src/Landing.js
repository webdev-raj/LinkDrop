import React from 'react';
import SiteNav from './components/SiteNav';
import Reveal from './components/Reveal';
import ProfileView from './ProfileView';
import './landing.css';

const DEMO = {
  name: 'Maya Chen',
  bio: 'Photographer & travel writer. Currently in Lisbon.',
  theme: 'dark',
  buttonStyle: 'glass',
  bgMedia: null,
  links: [
    { type: 'instagram', label: 'Daily frames', url: 'instagram.com' },
    { type: 'youtube', label: 'Behind the lens', url: 'youtube.com' },
    { type: 'website', label: 'Print shop', url: 'mayachen.studio' },
  ],
};

const FEATURES = [
  {
    title: 'Live studio',
    body: 'Edit on the left, preview on the right. Every change shows up instantly on a real phone frame.',
  },
  {
    title: 'Five themes',
    body: 'Midnight, Sand, Pulse, Forest, Bloom — each built for contrast on any screen size.',
  },
  {
    title: 'GIF backgrounds',
    body: 'Upload to Cloudinary. Your page gets motion; your share link stays short.',
  },
  {
    title: 'Short URLs',
    body: 'Pages save to Supabase. You get linkdrop.app/p/yourname-x7k2 — not a URL you scroll through.',
  },
];

export default function Landing() {
  return (
    <div className="landing landing--drop">
      <a href="#main" className="skip-link skip-link--landing">Skip to content</a>

      <SiteNav />

      <main id="main">
        <section className="drop-hero">
          <div className="container drop-hero__grid">
            <div className="drop-hero__copy">
              <p className="drop-eyebrow">Link-in-bio · Free forever</p>
              <h1 className="drop-hero__title">
                Drop your links.<br />
                Land everywhere.
              </h1>
              <p className="drop-hero__lead">
                Build a sharp link page in minutes — themes, GIF backgrounds, glass buttons.
                Publish once, share a short URL. No account, no subscription.
              </p>
              <div className="drop-hero__actions">
                <a href="/create" className="btn btn--landing-primary">Open the studio</a>
                <a href="#features" className="btn btn--landing-ghost">See features</a>
              </div>
              <dl className="drop-stats">
                <div>
                  <dt>Accounts</dt>
                  <dd>0</dd>
                </div>
                <div>
                  <dt>Themes</dt>
                  <dd>5</dd>
                </div>
                <div>
                  <dt>Cost</dt>
                  <dd>$0</dd>
                </div>
              </dl>
            </div>

            <div className="drop-hero__visual">
              <div className="drop-hero__glow" aria-hidden="true">
                <img
                  src={`${process.env.PUBLIC_URL}/favicon/perfecticon-removebg-preview.png`}
                  alt=""
                  className="drop-hero__watermark"
                />
              </div>
              <div className="drop-phone">
                <div className="drop-phone__chrome">
                  <span /><span /><span />
                </div>
                <ProfileView data={DEMO} interactive={false} compact />
              </div>
              <div className="drop-float drop-float--1" aria-hidden="true">instagram.com</div>
              <div className="drop-float drop-float--2" aria-hidden="true">youtube.com</div>
              <div className="drop-float drop-float--3" aria-hidden="true">your-link.bio</div>
            </div>
          </div>
        </section>

        <div className="drop-rule" aria-hidden="true" />

        <section id="features" className="drop-section">
          <div className="container">
            <Reveal className="drop-section__head">
              <h2>Built lean. Looks premium.</h2>
              <p>Everything a paid link tool charges for — without the dashboard bloat or monthly bill.</p>
            </Reveal>
            <ul className="drop-features">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} className="drop-feature">
                  <span className="drop-feature__index">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section id="compare" className="drop-section drop-section--inset">
          <div className="container">
            <Reveal className="drop-section__head drop-section__head--center">
              <h2>Why switch</h2>
              <p>Same job as the big names. Fewer strings attached.</p>
            </Reveal>
            <Reveal className="drop-compare">
              <div className="drop-compare__row drop-compare__row--head">
                <span />
                <span>LinkDrop</span>
                <span>Typical tool</span>
              </div>
              {[
                ['Price', 'Free', '$5–15/mo'],
                ['Signup', 'Never', 'Required'],
                ['Share URL', 'Short slug', 'Long or locked'],
                ['GIF background', 'Included', 'Paid tier'],
              ].map(([label, us, them]) => (
                <div key={label} className="drop-compare__row">
                  <span>{label}</span>
                  <span className="drop-compare__win">{us}</span>
                  <span>{them}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* <section id="start" className="drop-section">
          <div className="container drop-start">
            <Reveal className="drop-start__card">
              <h1 className="site-nav__title drop-header drop-start__logo">LinkDrop</h1>
              <h2>Your page is two minutes away</h2>
              <p>Name, bio, links, theme — publish a short URL you can paste anywhere.</p>
              <ul className="drop-start__list">
                <li>Unlimited links</li>
                <li>Cloudinary backgrounds</li>
                <li>View counts on every page</li>
                <li>No watermark</li>
              </ul>
              <a href="/create" className="btn btn--landing-primary btn--full">Start building</a>
            </Reveal>
          </div>
        </section> */}

        <section className="drop-cta">
          <div className="container drop-cta__inner">
            <h2>One link. Every platform.</h2>
            <p>Drop it in your bio, email signature, or QR code — and move on with your day.</p>
            <a href="/create" className="btn btn--landing-primary">Create your page</a>
          </div>
        </section>
      </main>

      <footer className="drop-footer">
        <div className="container drop-footer__inner">
          <h1 className="site-nav__title drop-header">LinkDrop</h1>
          <p>© {new Date().getFullYear()} LinkDrop</p>
          <nav className="drop-footer__links" aria-label="Footer">
            <a href="/create">Studio</a>
            <a href="#features">Features</a>
            <a href="#compare">Compare</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
