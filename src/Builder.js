import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  THEMES, BUTTON_STYLES, LINK_TYPES, DEFAULT_PAGE_DATA,
} from './themes';
import { savePage } from './slugify';
import { isSupabaseConfigured } from './supabase';
import { uploadToCloudinary, isCloudinaryConfigured } from './cloudinary';
import ProfileView from './ProfileView';
import SiteNav from './components/SiteNav';
import SocialIcon, { getTypeLabel } from './components/SocialIcon';

const STORAGE_KEY = 'linkdrop-draft-v2';
const ACCEPTED_BG_TYPES = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_BG_SIZE = 10 * 1024 * 1024;

const TABS = [
  { id: 'profile', label: 'Profile', icon: '◆' },
  { id: 'design', label: 'Design', icon: '◇' },
  { id: 'links', label: 'Links', icon: '▤' },
  { id: 'publish', label: 'Publish', icon: '↗' },
];

function Input({ label, value, onChange, placeholder, maxLength, multiline, hint }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <Tag
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={multiline ? 3 : undefined}
      />
      {hint && <p className="form-hint">{hint}</p>}
    </div>
  );
}

function BackgroundUpload({ bgMedia, onSet, onClear }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const cloudinaryReady = isCloudinaryConfigured();

  const processFile = async (file) => {
    setError('');
    if (!file) return;
    if (!ACCEPTED_BG_TYPES.includes(file.type)) {
      setError('Only GIF, JPG, PNG, or WebP supported');
      return;
    }
    if (file.size > MAX_BG_SIZE) {
      setError('File too large — max 10MB');
      return;
    }
    if (!cloudinaryReady) {
      setError('Cloudinary is not configured. Open your .env file and replace "REPLACE_WITH_YOUR_CLOUD_NAME" with your real Cloudinary Cloud Name.');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onSet(url);
    } catch (err) {
      setError(err.message || 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="panel-section">
      <h3 className="panel-title">Background media</h3>
      <p className="panel-desc">
        Uploads to Cloudinary — only a short link goes in your share URL, not the full image.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/gif,image/jpeg,image/png,image/webp,.gif"
        className="bg-upload__input"
        onChange={(e) => {
          processFile(e.target.files?.[0]);
          e.target.value = '';
        }}
        aria-label="Upload background"
      />
      {!bgMedia ? (
        <button
          type="button"
          className={`bg-upload__zone ${dragging ? 'bg-upload__zone--drag' : ''} ${uploading ? 'bg-upload__zone--loading' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          disabled={uploading}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files?.[0]); }}
        >
          <span className="bg-upload__icon">{uploading ? '…' : '↑'}</span>
          {uploading ? 'Uploading to Cloudinary…' : 'Drop a GIF or image'}
          <span className="bg-upload__sub">
            {cloudinaryReady ? 'Hosted on Cloudinary · keeps your link short' : 'Configure .env to enable uploads'}
          </span>
        </button>
      ) : (
        <div className="bg-upload__preview">
          <img src={bgMedia} alt="Background preview" className="bg-upload__thumb" />
          <div className="bg-upload__meta">
            <span className="bg-upload__hosted">Hosted on Cloudinary</span>
            <button type="button" className="bg-upload__remove" onClick={onClear}>Remove</button>
          </div>
        </div>
      )}
      {error && <p className="bg-upload__error" role="alert">{error}</p>}
    </div>
  );
}

function LinkRow({ link, index, total, onChange, onRemove, onMove }) {
  return (
    <div className="link-row">
      <div className="link-row__top">
        <span className="link-row__drag" aria-hidden="true">⠿</span>
        <div className="link-row__type-badge">
          <SocialIcon type={link.type} size={14} />
          <select
            className="link-row__type"
            value={link.type}
            onChange={(e) => onChange(index, 'type', e.target.value)}
            aria-label="Link type"
          >
            {LINK_TYPES.map((t) => (
              <option key={t} value={t}>{getTypeLabel(t)}</option>
            ))}
          </select>
        </div>
        <div className="link-row__actions">
          <button type="button" className="icon-btn" disabled={index === 0} onClick={() => onMove(index, -1)} aria-label="Move up">↑</button>
          <button type="button" className="icon-btn" disabled={index === total - 1} onClick={() => onMove(index, 1)} aria-label="Move down">↓</button>
          <button type="button" className="icon-btn icon-btn--danger" onClick={() => onRemove(index)} aria-label="Remove link">×</button>
        </div>
      </div>
      <Input placeholder="Label" value={link.label} onChange={(v) => onChange(index, 'label', v)} />
      <Input placeholder="https://..." value={link.url} onChange={(v) => onChange(index, 'url', v)} />
    </div>
  );
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PAGE_DATA;
    return { ...DEFAULT_PAGE_DATA, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PAGE_DATA;
  }
}

export default function Builder() {
  const [data, setData] = useState(loadDraft);
  const [tab, setTab] = useState('profile');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [previewDevice, setPreviewDevice] = useState('mobile');

  const set = useCallback((key, val) => setData((d) => ({ ...d, [key]: val })), []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateLink = useCallback((index, key, val) => {
    setData((d) => {
      const links = [...d.links];
      links[index] = { ...links[index], [key]: val };
      return { ...d, links };
    });
  }, []);

  const moveLink = (index, dir) => {
    setData((d) => {
      const links = [...d.links];
      const next = index + dir;
      if (next < 0 || next >= links.length) return d;
      [links[index], links[next]] = [links[next], links[index]];
      return { ...d, links };
    });
  };

  const addLink = () =>
    setData((d) => ({ ...d, links: [...d.links, { type: 'other', label: '', url: '' }] }));

  const removeLink = (i) =>
    setData((d) => ({ ...d, links: d.links.filter((_, idx) => idx !== i) }));

  const generateLink = async () => {
    if (!isSupabaseConfigured()) {
      setGenerateError('Supabase is not configured. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to your .env file.');
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

  const filledLinks = data.links.filter((l) => l.url || l.label).length;
  const progress = [
    data.name ? 1 : 0,
    data.bio ? 1 : 0,
    filledLinks > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="studio">
      <SiteNav variant="builder" showCta={false} />

      <div className="studio__shell">
        <aside className="studio-sidebar" aria-label="Editor sections">
          <div className="studio-sidebar__head">
            <p className="studio-sidebar__label">Studio</p>
            <div className="progress-ring" aria-label={`${progress} of 3 profile steps complete`}>
              <span>{progress}/3</span>
            </div>
          </div>
          <nav className="studio-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`studio-tab ${tab === t.id ? 'studio-tab--active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <span className="studio-tab__icon" aria-hidden="true">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
          <div className="studio-sidebar__foot">
            <a href="/" className="studio-back">← Back to home</a>
          </div>
        </aside>

        <section className="studio-panel" aria-label="Editor">
          {tab === 'profile' && (
            <>
              <header className="panel-header">
                <h2>Profile</h2>
                <p>How visitors see you at the top of your page.</p>
              </header>
              <Input label="Display name" value={data.name} onChange={(v) => set('name', v)} placeholder="Maya Chen" maxLength={40} />
              <Input label="Bio" value={data.bio} onChange={(v) => set('bio', v)} placeholder="Photographer & travel writer. Currently in Lisbon." maxLength={120} multiline hint={`${data.bio.length}/120 characters`} />
            </>
          )}

          {tab === 'design' && (
            <>
              <header className="panel-header">
                <h2>Design</h2>
                <p>Theme, button style, and optional background media.</p>
              </header>
              <div className="panel-section">
                <h3 className="panel-title">Color theme</h3>
                <div className="theme-swatches" role="group" aria-label="Choose theme">
                  {Object.values(THEMES).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`theme-swatch ${data.theme === t.id ? 'theme-swatch--active' : ''}`}
                      onClick={() => set('theme', t.id)}
                      title={t.label}
                    >
                      <span className="theme-swatch__preview" style={{ background: t.swatch[0] }}>
                        <span style={{ background: t.swatch[1] }} />
                      </span>
                      <span className="theme-swatch__label">{t.label}</span>
                    </button>
                  ))}
                </div>
                {data.bgMedia && (
                  <p className="theme-bg-note">Theme affects overlay color behind your background</p>
                )}
              </div>
              <div className="panel-section">
                <h3 className="panel-title">Button style</h3>
                <div className="style-picker">
                  {Object.values(BUTTON_STYLES).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`style-chip ${data.buttonStyle === s.id ? 'style-chip--active' : ''}`}
                      onClick={() => set('buttonStyle', s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <BackgroundUpload
                bgMedia={data.bgMedia}
                onSet={(val) => set('bgMedia', val)}
                onClear={() => set('bgMedia', null)}
              />
            </>
          )}

          {tab === 'links' && (
            <>
              <header className="panel-header">
                <h2>Links</h2>
                <p>Add every destination you want one tap away.</p>
              </header>
              {data.links.map((link, i) => (
                <LinkRow
                  key={i}
                  link={link}
                  index={i}
                  total={data.links.length}
                  onChange={updateLink}
                  onRemove={removeLink}
                  onMove={moveLink}
                />
              ))}
              <button type="button" className="add-link-btn" onClick={addLink}>+ Add another link</button>
            </>
          )}

          {tab === 'publish' && (
            <>
              <header className="panel-header">
                <h2>Publish</h2>
                <p>Save to Supabase and get a short link like <code className="inline-code">/p/yourname-x7k2</code></p>
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
                    <p>{THEMES[data.theme]?.label || 'Midnight'} · {BUTTON_STYLES[data.buttonStyle]?.label || 'Solid'} buttons</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn--primary btn--full btn--glow"
                onClick={generateLink}
                disabled={generating}
              >
                {generating ? 'Saving…' : 'Generate my link'}
              </button>
              {generateError && (
                <p className="bg-upload__error" role="alert">{generateError}</p>
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
                    <button type="button" className={`btn btn--sm ${copied ? 'btn--primary' : 'btn--ghost'}`} onClick={copyLink}>
                      {copied ? 'Copied' : 'Copy link'}
                    </button>
                    <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="btn btn--sm btn--ghost">
                      Open page ↗
                    </a>
                  </div>
                  <p className="share-result__tip">
                    Your page is saved in Supabase. Background media stays on Cloudinary — both keep this link short.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        <aside className="studio-preview" aria-label="Live preview">
          <div className="studio-preview__bar">
            <span className="preview-label">Live preview</span>
            <div className="device-toggle" role="group" aria-label="Preview device">
              <button type="button" className={previewDevice === 'mobile' ? 'active' : ''} onClick={() => setPreviewDevice('mobile')}>Mobile</button>
              <button type="button" className={previewDevice === 'desktop' ? 'active' : ''} onClick={() => setPreviewDevice('desktop')}>Desktop</button>
            </div>
          </div>
          <div className={`preview-stage preview-stage--${previewDevice}`}>
            <div className="device-frame">
              <div className="device-frame__bar">
                <span /><span /><span />
              </div>
              <ProfileView data={data} interactive compact />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
