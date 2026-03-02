'use client';
import { useEffect, useState } from 'react';

type Utm = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
};

export function useHubSpotContextFields(pageName = 'Contact Intake') {
  const [hutk, setHutk] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [referrer, setReferrer] = useState('');
  const [utm, setUtm] = useState<Utm>({
    source: '',
    medium: '',
    campaign: '',
    content: '',
    term: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // HubSpot tracking cookie (if present)
    setHutk(document.cookie.match(/hubspotutk=([^;]+)/)?.[1] ?? '');

    // Page context
    setPageUrl(window.location.href);
    setReferrer(document.referrer || '');

    // UTM params
    const sp = new URLSearchParams(window.location.search);
    setUtm({
      source: sp.get('utm_source') ?? '',
      medium: sp.get('utm_medium') ?? '',
      campaign: sp.get('utm_campaign') ?? '',
      content: sp.get('utm_content') ?? '',
      term: sp.get('utm_term') ?? '',
    });
  }, []);

  return { hutk, pageUrl, pageName, referrer, utm };
}
