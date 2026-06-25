import React from 'react';
import { THEMES } from './themes';
import { cloudinaryBackgroundUrl, cloudinaryAvatarUrl } from './cloudinary';
import SocialIcon from './components/SocialIcon';

/* ─── Link button styles ─────────────────────────────────────────────── */

function getLinkStyles(theme, buttonStyle) {
  const base = {
    solid: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      backdropFilter: 'none',
    },
    outline: {
      background: 'transparent',
      border: `1px solid ${theme.accent}`,
      backdropFilter: 'none',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: `1px solid rgba(255, 255, 255, 0.12)`,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    },
  };

  if (theme.bg.startsWith('#F') || theme.bg.startsWith('#f')) {
    base.glass = {
      background: 'rgba(255, 255, 255, 0.65)',
      border: `1px solid rgba(0, 0, 0, 0.08)`,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    };
  }

  return base[buttonStyle] || base.solid;
}

/* ─── Single link row ────────────────────────────────────────────────── */

function ProfileLink({ link, theme, interactive, animate, index, buttonStyle }) {
  const href = link.url
    ? (link.url.startsWith('http') ? link.url : `https://${link.url}`)
    : undefined;

  const linkSurface = getLinkStyles(theme, buttonStyle || 'solid');

  const baseStyle = {
    ...linkSurface,
    color: theme.text,
    ...(animate ? { animationDelay: `${index * 0.08 + 0.15}s` } : {}),
  };

  const content = (
    <>
      <span
        className="profile-link__icon"
        style={{ background: `${theme.accent}20`, color: theme.accent }}
      >
        <SocialIcon type={link.type} size={16} />
      </span>
      <span className="profile-link__label">{link.label || link.url || 'Your link'}</span>
    </>
  );

  if (!interactive) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`profile-link ${animate ? 'profile-link--animate' : ''}`}
        style={baseStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.borderColor = theme.accent;
          e.currentTarget.style.boxShadow = `0 12px 32px ${theme.bg}88`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = linkSurface.border?.includes('solid')
            ? linkSurface.border.split(' ').slice(2).join(' ') || theme.border
            : theme.border;
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="profile-link profile-link--static" style={baseStyle}>
      {content}
    </div>
  );
}

/* ─── Main ProfileView ───────────────────────────────────────────────── */

