// 'use client';

// import React from 'react';
// import { Form } from '@heroui/form';
// import { Input, Textarea } from '@heroui/input';
// import { Button } from '@heroui/button';
// import { Select, SelectItem } from '@heroui/select';
// import { Checkbox } from '@heroui/checkbox';
// import { Card, CardBody, CardHeader } from '@heroui/card';
// import { Spinner } from '@heroui/spinner';

// export default function ContactIntakeForm() {
//   const [status, setStatus] = React.useState<
//     'idle' | 'submitting' | 'success' | 'error'
//   >('idle');
//   const [serverMessage, setServerMessage] = React.useState<string | null>(null);

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setStatus('submitting');
//     setServerMessage(null);

//     const fd = new FormData(e.currentTarget);
//     const payload = Object.fromEntries(fd.entries()) as Record<string, any>;
//     payload.consent = fd.get('consent') ? true : false;

//     try {
//       const res = await fetch('/api/contact', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ source: 'all8-heroui', ...payload }),
//       });
//       if (!res.ok) throw new Error(String(res.status));
//       const data = (await res.json()) as { ok: boolean; message?: string };
//       setStatus('success');
//       setServerMessage(
//         data?.message || 'Thanks! We’ll review and follow up shortly.'
//       );
//       (e.currentTarget as HTMLFormElement).reset();
//     } catch (err) {
//       console.error(err);
//       setStatus('error');
//       setServerMessage(
//         'Something went wrong. Please try again or email hello@all8webworks.com.'
//       );
//     }
//   }

//   return (
//     <section className="mx-auto max-w-2xl rounded-3xl border border-default-200 bg-content1/70 p-6 shadow-small backdrop-blur-sm md:p-8">
//       <Card shadow="sm" className="border border-default-200">
//         <CardHeader className="flex flex-col items-start gap-1">
//           <h2 className="text-lg font-medium">Quick Project Intake</h2>
//           <p className="text-xs text-foreground/60">
//             ~1 minute • Projects start at{' '}
//             <span className="font-semibold">$3,000 CAD</span>
//           </p>
//         </CardHeader>
//         <CardBody>
//           <Form className="grid gap-6" onSubmit={handleSubmit}>
//             <div className="grid gap-4 md:grid-cols-2">
//               <Input
//                 isRequired
//                 name="name"
//                 label="Name"
//                 labelPlacement="outside"
//                 placeholder="Jane Doe"
//                 type="text"
//               />
//               <Input
//                 isRequired
//                 name="email"
//                 type="email"
//                 label="Email"
//                 labelPlacement="outside"
//                 placeholder="jane@company.com"
//               />
//               <Input
//                 name="company"
//                 label="Company / Organization"
//                 labelPlacement="outside"
//                 placeholder="Acme Inc."
//                 type="text"
//               />
//               <Input
//                 name="website"
//                 label="Website URL"
//                 labelPlacement="outside"
//                 placeholder="https://example.com"
//                 type="url"
//               />
//             </div>
//             <div className="sr-only" aria-hidden="true">
//               <input
//                 type="text"
//                 name="hp"
//                 tabIndex={-1}
//                 autoComplete="off"
//                 defaultValue=""
//               />
//             </div>

//             <div className="grid gap-4 md:grid-cols-2">
//               <Select
//                 isRequired
//                 name="projectType"
//                 label="Project type"
//                 labelPlacement="outside"
//                 placeholder="Choose one"
//               >
//                 <SelectItem key="new">New website</SelectItem>
//                 <SelectItem key="redesign">Redesign</SelectItem>
//                 <SelectItem key="ecom">E‑commerce</SelectItem>
//                 <SelectItem key="webapp">Web app / custom</SelectItem>
//               </Select>

//               <Select
//                 isRequired
//                 name="goal"
//                 label="Primary goal"
//                 labelPlacement="outside"
//                 placeholder="Choose one"
//               >
//                 <SelectItem key="leads">Generate leads</SelectItem>
//                 <SelectItem key="sell">Sell products</SelectItem>
//                 <SelectItem key="seo">Improve SEO & performance</SelectItem>
//                 <SelectItem key="other">Other</SelectItem>
//               </Select>

