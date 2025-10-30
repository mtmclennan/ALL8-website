'use client';
import { useHubSpotContextFields } from '@/hooks/use-hubspotContextFields';
import Script from 'next/script';
import React, { useActionState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  submitIntake,
  type IntakeActionState,
} from '@/app/actions/submit-intake';

const initialState: IntakeActionState = { ok: false };

export default function ContactIntakeForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    submitIntake,
    initialState
  );

  const { hutk, pageUrl, pageName, utm } = useHubSpotContextFields();
  const [projectType, setProjectType] = React.useState('');
  const [goal, setGoal] = React.useState('');
  const [timeline, setTimeline] = React.useState('');
  const [budget, setBudget] = React.useState('');
  const [clientErrors, setClientErrors] = React.useState<
    Record<string, string | undefined>
  >({});
  const [showSuccess, setShowSuccess] = React.useState(false);

  // hidden fields refs
  const tokenRef = useRef<HTMLInputElement>(null);
  const hpRef = useRef<HTMLInputElement>(null);

  const status: 'idle' | 'submitting' | 'success' | 'error' = isPending
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
  }, [isPending, state.ok]);

  React.useEffect(() => {
    // only map server-reported field errors; never show raw backend errors
    if (state.fieldErrors) {
      const flat: Record<string, string | undefined> = {};
      for (const [k, v] of Object.entries(state.fieldErrors)) flat[k] = v?.[0];
      setClientErrors(flat);
    }
    if (state.ok) {
      setClientErrors({});
    }
  }, [state.fieldErrors, state.ok]);

  function clearError(name: string) {
    setClientErrors((prev) =>
      prev[name] ? { ...prev, [name]: undefined } : prev
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
        // non-fatal; server verifyCaptcha() will allow flow to proceed
      }
    }

    return formAction(formData);
  };

  return (
    <>
      {/* reCAPTCHA v3 loader (safe to include even if you don't set the secret) */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}`}
        strategy="afterInteractive"
      />

      <section
        id="intake-form"
        className="scroll-mt-24 mb-12 mx-auto max-w-2xl rounded-3xl border border-default-200 bg-content1/70 p-6 shadow-small backdrop-blur-sm md:p-8"
      >
        <Card shadow="sm" className="border border-default-200">
          <CardHeader className="flex flex-col items-start gap-1">
            <h2 className="text-lg font-medium">Quick Project Intake</h2>
            <p className="text-xs text-foreground/60">
              ~1 minute • Projects start at{' '}
              <span className="font-semibold">$3,000 CAD</span>
            </p>
          </CardHeader>

          <CardBody>
            <Form
              className="grid gap-6"
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
              <div className="grid gap-4 md:grid-cols-2">
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
                />
                <Input
                  name="company"
                  label="Company / Organization"
                  labelPlacement="outside"
                  placeholder="Acme Inc."
                  type="text"
                />
                <Input
                  name="website"
                  label="Website URL"
                  labelPlacement="outside"
                  placeholder="example.com"
                  type="text"
                  inputMode="url"
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
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  isRequired
                  name="projectType"
                  label="Project type"
                  labelPlacement="outside"
                  placeholder="Choose one"
                  popoverProps={{
                    classNames: { content: 'bg-background' },
                  }}
                  selectedKeys={
                    projectType ? new Set([projectType]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0] as string | undefined;
                    setProjectType(v ?? '');
                    if (v) clearError('projectType');
                  }}
                  isInvalid={!!clientErrors.projectType}
                  errorMessage={clientErrors.projectType}
                >
                  <SelectItem key="divider-1" isDisabled className="opacity-60">
                    — New Builds —
                  </SelectItem>
                  <SelectItem key="website">New Website / Redesign</SelectItem>
                  <SelectItem key="gmb">
                    Google Business Profile Optimization
                  </SelectItem>
                  <SelectItem key="ads">Google Ads Setup</SelectItem>
                  <SelectItem key="divider-2" isDisabled className="opacity-60">
                    — Existing Client Services —
                  </SelectItem>
                  <SelectItem key="integrations">
                    Business Tool Integrations
                  </SelectItem>
                  <SelectItem key="maintenance">
                    Website Maintenance & Hosting
                  </SelectItem>
                  <SelectItem key="seo">Basic SEO Setup</SelectItem>
                </Select>

                <Select
                  isRequired
                  name="goal"
                  label="Primary goal"
                  labelPlacement="outside"
                  placeholder="Choose one"
                  popoverProps={{
                    classNames: { content: 'bg-background' },
                  }}
                  selectedKeys={goal ? new Set([goal]) : new Set()}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0] as string | undefined;
                    setGoal(v ?? '');
                    if (v) clearError('goal');
                  }}
                  isInvalid={!!clientErrors.goal}
                  errorMessage={clientErrors.goal}
                >
                  <SelectItem key="leads">Generate leads</SelectItem>
                  <SelectItem key="sell">Sell products</SelectItem>
                  <SelectItem key="seo">
                    Improve SEO &amp; performance
                  </SelectItem>
                  <SelectItem key="other">Other</SelectItem>
                </Select>

                <Select
                  isRequired
                  name="timeline"
                  label="Timeline"
                  labelPlacement="outside"
                  placeholder="Choose one"
                  popoverProps={{
                    classNames: { content: 'bg-background' },
                  }}
                  selectedKeys={timeline ? new Set([timeline]) : new Set()}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0] as string | undefined;
                    setTimeline(v ?? '');
                    if (v) clearError('timeline');
                  }}
                  isInvalid={!!clientErrors.timeline}
                  errorMessage={clientErrors.timeline}
                >
                  <SelectItem key="asap">ASAP</SelectItem>
                  <SelectItem key="1-2m">1–2 months</SelectItem>
                  <SelectItem key="3m+">3+ months</SelectItem>
                  <SelectItem key="exploring">Just exploring</SelectItem>
                </Select>

                <Select
                  isRequired
                  name="budget"
                  label="Budget range (CAD)"
                  labelPlacement="outside"
                  placeholder="Select a range"
                  popoverProps={{
                    classNames: { content: 'bg-background' },
                  }}
                  selectedKeys={budget ? new Set([budget]) : new Set()}
                  onSelectionChange={(keys) => {
                    const v = Array.from(keys)[0] as string | undefined;
                    setBudget(v ?? '');
                    if (v) clearError('budget');
                  }}
                  isInvalid={!!clientErrors.budget}
                  errorMessage={clientErrors.budget}
                >
                  <SelectItem key="planning">
                    Still planning / need guidance
                  </SelectItem>
                  <SelectItem key="2-3k">
                    $2,000–$3,000 — Starter site
                  </SelectItem>
                  <SelectItem key="3-5k">
                    $3,000–$5,000 — Performance site
                  </SelectItem>
                  <SelectItem key="5k+">$5,000+ — Custom or web app</SelectItem>
                </Select>
              </div>

              <Textarea
                isRequired
                name="notes"
                label="Tell us about your project"
                labelPlacement="outside"
                placeholder="A few sentences: who it’s for, what you need, any special requirements…"
                minRows={4}
                isInvalid={!!clientErrors.notes}
                errorMessage={clientErrors.notes}
                onValueChange={() => clearError('notes')}
              />

              <Checkbox className="md:ml-4" name="consent" isRequired value="1">
                I understand ALL8 projects start at{' '}
                <span className="font-semibold">$3,000 CAD</span> and focus on
                performance, SEO, and conversions.
              </Checkbox>

              <div className="flex items-center justify-center gap-3">
                <p className="text-xs text-foreground/60">
                  No spam. We’ll review and reply within 1–2 business days.
                </p>
                <Button
                  color="primary"
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
                <Button variant="flat" type="reset" isDisabled={isPending}>
                  Reset
                </Button>
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
                  {/* Show field errors inline (above). Here we keep it generic */}
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
          if (!open) router.push('/'); // or a thank-you route
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

            <ModalBody className=" space-y-4 text-foreground/80">
              <p className="text-base">
                We’ll review and follow up within{' '}
                <span className="font-semibold text-white">
                  1–2 business days
                </span>
                .
              </p>
              <ul className="list-disc list-inside text-sm text-foreground/70">
                <li>Watch your inbox for our next steps</li>
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
