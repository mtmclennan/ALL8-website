'use client';

import React, { useActionState, useRef } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

import { useHubSpotContextFields } from '@/hooks/use-hubspotContextFields';
import {
  submitIntake,
  type IntakeActionState,
} from '@/app/actions/submit-intake';

import { Form } from '@heroui/form';
import { Input, Textarea } from '@heroui/input';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { Checkbox } from '@heroui/checkbox';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';

import { ButtonGradientWrapper } from '../../_components/SectionWrapper';

const initialState: IntakeActionState = { ok: false };

type Tone = 'idle' | 'submitting' | 'success' | 'error';

type ProjectType =
  | ''
  | 'tuneup'
  | 'website'
  | 'landing'
  | 'maintenance'
  | 'gmb'
  | 'seo'
  | 'ads'
  | 'integrations';

type Goal = '' | 'calls' | 'seo' | 'ads' | 'trust' | 'other';

type Timeline = '' | 'asap' | '1-2w' | '1-2m' | '3m+' | 'exploring';

type Budget =
  | ''
  | 'planning'
  | '750-950'
  | '150-300mo'
  | '3-5k'
  | '5-10k'
  | '10k+';

export default function ContactIntakeForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    submitIntake,
    initialState,
  );

  const { hutk, pageUrl, pageName, utm } = useHubSpotContextFields();

  const [projectType, setProjectType] = React.useState<ProjectType>('');
  const [goal, setGoal] = React.useState<Goal>('');
  const [timeline, setTimeline] = React.useState<Timeline>('');
  const [budget, setBudget] = React.useState<Budget>('');
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

  React.useEffect(() => {
    if (!isPending && state.ok) {
      setShowSuccess(true);
      const id = setTimeout(() => router.replace('/'), 5000);
      return () => clearTimeout(id);
    }
  }, [isPending, state.ok, router]);

  React.useEffect(() => {
    // only map server-reported field errors; never show raw backend errors
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

  // Wrap the server action so we can attach dynamic/hidden fields and captcha
  const enhancedAction = async (formData: FormData) => {
    // honeypot stays empty; if bots fill it, server short-circuits
    formData.set('hp', hpRef.current?.value || '');

    // hubspot/page/utm context
    formData.set('hutk', hutk || '');
    formData.set('pageUrl', pageUrl || '');
    formData.set('pageName', pageName || '');
    formData.set('utm_source', utm.source || '');
    formData.set('utm_medium', utm.medium || '');
    formData.set('utm_campaign', utm.campaign || '');

    // lightweight lead classification (handy in HubSpot)
    formData.set('leadType', projectType === 'tuneup' ? 'Tune-Up' : 'Project');

    // recaptcha v3 (optional; server tolerates missing token)
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey && typeof window !== 'undefined' && 'grecaptcha' in window) {
      try {
        // @ts-expect-error grecaptcha injected by script
        await grecaptcha.ready();
        const t = await grecaptcha.execute(siteKey, { action: 'intake' });
        if (tokenRef.current) tokenRef.current.value = t || '';
        formData.set('token', tokenRef.current?.value || '');
      } catch {
        // non-fatal; server verifyCaptcha() should tolerate missing token
      }
    }

    return formAction(formData);
  };

  const fieldStyles = {
    input: 'text-white',
    inputWrapper:
      'bg-black/30 border border-white/10 hover:border-brand-blue/50',
    label: 'text-xs text-neutral-400',
  } as const;

  const selectStyles = {
    trigger: 'bg-black/30 border border-white/10 hover:border-brand-blue/50',
    label: 'text-xs text-neutral-400',
    value: 'text-white',
  } as const;

  return (
    <>
      {/* reCAPTCHA v3 loader (safe to include even if you don't set the secret) */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}`}
        strategy="afterInteractive"
      />

      <section
        id="intake-form"
        className="
          scroll-mt-24 mb-16 mx-auto max-w-3xl
          rounded-3xl overflow-hidden
          border border-white/10
          bg-black/30 backdrop-blur-xl
          shadow-[0_0_40px_rgba(0,0,0,0.4)]
          p-2 md:p-10
        "
      >
        <Card
          shadow="none"
          className="
            bg-black/20 border border-white/10
            backdrop-blur-md rounded-2xl p-4 sm:p-6
          "
        >
          <CardHeader className="flex flex-col items-start gap-2 pb-2">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Quick Intake
            </h2>
            <p className="text-xs text-neutral-400">
              ~1 minute • Tune-Ups from{' '}
              <span className="font-semibold text-brand-blue">$950 CAD</span> •
              Full builds from{' '}
              <span className="font-semibold text-brand-blue">$3,000 CAD</span>
            </p>
          </CardHeader>

          <CardBody>
            <Form
              className="grid gap-8 overflow-x-hidden"
              action={enhancedAction}
              aria-describedby="form-status"
              onReset={() => {
                setClientErrors({});
                setProjectType('');
                setGoal('');
                setTimeline('');
                setBudget('');
              }}
            >
              {/* Contact basics */}
              <div className="grid grid-cols-1 min-w-0 gap-6 md:grid-cols-2">
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

                <Input
                  name="company"
                  label="Company (optional)"
                  labelPlacement="outside"
                  placeholder="Bellhouse Excavating"
                  type="text"
                  onValueChange={() => clearError('company')}
                  classNames={fieldStyles}
                />

                <Input
                  name="website"
                  label="Website URL (optional)"
                  labelPlacement="outside"
                  placeholder="example.com"
                  type="text"
                  inputMode="url"
                  onValueChange={() => clearError('website')}
                  classNames={fieldStyles}
                />

                <Input
                  name="serviceArea"
                  label="Service area (optional)"
                  labelPlacement="outside"
                  placeholder="Brantford, Hamilton, KW..."
                  type="text"
                  onValueChange={() => clearError('serviceArea')}
                  classNames={fieldStyles}
                />
              </div>

              {/* Hidden anti-spam + context fields */}
              <div className="sr-only" aria-hidden="true">
                {/* Honeypot: MUST remain empty */}
                <input
                  ref={hpRef}
                  type="text"
                  name="hp"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
                {/* reCAPTCHA token holder */}
                <input ref={tokenRef} type="hidden" name="token" />
                {/* HubSpot + page context */}
                <input type="hidden" name="hutk" value={hutk} />
                <input type="hidden" name="pageUrl" value={pageUrl} />
                <input type="hidden" name="pageName" value={pageName} />
                <input type="hidden" name="utm_source" value={utm.source} />
                <input type="hidden" name="utm_medium" value={utm.medium} />
                <input type="hidden" name="utm_campaign" value={utm.campaign} />
                {/* Lead type for segmentation */}
                <input
                  type="hidden"
                  name="leadType"
                  value={projectType === 'tuneup' ? 'Tune-Up' : 'Project'}
                />
              </div>

              {/* Qualifiers */}
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  isRequired
                  name="projectType"
                  label="What do you need help with?"
                  labelPlacement="outside"
                  placeholder="Choose one"
                  popoverProps={{
                    classNames: {
                      content: 'bg-black border border-white/10 text-white',
                    },
                  }}
                  classNames={selectStyles}
                  selectedKeys={
                    projectType ? new Set([projectType]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0] as ProjectType | undefined;
                    const next = v ?? '';
                    setProjectType(next);

                    // helpful default
                    if (next === 'tuneup' && !budget) setBudget('750-950');

                    if (next) clearError('projectType');
                  }}
                  isInvalid={!!clientErrors.projectType}
                  errorMessage={clientErrors.projectType}
                >
                  <SelectItem key="divider-0" isDisabled className="opacity-60">
                    — Fast Wins —
                  </SelectItem>
                  <SelectItem key="tuneup">
                    Performance &amp; Conversion Tune-Up
                  </SelectItem>

                  <SelectItem key="divider-1" isDisabled className="opacity-60">
                    — Website Work —
                  </SelectItem>
                  <SelectItem key="website">New Website / Redesign</SelectItem>
                  <SelectItem key="landing">Ads-Ready Landing Page</SelectItem>

                  <SelectItem key="divider-2" isDisabled className="opacity-60">
                    — Visibility &amp; Lead Flow —
                  </SelectItem>
                  <SelectItem key="gmb">
                    Google Business Profile Optimization
                  </SelectItem>
                  <SelectItem key="seo">Basic SEO Setup</SelectItem>
                  <SelectItem key="ads">Google Ads Setup</SelectItem>

                  <SelectItem key="divider-3" isDisabled className="opacity-60">
                    — Ongoing Support —
                  </SelectItem>
                  <SelectItem key="maintenance">
                    Maintenance &amp; Hosting
                  </SelectItem>
                  <SelectItem key="integrations">
                    Business Tool Integrations
                  </SelectItem>
                </Select>

                <Select
                  isRequired
                  name="goal"
                  label="Primary goal"
                  labelPlacement="outside"
                  placeholder="Choose one"
                  popoverProps={{
                    classNames: {
                      content: 'bg-black border border-white/10 text-white',
                    },
                  }}
                  classNames={selectStyles}
                  selectedKeys={goal ? new Set([goal]) : new Set()}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0] as Goal | undefined;
                    setGoal(v ?? '');
                    if (v) clearError('goal');
                  }}
                  isInvalid={!!clientErrors.goal}
                  errorMessage={clientErrors.goal}
                >
                  <SelectItem key="calls">
                    More calls / quote requests
                  </SelectItem>
                  <SelectItem key="seo">Show up on Google / Maps</SelectItem>
                  <SelectItem key="ads">Improve ad performance</SelectItem>
                  <SelectItem key="trust">Look more credible</SelectItem>
                  <SelectItem key="other">Other</SelectItem>
                </Select>

                <Select
                  isRequired
                  name="timeline"
                  label="Timeline"
                  labelPlacement="outside"
                  placeholder="Choose one"
                  popoverProps={{
                    classNames: {
                      content: 'bg-black border border-white/10 text-white',
                    },
                  }}
                  classNames={selectStyles}
                  selectedKeys={timeline ? new Set([timeline]) : new Set()}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0] as Timeline | undefined;
                    setTimeline(v ?? '');
                    if (v) clearError('timeline');
                  }}
                  isInvalid={!!clientErrors.timeline}
                  errorMessage={clientErrors.timeline}
                >
                  <SelectItem key="asap">ASAP</SelectItem>
                  <SelectItem key="1-2w">1–2 weeks</SelectItem>
                  <SelectItem key="1-2m">1–2 months</SelectItem>
                  <SelectItem key="3m+">3+ months</SelectItem>
                  <SelectItem key="exploring">Just exploring</SelectItem>
                </Select>

                <div className="space-y-2">
                  <Select
                    isRequired
                    name="budget"
                    label="Budget range (CAD)"
                    labelPlacement="outside"
                    placeholder="Select a range"
                    popoverProps={{
                      classNames: {
                        content: 'bg-black border border-white/10 text-white',
                      },
                    }}
                    classNames={selectStyles}
                    selectedKeys={budget ? new Set([budget]) : new Set()}
                    onSelectionChange={(keys) => {
                      const v = Array.from(keys)[0] as Budget | undefined;
                      setBudget(v ?? '');
                      if (v) clearError('budget');
                    }}
                    isInvalid={!!clientErrors.budget}
                    errorMessage={clientErrors.budget}
                  >
                    <SelectItem key="planning">
                      Not sure yet / need guidance
                    </SelectItem>
                    <SelectItem key="750-950">$750–$950 — Tune-Up</SelectItem>
                    <SelectItem key="150-300mo">
                      $150–$300/mo — Maintenance
                    </SelectItem>
                    <SelectItem key="3-5k">
                      $3,000–$5,000 — Website build
                    </SelectItem>
                    <SelectItem key="5-10k">
                      $5,000–$10,000 — Larger build
                    </SelectItem>
                    <SelectItem key="10k+">
                      $10,000+ — Custom / complex
                    </SelectItem>
                  </Select>

                  <p className="text-xs text-foreground/60">
                    Tune-Ups from{' '}
                    <span className="text-white font-medium">$950 CAD</span> •
                    Maintenance from{' '}
                    <span className="text-white font-medium">$150/mo</span> •
                    Full builds from{' '}
                    <span className="text-white font-medium">$3,000 CAD</span>
                  </p>
                </div>
              </div>

              <Textarea
                isRequired
                name="notes"
                label="Briefly describe what you want to improve"
                labelPlacement="outside"
                placeholder="Example: Site is slow, people aren’t calling, want better service pages + stronger CTAs..."
                minRows={4}
                isInvalid={!!clientErrors.notes}
                errorMessage={clientErrors.notes}
                onValueChange={() => clearError('notes')}
                classNames={fieldStyles}
              />

              <Checkbox
                classNames={{
                  base: 'text-white',
                  wrapper: 'border-white/20',
                  label: 'text-sm text-neutral-300',
                }}
                name="consent"
                isRequired
                value="1"
              >
                I understand ALL8 will confirm scope, pricing, and next steps by
                email after reviewing my details.
              </Checkbox>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <p className="text-xs text-foreground/60">
                  No spam. We’ll review and reply within 1 business day.
                </p>

                <ButtonGradientWrapper>
                  <Button
                    radius="md"
                    className="px-6 py-2 text-white font-medium bg-chrome-cta hover:bg-chrome-cta-hover active:bg-chrome-cta-active focus-visible:ring-2 focus-visible:ring-chrome shadow-md"
                    type="submit"
                    isDisabled={isPending}
                    aria-disabled={isPending}
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <Spinner size="sm" /> Sending…
                      </span>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </ButtonGradientWrapper>

                <ButtonGradientWrapper>
                  <Button
                    variant="solid"
                    radius="md"
                    type="reset"
                    isDisabled={isPending}
                    className="bg-black/90 hover:bg-black/50"
                  >
                    Reset
                  </Button>
                </ButtonGradientWrapper>
              </div>

              {/* ARIA live region for status; never shows backend stack/details */}
              {status !== 'idle' && (
                <div
                  id="form-status"
                  aria-live="polite"
                  className={
                    'rounded-xl border p-3 text-sm ' +
                    (status === 'success'
                      ? 'border-success-200 bg-success-50 text-success-700'
                      : status === 'error'
                        ? 'border-danger-200 bg-danger-50 text-danger-700'
                        : 'border-default-200 bg-default-50 text-foreground/80')
                  }
                >
                  {status === 'success'
                    ? 'Thanks! We’ll review and follow up shortly.'
                    : status === 'error'
                      ? 'Please check the highlighted fields and try again.'
                      : 'Submitting…'}
                </div>
              )}
            </Form>
          </CardBody>
        </Card>
      </section>

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
        size="2xl"
      >
        <ModalContent className="rounded-2xl p-[1px] bg-gradient-to-br from-[#0047BB66] via-[#59BAE066] to-[#021E42] shadow-2xl">
          <div className="flex flex-col items-center rounded-2xl bg-background/80 backdrop-blur-md border border-white/10 p-6">
            <ModalHeader className="text-4xl font-bold text-primary tracking-tight">
              Thanks! Your request is in.
            </ModalHeader>

            <ModalBody className="space-y-4 text-foreground/80">
              <p className="text-base">
                We’ll review and follow up within{' '}
                <span className="font-semibold text-white">1 business day</span>
                .
              </p>
              <ul className="list-disc list-inside text-sm text-foreground/70">
                <li>Watch your inbox for next steps</li>
                <li>
                  Replies usually come from{' '}
                  <span className="font-mono text-brand-blue text-center">
                    info@all8webworks.com
                  </span>
                </li>
              </ul>
            </ModalBody>

            <ModalFooter className="mt-4 flex justify-center">
              <Button
                onPress={() => router.push('/')}
                size="lg"
                radius="md"
                className="px-6 py-2 text-white font-medium bg-chrome-cta hover:bg-chrome-cta-hover active:bg-chrome-cta-active focus-visible:ring-2 focus-visible:ring-chrome shadow-md"
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
