import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  LINK_TYPES, DEFAULT_PAGE_DATA,
} from './themes';
import { uploadToCloudinary, isCloudinaryConfigured } from './cloudinary';
import ProfileView from './ProfileView';
import SiteNav from './components/SiteNav';
import SocialIcon, { getTypeLabel } from './components/SocialIcon';
import ProfileStep from './steps/ProfileStep';
import DesignStep from './steps/DesignStep';
import LinksStep from './steps/LinksStep';
import PublishStep from './steps/PublishStep';
import './landing.css';

const STORAGE_KEY = 'linkdrop_draft';
const ACCEPTED_BG_TYPES = ['image/gif', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_BG_SIZE = 10 * 1024 * 1024;

const STEPS = [
  { id: 'profile', label: 'Profile', icon: '01', path: '/create/profile' },
  { id: 'design', label: 'Design', icon: '02', path: '/create/design' },
  { id: 'links', label: 'Links', icon: '03', path: '/create/links' },
  { id: 'publish', label: 'Publish', icon: '04', path: '/create/publish' },
];

/* ── Shared form components (exported for step files) ─────────────────── */

export function Input({ label, value, onChange, placeholder, maxLength, multiline, hint }) {
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

export function BackgroundUpload({ bgMedia, onSet, onClear }) {
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

export function AvatarUpload({ avatar, name, onSet, onClear }) {
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
      setError('Cloudinary is not configured. Configure .env file to enable uploads.');
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
    <div className="panel-section avatar-upload-section">
      <label className="form-label">Profile logo / picture</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/gif,image/jpeg,image/png,image/webp"
        className="bg-upload__input"
        onChange={(e) => {
          processFile(e.target.files?.[0]);
          e.target.value = '';
        }}
        aria-label="Upload profile picture"
      />
      <div className="avatar-upload__container">
        <div 
          className={`avatar-upload__preview-circle ${dragging ? 'avatar-upload__preview-circle--drag' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files?.[0]); }}
        >
          {uploading ? (
            <span className="avatar-upload__loading">…</span>
          ) : avatar ? (
            <img src={avatar} alt="Avatar preview" className="avatar-upload__img" />
          ) : (
            <span className="avatar-upload__placeholder">
              {name ? name[0].toUpperCase() : '?'}
            </span>
          )}
          <div className="avatar-upload__hover-overlay">
            <span>{uploading ? 'Uploading' : 'Upload'}</span>
          </div>
        </div>
        <div className="avatar-upload__actions">
          <div className="avatar-upload__buttons">
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {avatar ? 'Change photo' : 'Upload photo'}
            </button>
            {avatar && (
              <button
                type="button"
                className="bg-upload__remove"
                onClick={onClear}
                disabled={uploading}
                style={{ marginLeft: 8 }}
              >
                Remove
              </button>
            )}
          </div>
          <p className="avatar-upload__hint">
            {cloudinaryReady ? 'Drop image or click to upload. GIF supported.' : 'Configure .env to enable uploads.'}
          </p>
        </div>
      </div>
      {error && <p className="bg-upload__error" role="alert">{error}</p>}
    </div>
  );
}

export function LinkRow({ link, index, total, onChange, onRemove, onMove }) {
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

/* ── Load / Save helpers ─────────────────────────────────────────────── */

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PAGE_DATA;
    return { ...DEFAULT_PAGE_DATA, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PAGE_DATA;
  }
}

function hasDraftInStorage() {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

/* ── Builder layout shell ─────────────────────────────────────────────── */

export default function Builder({ step = 'profile' }) {
  const [data, setData] = useState(loadDraft);
  const [previewDevice, setPreviewDevice] = useState('mobile');
  const [currentStep, setCurrentStep] = useState(step);
  const [draftExists, setDraftExists] = useState(hasDraftInStorage);

  // Persist to localStorage on every data change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setDraftExists(true);
  }, [data]);

  // Listen for popstate to update step without full reload
  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname.replace(/\/$/, '');
      const match = path.match(/^\/create\/(\w+)$/);
      setCurrentStep(match ? match[1] : 'profile');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Navigation helpers
  const stepIds = STEPS.map((s) => s.id);
  const currentIndex = stepIds.indexOf(currentStep);

  const navigateTo = useCallback((stepId) => {
    const target = STEPS.find((s) => s.id === stepId);
    if (target) {
      window.history.pushState(null, '', target.path);
      setCurrentStep(stepId);
    }
  }, []);

  const goNext = useCallback(() => {
    if (currentIndex < stepIds.length - 1) {
      navigateTo(stepIds[currentIndex + 1]);
    }
  }, [currentIndex, stepIds, navigateTo]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      navigateTo(stepIds[currentIndex - 1]);
    }
  }, [currentIndex, stepIds, navigateTo]);

  // Progress counter: X/4
  const progress = [
    data.name.trim() ? 1 : 0,        // profile: name non-empty
    1,                                  // design: always true (default theme)
    data.links.some((l) => l.url) ? 1 : 0,  // links: ≥1 with URL
    1,                                  // publish: always available
  ].reduce((a, b) => a + b, 0);

  // Step component props
  const stepProps = { data, setData, goNext, goPrev };

  return (
    <div className="studio studio--drop">
      <SiteNav variant="builder" showCta={false} hasDraft={draftExists} />

      <div className="studio__shell">
        <aside className="studio-sidebar" aria-label="Editor sections">
          <div className="studio-sidebar__head">
            <p className="studio-sidebar__label">Studio</p>
            <div className="progress-ring" aria-label={`${progress} of 4 steps complete`}>
              <span>{progress}/4</span>
            </div>
          </div>
          <nav className="studio-tabs">
            {STEPS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`studio-tab ${currentStep === t.id ? 'studio-tab--active' : ''}`}
                onClick={() => navigateTo(t.id)}
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
          {currentStep === 'profile' && <ProfileStep {...stepProps} />}
          {currentStep === 'design' && <DesignStep {...stepProps} />}
          {currentStep === 'links' && <LinksStep {...stepProps} />}
          {currentStep === 'publish' && <PublishStep {...stepProps} />}
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
            <div className="drop-phone studio-preview__phone">
              <div className="drop-phone__chrome">
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
