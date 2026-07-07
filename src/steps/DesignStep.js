import React, { useCallback } from 'react';
import { THEMES, BUTTON_STYLES } from '../themes';
import { BackgroundUpload } from '../Builder';

export default function DesignStep({ data, setData, goNext, goPrev }) {
  const set = useCallback((key, val) => setData((d) => ({ ...d, [key]: val })), [setData]);

  return (
    <>
      <header className="panel-header">
        <h2>Design</h2>
        <p>Theme, button style, and optional background media.</p>
      </header>
      <div className="panel-section">
        <h3 className="panel-title">Color theme</h3>
        <div className="theme-swatches" role="group" aria-label="Choose theme" data-tourkit="theme-picker">
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
      <div className="step-nav-buttons">
        <button type="button" className="btn btn--ghost" onClick={goPrev}>
          ← Back
        </button>
        <button type="button" className="btn btn--landing-primary" onClick={goNext}>
          Next →
        </button>
      </div>
    </>
  );
}
