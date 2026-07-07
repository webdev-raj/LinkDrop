import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Landing from './Landing';
import Builder from './Builder';
import PublishedPage from './PublishedPage';
import TourKitProvider from './components/TourKitProvider';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.replace(/\/$/, '') || '/';
  const slugMatch = path.match(/^\/p\/([a-z0-9-]+)$/i);

  // /create → redirect to /create/profile
  useEffect(() => {
    if (path === '/create') {
      navigate('/create/profile', { replace: true });
    }
  }, [path, navigate]);

  if (slugMatch) {
    return (
      <>
        <TourKitProvider />
        <PublishedPage slug={slugMatch[1]} />
      </>
    );
  }

  if (path === '/create') {
    return (
      <>
        <TourKitProvider />
        <Builder step="profile" />
      </>
    );
  }

  const createMatch = path.match(/^\/create\/(profile|design|links|publish)$/);
  if (createMatch) {
    return (
      <>
        <TourKitProvider />
        <Builder step={createMatch[1]} />
      </>
    );
  }

  return (
    <>
      <TourKitProvider />
      <Landing />
    </>
  );
}
