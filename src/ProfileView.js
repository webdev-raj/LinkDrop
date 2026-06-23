import React from 'react';
import { THEMES, BG_OVERLAY_OPACITY } from './themes';
import { cloudinaryBackgroundUrl, cloudinaryAvatarUrl } from './cloudinary';
import SocialIcon from './components/SocialIcon';

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

function BackgroundMedia({ src, themeId, compact }) {
  const opacity = BG_OVERLAY_OPACITY[themeId] ?? BG_OVERLAY_OPACITY.dark;
  const overlayStyle = { background: `rgba(0, 0, 0, ${opacity})` };

  if (compact) {
    return (
      <>
        <img src={src} alt="" aria-hidden="true" className="bg-media bg-media--contained" />
        <div aria-hidden="true" className="bg-media__overlay bg-media__overlay--contained" style={overlayStyle} />
      </>
    );
  }

  return (
    <>
      <img src={src} alt="" aria-hidden="true" className="bg-media bg-media--fixed" />
      <div aria-hidden="true" className="bg-media__overlay bg-media__overlay--fixed" style={overlayStyle} />
    </>
  );
}

export default function ProfileView({ data, interactive = true, compact = false, animate = false }) {
  const theme = THEMES[data.theme] || THEMES.dark;
  const themeId = data.theme || 'dark';
  const hasBgMedia = Boolean(data.bgMedia);
  const bgSrc = hasBgMedia ? cloudinaryBackgroundUrl(data.bgMedia) : null;
  const buttonStyle = data.buttonStyle || 'solid';

  const pageBg = hasBgMedia
    ? 'transparent'
    : theme.gradient
      ? `${theme.gradient}, ${theme.bg}`
      : theme.bg;

  const links = (data.links || []).filter((l) => (interactive ? (l.url || l.label) : l.url));
  const contentZIndex = hasBgMedia ? 2 : undefined;

  const profileContent = (
    <>
      <div
        className="profile-card"
        style={{
          ...(compact ? { maxWidth: '100%' } : undefined),
          position: hasBgMedia ? 'relative' : undefined,
          zIndex: contentZIndex,
        }}
      >
        <div
          className="profile-avatar"
          style={{
            background: data.avatar ? 'transparent' : `linear-gradient(135deg, ${theme.accent}, ${theme.accent}99)`,
            color: theme.accentText,
            boxShadow: `0 0 0 4px ${hasBgMedia ? 'rgba(0,0,0,0.25)' : theme.bg}, 0 0 0 6px ${theme.border}, 0 16px 40px ${theme.accent}33`,
            width: compact ? 64 : 92,
            height: compact ? 64 : 92,
            fontSize: compact ? '1.4rem' : '2.1rem',
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
          style={{ color: theme.text, fontSize: compact ? '1.15rem' : undefined }}
        >
          {data.name || 'Your name'}
        </h1>

        {data.bio && (
          <p
            className="profile-bio"
            style={{
              color: theme.textDim,
              marginBottom: compact ? 20 : 32,
              fontSize: compact ? '0.82rem' : undefined,
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

      {!compact && (
        <p
          className="profile-footer"
          style={{
            color: theme.textDim,
            position: hasBgMedia ? 'relative' : undefined,
            zIndex: contentZIndex,
          }}
        >
          <a href="/create" className="profile-footer__cta" style={{ color: theme.accent }}>
            Create your page
          </a>
          <span className="profile-footer__sep">·</span>
          <a href="/" style={{ color: theme.textDim }}>
            LinkDrop
          </a>
        </p>
      )}
    </>
  );

  return (
    <div
      className={compact ? 'preview-phone' : 'profile-page'}
      style={{
        background: pageBg,
        position: hasBgMedia && compact ? 'relative' : undefined,
        overflow: hasBgMedia && compact ? 'hidden' : undefined,
        ...(compact ? {} : { minHeight: '100dvh' }),
      }}
    >
      {hasBgMedia && <BackgroundMedia src={bgSrc} themeId={themeId} compact={compact} />}
      {hasBgMedia && compact ? (
        <div style={{ position: 'relative', zIndex: contentZIndex }}>{profileContent}</div>
      ) : (
        profileContent
      )}
    </div>
  );
}
