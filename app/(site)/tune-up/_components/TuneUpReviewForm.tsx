'use client';

import React, { useActionState, useEffect, useMemo, useRef } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

import { useHubSpotContextFields } from '@/hooks/use-hubspotContextFields';
import {
  submitTuneUpReview,
  type TuneUpReviewActionState,
} from '@/app/actions/submit-tune-up-review';

import { Form } from '@heroui/form';
import { Input, Textarea } from '@heroui/input';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { Spinner } from '@heroui/spinner';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';

import { ButtonGradientWrapper } from '@/app/(site)/_components/SectionWrapper';

const initialState: TuneUpReviewActionState = { ok: false };

type Tone = 'idle' | 'submitting' | 'success' | 'error';
type Issue = '' | 'slow' | 'calls' | 'servicePages' | 'seoWeak' | 'notSure';

const ISSUE_OPTIONS: Array<{ key: Exclude<Issue, ''>; label: string }> = [
  { key: 'slow', label: 'Site feels slow' },
  { key: 'calls', label: 'Not getting enough calls' },
  { key: 'servicePages', label: 'Service pages aren’t converting' },
  { key: 'seoWeak', label: 'SEO visibility is weak' },
  { key: 'notSure', label: 'Not sure — just need help' },
];

export default function TuneUpReviewFormCompact() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    submitTuneUpReview,
    initialState,
  );

  const { hutk, pageUrl, pageName, utm, referrer } =
    useHubSpotContextFields('Tune-Up Review');

  const [issue, setIssue] = React.useState<Issue>('');
  const [clientErrors, setClientErrors] = React.useState<
    Record<string, string | undefined>
  >({});
  const [showSuccess, setShowSuccess] = React.useState(false);

  // hidden fields refs
  const tokenRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);

  const status: Tone = isPending
    ? 'submitting'
    : state.ok
      ? 'success'
      : state.message
        ? 'error'
        : 'idle';

  useEffect(() => {
    if (!isPending && state.ok) setShowSuccess(true);
  }, [isPending, state.ok]);

  useEffect(() => {
    if (state.fieldErrors) {
      const flat: Record<string, string | undefined> = {};
      for (const [k, v] of Object.entries(state.fieldErrors)) flat[k] = v?.[0];
      setClientErrors(flat);
    }
    if (state.ok) setClientErrors({});
  }, [state.fieldErrors, state.ok]);

  function clearError(name: string) {
    setClientErrors((prev) =>
      prev[name] ? { ...prev, [name]: undefined } : prev,
    );
  }

  const enhancedAction = async (formData: FormData) => {
    // honeypot
    formData.set('hp', hpRef.current?.value || '');

    // context
    formData.set('hutk', hutk || '');
    formData.set('pageUrl', pageUrl || '');
    formData.set('pageName', pageName || '');
    formData.set('referrer', referrer || '');

    // utms
    formData.set('utm_source', utm.source || '');
    formData.set('utm_medium', utm.medium || '');
    formData.set('utm_campaign', utm.campaign || '');
    formData.set('utm_content', utm.content || '');
    formData.set('utm_term', utm.term || '');

    // classification
    formData.set('leadType', 'Tune-Up Review');

    // recaptcha v3 (optional)
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey && typeof window !== 'undefined' && 'grecaptcha' in window) {
      try {
        // @ts-expect-error grecaptcha injected by script
        await grecaptcha.ready();
        const t = await grecaptcha.execute(siteKey, { action: 'tuneup' });
        if (tokenRef.current) tokenRef.current.value = t || '';
        formData.set('token', tokenRef.current?.value || '');
      } catch {
        // non-fatal
      }
    }

    return formAction(formData);
  };

  const fieldStyles = useMemo(
    () =>
      ({
        input: 'text-white',
        inputWrapper:
          'bg-black/25 border border-white/10 hover:border-brand-blue/50',
        label: 'text-xs text-neutral-400',
      }) as const,
    [],
  );

  const selectStyles = useMemo(
    () =>
      ({
        trigger:
          'bg-black/25 border border-white/10 hover:border-brand-blue/50',
        label: 'text-xs text-neutral-400',
        value: 'text-white',
      }) as const,
    [],
  );

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}`}
        strategy="afterInteractive"
      />

      <Form
        className="grid gap-4"
        action={enhancedAction}
        aria-describedby="form-status"
        onReset={() => {
          setClientErrors({});
          setIssue('');
        }}
      >
        {/* Hidden anti-spam + context fields */}
        <div className="sr-only" aria-hidden="true">
          <input
            ref={hpRef}
            type="text"
            name="hp"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
          <input ref={tokenRef} type="hidden" name="token" />

          <input type="hidden" name="hutk" value={hutk} />
          <input type="hidden" name="pageUrl" value={pageUrl} />
          <input type="hidden" name="pageName" value={pageName} />
          <input type="hidden" name="referrer" value={referrer} />

          <input type="hidden" name="utm_source" value={utm.source} />
          <input type="hidden" name="utm_medium" value={utm.medium} />
          <input type="hidden" name="utm_campaign" value={utm.campaign} />
          <input type="hidden" name="utm_content" value={utm.content} />
          <input type="hidden" name="utm_term" value={utm.term} />

          <input type="hidden" name="leadType" value="Tune-Up Review" />
        </div>

        {/* Tight header (optional: keep here or render outside in the card header) */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Request a Tune-Up Review
          </h2>
          <p className="text-xs text-neutral-400">
            Review within 1 business day • Flat-scope pricing • Built for
            contractors
          </p>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            isRequired
            name="name"
            label="Name"
            labelPlacement="outside"
            placeholder="Jane Doe"
            type="text"
            isInvalid={!!clientErrors.name}
            errorMessage={clientErrors.name}
            onValueChange={() => clearError('name')}
            classNames={fieldStyles}
          />

          <Input
            isRequired
            name="email"
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder="jane@company.com"
            isInvalid={!!clientErrors.email}
            errorMessage={clientErrors.email}
            onValueChange={() => clearError('email')}
            classNames={fieldStyles}
          />
        </div>

        <Input
          isRequired
          name="website"
          label="Website URL"
          labelPlacement="outside"
          placeholder="example.com"
          type="text"
          inputMode="url"
          isInvalid={!!clientErrors.website}
          errorMessage={clientErrors.website}
          onValueChange={() => clearError('website')}
          classNames={fieldStyles}
        />

        <Select
          isRequired
          name="issue"
          label="What’s the main issue?"
          labelPlacement="outside"
          placeholder="Choose one"
          popoverProps={{
            classNames: {
              content: 'bg-black border border-white/10 text-white',
            },
          }}
          classNames={selectStyles}
          selectedKeys={issue ? new Set([issue]) : new Set()}
          onSelectionChange={(keys) => {
            const v = Array.from(keys)[0] as Issue | undefined;
            setIssue(v ?? '');
            if (v) clearError('issue');
          }}
          isInvalid={!!clientErrors.issue}
          errorMessage={clientErrors.issue}
        >
          {ISSUE_OPTIONS.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>

        <Textarea
          name="message"
          label="Short message (optional)"
          labelPlacement="outside"
          placeholder="Anything specific you want us to look for?"
          minRows={2}
          onValueChange={() => clearError('message')}
          classNames={fieldStyles}
        />

        {/* Actions */}
        <div className="grid gap-2">
          <ButtonGradientWrapper>
            <Button
              radius="md"
              className="w-full px-6 py-2 text-white font-medium bg-chrome-cta hover:bg-chrome-cta-hover active:bg-chrome-cta-active focus-visible:ring-2 focus-visible:ring-chrome shadow-md"
              type="submit"
              isDisabled={isPending}
              aria-disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" /> Sending…
                </span>
              ) : (
                'Request Review'
              )}
            </Button>
          </ButtonGradientWrapper>

          <div className="flex items-center justify-between">
            <p className="text-xs text-foreground/60">
              Tune-Ups from{' '}
              <span className="text-white font-medium">$950 CAD</span>
            </p>

            <Button
              variant="light"
              size="sm"
              type="reset"
              isDisabled={isPending}
              className="text-xs text-foreground/70 hover:text-foreground"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Status */}
        {status !== 'idle' && (
          <div
            id="form-status"
            aria-live="polite"
            className={
              'rounded-xl border px-3 py-2 text-sm ' +
              (status === 'success'
                ? 'border-success-200 bg-success-50 text-success-700'
                : status === 'error'
                  ? 'border-danger-200 bg-danger-50 text-danger-700'
                  : 'border-default-200 bg-default-50 text-foreground/80')
            }
          >
            {status === 'success'
              ? 'Thanks! We’ll follow up within 1 business day.'
              : status === 'error'
                ? 'Please check the highlighted fields and try again.'
                : 'Submitting…'}
          </div>
        )}
      </Form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccess}
        onOpenChange={(open) => {
          setShowSuccess(open);
          if (!open) router.push('/');
        }}
        isDismissable
        hideCloseButton={false}
        placement="center"
        size="lg"
      >
        <ModalContent className="rounded-2xl p-[1px] bg-gradient-to-br from-[#0047BB66] via-[#59BAE066] to-[#021E42] shadow-2xl">
          <div className="flex flex-col items-center rounded-2xl bg-background/80 backdrop-blur-md border border-white/10 p-6">
            <ModalHeader className="text-2xl font-bold text-primary tracking-tight">
              Request received.
            </ModalHeader>

            <ModalBody className="space-y-2 text-foreground/80">
              <p className="text-sm">
                We’ll review and reply within{' '}
                <span className="font-semibold text-white">1 business day</span>
                .
              </p>
              <p className="text-xs text-foreground/70">
                Short acknowledgment. Clear recommendation. No long
                questionnaire.
              </p>
            </ModalBody>

            <ModalFooter className="mt-2 flex justify-center">
              <Button
                onPress={() => router.push('/')}
                size="md"
                radius="md"
                className="px-5 py-2 text-white font-medium bg-chrome-cta hover:bg-chrome-cta-hover active:bg-chrome-cta-active focus-visible:ring-2 focus-visible:ring-chrome shadow-md"
              >
                Close
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
