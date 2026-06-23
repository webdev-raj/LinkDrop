import React, { useState, useEffect } from 'react';
import { THEMES } from './themes';
import { fetchPage, incrementViews } from './slugify';
import ProfileView from './ProfileView';

export default function PublishedPage({ slug }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = THEMES.dark;

  useEffect(() => {
    let active = true;

    fetchPage(slug).then(async (result) => {
      if (!active) return;
      if (result) {
        setData(result.data);
        await incrementViews(slug);
      }
      setLoading(false);
    });

    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="profile-page profile-page--state" style={{ background: theme.bg }}>
        <p className="page-state">Loading…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="profile-page profile-page--state" style={{ background: theme.bg }}>
        <div className="not-found">
          <h1 style={{ color: theme.text }}>Page not found</h1>
          <p>No page exists at this link. Check the URL or create a new one in the studio.</p>
          <a href="/create" className="btn btn--primary btn--glow">Open the studio</a>
        </div>
      </div>
    );
  }

  return <ProfileView data={data} interactive={false} animate />;
}
