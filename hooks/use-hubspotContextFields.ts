'use client';
import { useEffect, useState } from 'react';

export function useHubSpotContextFields(pageName = 'Contact Intake') {
  const [hutk, setHutk] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [utm, setUtm] = useState({ source: '', medium: '', campaign: '' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setHutk(document.cookie.match(/hubspotutk=([^;]+)/)?.[1] ?? '');
    setPageUrl(window.location.href);
    const sp = new URLSearchParams(window.location.search);
    setUtm({
      source: sp.get('utm_source') ?? '',
      medium: sp.get('utm_medium') ?? '',
      campaign: sp.get('utm_campaign') ?? '',
    });
  }, []);

  return { hutk, pageUrl, pageName, utm };
}