export default function ProfileView({ data, interactive = true, compact = false, animate = false }) {
  const theme = THEMES[data.theme] || THEMES.dark;
  const hasBgMedia = Boolean(data.bgMedia);
  const bgSrc = hasBgMedia ? cloudinaryBackgroundUrl(data.bgMedia) : null;
  const buttonStyle = data.buttonStyle || 'solid';

  const links = (data.links || []).filter((l) => (interactive ? (l.url || l.label) : l.url));

  /* ── Compact mode: builder preview inside phone frame ── */
  if (compact) {
    const pageBg = hasBgMedia
      ? 'transparent'
      : theme.gradient
        ? `${theme.gradient}, ${theme.bg}`
        : theme.bg;

    return (
      <div
        className="preview-phone"
        style={{ background: pageBg, position: 'relative', overflow: 'hidden' }}
      >
        {/* GIF inside the phone frame */}
        {hasBgMedia && (
          <>
            <img
              src={bgSrc}
              alt=""
              aria-hidden="true"
              className="bg-media bg-media--contained"
            />
            <div
              aria-hidden="true"
              className="bg-media__overlay bg-media__overlay--contained"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            />
          </>
        )}

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="profile-card" style={{ maxWidth: '100%' }}>
            <div
              className="profile-avatar"
              style={{
                background: data.avatar
                  ? 'transparent'
                  : `linear-gradient(135deg, ${theme.accent}, ${theme.accent}99)`,
                color: theme.accentText,
                boxShadow: `0 0 0 4px ${hasBgMedia ? 'rgba(0,0,0,0.25)' : theme.bg}, 0 0 0 6px ${theme.border}`,
                width: 64,
                height: 64,
                fontSize: '1.4rem',
              }}
            >
              {data.avatar ? (
                <img src={cloudinaryAvatarUrl(data.avatar)} alt="" className="profile-avatar__img" />
              ) : (
                data.name ? data.name[0].toUpperCase() : '?'
              )}
            </div>

            <h1
              className="profile-name"
              style={{ color: theme.text, fontSize: '1.15rem' }}
            >
              {data.name || 'Your name'}
            </h1>

            {data.bio && (
              <p
                className="profile-bio"
                style={{
                  color: theme.textDim,
                  marginBottom: 20,
                  fontSize: '0.82rem',
                  textAlign: 'center',
                  lineHeight: '1.1',
                }}
              >
                {data.bio}
              </p>
            )}

            <div className="profile-links">
              {links.map((link, i) => (
                <ProfileLink
                  key={i}
                  link={link}
                  theme={theme}
                  interactive={interactive}
                  animate={animate}
                  index={i}
                  buttonStyle={buttonStyle}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Full published page ── */
  return (
    <div
      className="profile-page"
      style={{
        minHeight: '100vh',
        background: '#0D0D0D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px 0px',
      }}
    >
      {/* Card — GIF is clipped inside by overflow:hidden */}
      <div
        style={{
          position: 'relative',
          height: '85vh',
          width: '100%',
          maxWidth: '480px',
          borderRadius: '24px',
          overflow: 'hidden',
          padding: '40px 24px',
          background: hasBgMedia ? 'transparent' : theme.card,
        }}
      >
        {/* Layer 0: GIF */}
        {hasBgMedia && (
          <img
            src={bgSrc}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
        )}

        {/* Layer 1: Dark overlay */}
        {hasBgMedia && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.45)',
              zIndex: 1,
            }}
          />
        )}

        {/* Layer 2: Content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {/* Avatar */}
          <div
            className="profile-avatar"
            style={{
              background: data.avatar
                ? 'transparent'
                : `linear-gradient(135deg, ${theme.accent}, ${theme.accent}99)`,
              color: theme.accentText,
              boxShadow: `0 0 0 4px ${hasBgMedia ? 'rgba(0,0,0,0.3)' : theme.bg}, 0 0 0 6px ${theme.border}, 0 16px 40px ${theme.accent}33`,
              width: 92,
              height: 92,
              fontSize: '2.1rem',
            }}
          >
            {data.avatar ? (
              <img src={cloudinaryAvatarUrl(data.avatar)} alt="" className="profile-avatar__img" />
            ) : (
              data.name ? data.name[0].toUpperCase() : '?'
            )}
          </div>

          <h1
            className="profile-name"
            style={{ color: hasBgMedia ? '#ffffff' : theme.text }}
          >
            {data.name || 'Your name'}
          </h1>

          {data.bio && (
            <p
              className="profile-bio"
              style={{
                color: hasBgMedia ? 'rgba(255,255,255,0.78)' : theme.textDim,
                marginBottom: 32,
                textAlign: 'center',
                lineHeight: '1.5',
              }}
            >
              {data.bio}
            </p>
          )}

          <div className="profile-links" style={{ width: '100%' }}>
            {links.map((link, i) => (
              <ProfileLink
                key={i}
                link={link}
                theme={theme}
                interactive={interactive}
                animate={animate}
                index={i}
                buttonStyle={buttonStyle}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer — sits below the card on the dark page bg */}
      <p
        className="profile-footer"
        style={{ color: 'rgba(255,255,255,0.3)', marginTop: 24 }}
      >
        <a href="/create" className="profile-footer__cta" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Create your page
        </a>
        <span className="profile-footer__sep">·</span>
        <a href="/" style={{ color: 'rgba(255,255,255,0.3)' }}>
          LinkDrop
        </a>
      </p>
    </div>
  );
}
