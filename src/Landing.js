import React from 'react';
import SiteNav from './components/SiteNav';
import Reveal from './components/Reveal';
import ProfileView from './ProfileView';

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

const MARQUEE = ['Creators', 'Musicians', 'Freelancers', 'Founders', 'Coaches', 'Artists', 'Writers'];

// const TESTIMONIALS = [
//   { quote: 'Set up my page on the train. Took four minutes.', name: 'Jordan Okonkwo', role: 'Podcast host' },
//   { quote: 'No account, no monthly bill. Just a link that works.', name: 'Priya Mehta', role: 'Design consultant' },
//   { quote: 'The glass buttons look better than tools I pay for.', name: 'Tomás Rivera', role: 'Music producer' },
// ];

export default function Landing() {
  return (
    <div className="landing">
      {/* <a href="#main" className="skip-link">Skip to content</a> */}
      <div className="mesh-bg" aria-hidden="true" />
      <SiteNav />

      <main id="main">
        <section className="hero hero--premium">
          <div className="container hero__grid">
            <div className="hero__copy">
              <div className="pill">Free link-in-bio · No signup required</div>
              <h1 className="hero__title">
                The link page<br />
                <span className="gradient-text">creators actually want.</span>
              </h1>
              <p className="hero__lead">
                LinkDrop is a studio-grade link page you build in minutes — custom themes,
                GIF backgrounds, glass buttons. Your page lives in the URL. No database. No lock-in.
              </p>
              <div className="hero__actions">
                <a href="/create" className="btn btn--primary btn--glow">Open the studio</a>
                <a href="#product" className="btn btn--ghost">Explore features</a>
              </div>
              <div className="hero__metrics">
                <div><strong>0</strong><span>Accounts needed</span></div>
                <div><strong>5</strong><span>Premium themes</span></div>
                <div><strong>∞</strong><span>Free forever</span></div>
              </div>
            </div>
            <div className="hero__device">
              <div className="device-frame device-frame--hero">
                <div className="device-frame__bar"><span /><span /><span /></div>
                <ProfileView data={DEMO} interactive={false} compact />
              </div>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>

        <section id="product" className="section">
          <div className="container">
            <Reveal className="section-head section-head--center">
              <p className="section-label">Product</p>
              <h2 className="section-title">Everything you need. Nothing you don't.</h2>
              <p className="section-desc">Built like a paid SaaS — without the subscription.</p>
            </Reveal>
            <div className="bento">
              <Reveal className="bento__card bento__card--wide">
                <span className="bento__tag">Live studio</span>
                <h3>Edit and preview in real time</h3>
                <p>Split-panel builder with instant mobile preview. What you see is what your audience gets.</p>
              </Reveal>
              <Reveal className="bento__card">
                <span className="bento__tag">Themes</span>
                <h3>Five curated palettes</h3>
                <p>Midnight, Sand, Pulse, Forest, and Bloom — each tuned for contrast and readability.</p>
              </Reveal>
              <Reveal className="bento__card">
                <span className="bento__tag">Media</span>
                <h3>GIF backgrounds</h3>
                <p>Upload a looping GIF or image behind your links. Theme-aware overlay keeps text readable.</p>
              </Reveal>
              <Reveal className="bento__card bento__card--tall">
                <span className="bento__tag">Buttons</span>
                <h3>Solid, outline, or glass</h3>
                <p>Three link styles that feel native to your brand — switch anytime without losing your page.</p>
                <div className="bento__mini-btns">
                  <span className="mini-btn mini-btn--solid">Solid</span>
                  <span className="mini-btn mini-btn--outline">Outline</span>
                  <span className="mini-btn mini-btn--glass">Glass</span>
                </div>
              </Reveal>
              <Reveal className="bento__card">
                <span className="bento__tag">Privacy</span>
                <h3>Short links via Supabase</h3>
                <p>Pages save to a database — your share URL is just linkdrop.app/p/yourname-x7k2, not a megabyte hash.</p>
              </Reveal>
              <Reveal className="bento__card">
                <span className="bento__tag">Drafts</span>
                <h3>Auto-saved locally</h3>
                <p>Close the tab and come back — your draft waits in your browser. No account required.</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="compare" className="section section--elevated">
          <div className="container">
            <Reveal className="section-head section-head--center">
              <p className="section-label">Compare</p>
              <h2 className="section-title">Why people switch from paid link tools</h2>
            </Reveal>
            <Reveal className="compare-table-wrap">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th scope="col" />
                    <th scope="col">LinkDrop</th>
                    <th scope="col">Typical link tool</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Price', 'Free forever', '$5–15/mo'],
                    ['Account required', 'Never', 'Always'],
                    ['Your link', 'linkdrop.app/p/name-x7k2', 'Long hash URL'],
                    ['Custom GIF background', 'Yes', 'Paid tier'],
                    ['Works offline', 'Yes', 'No'],
                  ].map(([feature, us, them]) => (
                    <tr key={feature}>
                      <th scope="row">{feature}</th>
                      <td className="compare-table__win">{us}</td>
                      <td>{them}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>

        <section id="how" className="section">
          <div className="container">
            <Reveal className="section-head section-head--center">
              <p className="section-label">How it works</p>
              <h2 className="section-title">Live in under two minutes</h2>
            </Reveal>
            <div className="steps steps--dark">
              <Reveal className="step-card step-card--dark">
                <span className="step-card__num">01</span>
                <h3>Build in the studio</h3>
                <p>Add your name, bio, and links across four focused tabs.</p>
              </Reveal>
              <Reveal className="step-card step-card--dark">
                <span className="step-card__num">02</span>
                <h3>Dial in the design</h3>
                <p>Pick a theme, button style, and optional background media.</p>
              </Reveal>
              <Reveal className="step-card step-card--dark">
                <span className="step-card__num">03</span>
                <h3>Publish one link</h3>
                <p>Copy your URL and drop it anywhere — bio, email, QR code, anywhere.</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section section--pricing">
          <div className="container">
            <Reveal className="pricing-card">
              <div className="pricing-card__badge">Most popular</div>
              <h2>Free forever</h2>
              <p className="pricing-card__price"><span>$0</span>/month</p>
              <ul className="pricing-card__list">
                <li>Unlimited links</li>
                <li>5 premium themes</li>
                <li>GIF & image backgrounds</li>
                <li>Glass, solid & outline buttons</li>
                <li>No account · No watermark</li>
              </ul>
              <a href="/create" className="btn btn--primary btn--full btn--glow">Start building</a>
            </Reveal>
          </div>
        </section>


        <section className="cta-band cta-band--premium">
          <div className="container cta-band__inner">
            <h2 id='removespace'>Your audience is one link away</h2>
            <p>Open the studio, build your page, and share it today — free, forever, no catch.</p>
            <a href="/create" className="btn btn--primary btn--glow">Create your LinkDrop page</a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <a href="/" className="logo logo--sm">Link<em>Drop</em></a>
          <p>© {new Date().getFullYear()} LinkDrop — built for creators who hate subscriptions</p>
          <ul className="footer-links">
            <li><a href="/create">Studio</a></li>
            <li><a href="#product">Features</a></li>
            <li><a href="#compare">Compare</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
