import React from 'react';
import { THEMES } from './themes';
import { decodePageData } from './encode';
import ProfileView from './ProfileView';

export default function PublishedPage() {
  const hash = window.location.hash;
  const data = decodePageData(hash);
  const theme = data ? (THEMES[data.theme] || THEMES.dark) : THEMES.dark;

  if (!data) {
    return (
      <div className="profile-page" style={{ background: theme.bg, justifyContent: 'center' }}>
        <div className="not-found">
          <h1 style={{ color: theme.text }}>Page not found</h1>
          <p>This link may be broken or expired. Double-check the URL, or build a fresh page in the studio.</p>
          <a href="/create" className="btn btn--primary btn--glow">Open the studio</a>
        </div>
      </div>
    );
  }

  return <ProfileView data={data} interactive={false} animate />;
}
