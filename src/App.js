import React from 'react';
import Landing from './Landing';
import Builder from './Builder';
import PublishedPage from './PublishedPage';

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const slugMatch = path.match(/^\/p\/([a-z0-9-]+)$/i);

  if (slugMatch) {
    return <PublishedPage slug={slugMatch[1]} />;
  }

  // /create → redirect to /create/profile
  if (path === '/create') {
    window.history.replaceState(null, '', '/create/profile');
    return <Builder step="profile" />;
  }

  // /create/profile, /create/design, /create/links, /create/publish
  const createMatch = path.match(/^\/create\/(profile|design|links|publish)$/);
  if (createMatch) {
    return <Builder step={createMatch[1]} />;
  }

  return <Landing />;
}