//               <Select
//                 isRequired
//                 name="timeline"
//                 label="Timeline"
//                 labelPlacement="outside"
//                 placeholder="Choose one"
//               >
//                 <SelectItem key="asap">ASAP</SelectItem>
//                 <SelectItem key="1-2m">1–2 months</SelectItem>
//                 <SelectItem key="3m+">3+ months</SelectItem>
//                 <SelectItem key="exploring">Just exploring</SelectItem>
//               </Select>

//               <Select
//                 isRequired
//                 name="budget"
//                 label="Budget range (CAD)"
//                 labelPlacement="outside"
//                 placeholder="Select a range"
//               >
//                 <SelectItem key="3-5k">$3,000–$5,000</SelectItem>
//                 <SelectItem key="5-10k">$5,000–$10,000</SelectItem>
//                 <SelectItem key="10k+">$10,000+</SelectItem>
//               </Select>
//             </div>

//             <Textarea
//               isRequired
//               name="notes"
//               label="Tell us about your project"
//               labelPlacement="outside"
//               placeholder="A few sentences: who it’s for, what you need, any special requirements…"
//               minRows={4}
//             />

//             <Checkbox name="consent" isRequired>
//               I understand ALL8 projects start at{' '}
//               <span className="font-semibold">$3,000 CAD</span> and focus on
//               performance, SEO, and conversions.
//             </Checkbox>

//             <div className="flex items-center justify-between gap-4">
//               <p className="text-xs text-foreground/60">
//                 No spam. We’ll review and reply within 1–2 business days.
//               </p>

//               <Button
//                 color="primary"
//                 type="submit"
//                 isDisabled={status === 'submitting'}
//               >
//                 {status === 'submitting' ? (
//                   <span className="flex items-center gap-2">
//                     <Spinner size="sm" /> Sending…
//                   </span>
//                 ) : (
//                   'Request a Proposal'
//                 )}
//               </Button>

//               <Button variant="flat" type="reset">
//                 Reset
//               </Button>
//             </div>

//             {status !== 'idle' && (
//               <div
//                 className={
//                   'rounded-xl border p-3 text-sm ' +
//                   (status === 'success'
//                     ? 'border-success-200 bg-success-50 text-success-700'
//                     : status === 'error'
//                       ? 'border-danger-200 bg-danger-50 text-danger-700'
//                       : 'border-default-200 bg-default-50 text-foreground/80')
//                 }
//               >
//                 {serverMessage}
//               </div>
//             )}
//           </Form>
//         </CardBody>
//       </Card>
//     </section>
//   );
// }
'use client';
import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { Form } from '@heroui/form';
import { Input, Textarea } from '@heroui/input';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { Checkbox } from '@heroui/checkbox';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import {
  submitIntake,
  type IntakeActionState,
} from '@/app/actions/submit-intake';
import { clear } from 'console';

// GTM helper
function pushDL(event: string, payload?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event, ...payload });
}

const initialState: IntakeActionState = { ok: false };

