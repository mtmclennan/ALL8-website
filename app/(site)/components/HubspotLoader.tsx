'use client';
import { useEffect } from 'react';

export default function HubspotLoader({ portalId }: { portalId?: string }) {
  useEffect(() => {
    if (!portalId) return;

    const timer = setTimeout(() => {
      const s = document.createElement('script');
      s.src = `https://js.hs-scripts.com/${portalId}.js`;
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    }, 3000);

    return () => clearTimeout(timer);
  }, [portalId]);

  return null;
}
