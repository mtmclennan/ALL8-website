'use client';
import { useEffect, useState } from 'react';
import { Button } from '@heroui/button';
import { Switch } from '@heroui/switch';
import { Link } from '@heroui/link';
import { Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateConsent } from './Analytics';

const STORAGE_KEY = 'consent.choice.v1';

type Choices = {
  analytics: boolean;
  ads: boolean;
};

type Stored = {
  choices: Choices;
  decidedAt: string; // ISO date
};

function loadStored(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function saveStored(choices: Choices) {
  try {
    const payload: Stored = { choices, decidedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  // Show if no prior choice
  useEffect(() => {
    const stored = loadStored();
    if (!stored) setOpen(true);
  }, []);

  const applyAndClose = (choice: Choices) => {
    // Map to Consent Mode v2
    updateConsent({
      analytics_storage: choice.analytics ? 'granted' : 'denied',
      ad_storage: choice.ads ? 'granted' : 'denied',
      ad_user_data: choice.ads ? 'granted' : 'denied',
      ad_personalization: choice.ads ? 'granted' : 'denied',
    });
    saveStored(choice);
    setOpen(false);
  };

  const onAcceptAll = () => applyAndClose({ analytics: true, ads: true });
  const onRejectAll = () => applyAndClose({ analytics: false, ads: false });
  const onSave = () => applyAndClose({ analytics, ads });

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie and tracking preferences"
          className="fixed bottom-4 left-0 right-0 z-50"
        >
          <div className="mx-auto w-[92%] max-w-3xl rounded-2xl bg-white shadow-lg ring-1 ring-slate-200 dark:bg-[#1C1C1C] dark:text-white">
            <div className="flex flex-col gap-4 p-5 md:p-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 shrink-0">
                  <Cookie aria-hidden className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">
                    Your privacy choices
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    We use cookies to analyze traffic (Analytics) and measure ad
                    performance (Ads). You can change your choices any time. See
                    our <Link href="/legal/privacy-policy">Privacy Policy</Link>
                    .
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <div>
                    <p className="font-medium">Analytics</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Anonymous usage to improve the site.
                    </p>
                  </div>
                  <Switch
                    aria-label="Enable analytics"
                    isSelected={analytics}
                    onValueChange={setAnalytics}
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <div>
                    <p className="font-medium">Ads & Remarketing</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Google Ads conversion & personalization.
                    </p>
                  </div>
                  <Switch
                    aria-label="Enable ads and remarketing"
                    isSelected={ads}
                    onValueChange={setAds}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <Button
                  variant="flat"
                  onPress={onRejectAll}
                  aria-label="Reject all"
                >
                  Reject all
                </Button>
                <Button
                  variant="bordered"
                  onPress={onSave}
                  aria-label="Save preferences"
                >
                  Save preferences
                </Button>
                <Button
                  color="primary"
                  onPress={onAcceptAll}
                  aria-label="Accept all"
                >
                  Accept all
                </Button>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