export default function ContactIntakeForm() {
  const [state, formAction, isPending] = useActionState(
    submitIntake,
    initialState
  );

  // Local state for HeroUI <Select> components (mirrored to hidden inputs)
  const [projectType, setProjectType] = React.useState('');
  const [goal, setGoal] = React.useState('');
  const [timeline, setTimeline] = React.useState('');
  const [budget, setBudget] = React.useState('');
  const [clientErrors, setClientErrors] = React.useState<
    Record<string, string | undefined>
  >({});

  // Status derived from server state + pending flag
  const status: 'idle' | 'submitting' | 'success' | 'error' = isPending
    ? 'submitting'
    : state.ok
      ? 'success'
      : state.message
        ? 'error'
        : 'idle';

  // Fire conversion event on success
  useEffect(() => {
    if (state.ok) {
      pushDL('lead_submit', { form_id: 'contact-intake', source: 'all8-site' });
    }
  }, [state.ok]);

  React.useEffect(() => {
    if (state.fieldErrors) {
      const flat: Record<string, string | undefined> = {};
      for (const [k, v] of Object.entries(state.fieldErrors)) {
        flat[k] = v?.[0];
      }
      setClientErrors(flat);
    }
    if (state.ok) {
      setClientErrors({});
      // formRef.current?.reset();
      setProjectType('');
      setGoal('');
      setTimeline('');
      setBudget('');
    }
  }, [state.fieldErrors, state.ok]);

  function clearError(name: string) {
    setClientErrors((prev) =>
      prev[name] ? { ...prev, [name]: undefined } : prev
    );
  }

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-default-200 bg-content1/70 p-6 shadow-small backdrop-blur-sm md:p-8">
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
            action={formAction}
            aria-describedby="form-status"
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
                errorMessage={clearError.name}
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
                placeholder="https://example.com"
                type="url"
              />
            </div>

            {/* Honeypot (a11y-safe) */}
            <div className="sr-only" aria-hidden="true">
              <input
                type="text"
                name="hp"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Project Type */}
              <Select
                isRequired
                label="Project type"
                labelPlacement="outside"
                placeholder="Choose one"
                selectedKeys={projectType ? [projectType] : []}
                onSelectionChange={(keys) =>
                  setProjectType(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="new">New website</SelectItem>
                <SelectItem key="redesign">Redesign</SelectItem>
                <SelectItem key="ecom">E-commerce</SelectItem>
                <SelectItem key="webapp">Web app / custom</SelectItem>
              </Select>
              <input
                type="hidden"
                name="projectType"
                value={projectType || ''}
              />

              {/* Goal */}
              <Select
                isRequired
                label="Primary goal"
                labelPlacement="outside"
                placeholder="Choose one"
                selectedKeys={goal ? [goal] : []}
                onSelectionChange={(keys) => {
                  const v = (Array.from(keys)[0] as string) ?? '';
                  setGoal(v);
                  if (v) clearError('Primary goal');
                }}
              >
                <SelectItem key="leads">Generate leads</SelectItem>
                <SelectItem key="sell">Sell products</SelectItem>
                <SelectItem key="seo">Improve SEO & performance</SelectItem>
                <SelectItem key="other">Other</SelectItem>
              </Select>
              <input type="hidden" name="goal" value={goal || ''} />

              {/* Timeline */}
              <Select
                isRequired
                label="Timeline"
                labelPlacement="outside"
                placeholder="Choose one"
                selectedKeys={timeline ? [timeline] : []}
                onSelectionChange={(keys) =>
                  setTimeline(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="asap">ASAP</SelectItem>
                <SelectItem key="1-2m">1–2 months</SelectItem>
                <SelectItem key="3m+">3+ months</SelectItem>
                <SelectItem key="exploring">Just exploring</SelectItem>
              </Select>
              <input type="hidden" name="timeline" value={timeline || ''} />

              {/* Budget */}
              <Select
                isRequired
                label="Budget range (CAD)"
                labelPlacement="outside"
                placeholder="Select a range"
                selectedKeys={budget ? [budget] : []}
                onSelectionChange={(keys) =>
                  setBudget(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="3-5k">$3,000–$5,000</SelectItem>
                <SelectItem key="5-10k">$5,000–$10,000</SelectItem>
                <SelectItem key="10k+">$10,000+</SelectItem>
              </Select>
              <input type="hidden" name="budget" value={budget || ''} />
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

            <Checkbox name="consent" isRequired>
              I understand ALL8 projects start at{' '}
              <span className="font-semibold">$3,000 CAD</span> and focus on
              performance, SEO, and conversions.
            </Checkbox>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-foreground/60">
                No spam. We’ll review and reply within 1–2 business days.
              </p>

              <Button color="primary" type="submit" isDisabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" /> Sending…
                  </span>
                ) : (
                  'Request a Proposal'
                )}
              </Button>

              <Button variant="flat" type="reset">
                Reset
              </Button>
            </div>

            {status !== 'idle' && (
              <div
                id="form-status"
                className={
                  'rounded-xl border p-3 text-sm ' +
                  (status === 'success'
                    ? 'border-success-200 bg-success-50 text-success-700'
                    : status === 'error'
                      ? 'border-danger-200 bg-danger-50 text-danger-700'
                      : 'border-default-200 bg-default-50 text-foreground/80')
                }
              >
                {state.message}
              </div>
            )}
          </Form>
        </CardBody>
      </Card>
    </section>
  );
}
