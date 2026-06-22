import React from 'react';
import Landing from './Landing';
import Builder from './Builder';
import PublishedPage from './PublishedPage';

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  if (path.endsWith('/p') || path.includes('/p/')) {
    return <PublishedPage />;
  }

  if (path === '/create') {
    return <Builder />;
  }

  return <Landing />;
}
