import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function TourKitProvider() {
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.TourKit?.startFor(location.pathname);
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}
