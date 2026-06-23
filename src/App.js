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

  if (path === '/create') {
    return <Builder />;
  }

  return <Landing />;
}
