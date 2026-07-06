import React, { useState } from 'react';
import { savePage } from '../slugify';
import { isSupabaseConfigured } from '../supabase';
import { THEMES, BUTTON_STYLES } from '../themes';

export default function PublishStep({ data, goPrev }) {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const filledLinks = data.links.filter((l) => l.url || l.label).length;

  const generateLink = async () => {
    // Navigation guard: name must be filled
    if (!data.name.trim()) {
      setGenerateError('Add your name first');
      setTimeout(() => {
        window.history.pushState(null, '', '/create/profile');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 1500);
      return;
    }

    if (!isSupabaseConfigured()) {
      setGenerateError(
        'Supabase is not configured. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to your .env file.'
      );
      return;
    }

    setGenerating(true);
    setGenerateError('');
    try {
      const slug = await savePage(data);
      setShareUrl(`${window.location.origin}/p/${slug}`);
    } catch {
      setGenerateError('Could not save page — check your connection and try again.');
    } finally {
      setGenerating(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const twitterShareUrl = shareUrl
    ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Check out my LinkDrop page!')}`
    : '';
  const whatsappShareUrl = shareUrl
    ? `https://wa.me/?text=${encodeURIComponent(`Check out my LinkDrop page: ${shareUrl}`)}`
    : '';

  return (
    <>
      <header className="panel-header">
        <h2>Publish</h2>
        <p>
          Save to Supabase and get a short link like{' '}
          <code className="inline-code">/p/yourname-x7k2</code>
        </p>
      </header>
      <div className="publish-card">
        <div className="publish-card__row">
          <span className="publish-card__stat">{filledLinks}</span>
          <div>
            <strong>Links ready</strong>
            <p>Each link with a URL will appear on your page.</p>
          </div>
        </div>
        <div className="publish-card__row">
          <span className="publish-card__stat">{data.theme}</span>
          <div>
            <strong>Active theme</strong>
            <p>
              {THEMES[data.theme]?.label || 'Midnight'} ·{' '}
              {BUTTON_STYLES[data.buttonStyle]?.label || 'Solid'} buttons
            </p>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="btn btn--landing-primary btn--full"
        onClick={generateLink}
        disabled={generating}
      >
        {generating ? 'Saving…' : 'Generate my link'}
      </button>
      {generateError && (
        <p className="bg-upload__error" role="alert">
          {generateError}
        </p>
      )}
      {shareUrl && (
        <div className="share-result">
          <p className="share-result__label">Your live page</p>
          <div className="share-result__box">
            <code className="share-result__url">{shareUrl}</code>
          </div>
          <p className="share-result__length">
            {shareUrl.length.toLocaleString()} characters · short link
          </p>
          <div className="share-result__actions">
            <button
              type="button"
              className={`btn btn--sm ${copied ? 'btn--landing-primary' : 'btn--landing-ghost'}`}
              onClick={copyLink}
            >
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--sm btn--landing-ghost"
            >
              Open page ↗
            </a>
          </div>
          <div className="social-share-row">
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--sm btn--ghost social-share-btn"
            >
              <span className="social-share-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </span>
              Share on X
            </a>
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--sm btn--ghost social-share-btn"
            >
              <span className="social-share-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              WhatsApp
            </a>
          </div>
          <p className="share-result__tip">
            Your page is saved permanently. Share it anywhere.
          </p>
        </div>
      )}
      <div className="step-nav-buttons" style={{ marginTop: 24 }}>
        <button type="button" className="btn btn--ghost" onClick={goPrev}>
          ← Back
        </button>
        <span />
      </div>
    </>
  );
}
