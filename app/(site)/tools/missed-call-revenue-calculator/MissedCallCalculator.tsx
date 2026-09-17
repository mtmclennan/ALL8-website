"use client";

import type {
  MissedCallInputs,
  MissedCallResults,
} from "@/lib/calculators/missedCall";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  PhoneMissed,
} from "lucide-react";

import Button from "@/app/(site)/_components/ui/Button";
import { useLeadModal } from "@/app/(site)/_components/LeadModalProvider";
import { trackEvent } from "@/lib/analytics/dataLayer";
import {
  calculateMissedCallOpportunity,
  getOpportunityBand,
  MISSED_CALL_LIMITS,
  MissedCallInputsSchema,
} from "@/lib/calculators/missedCall";

type FieldName = keyof MissedCallInputs;
type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;

type CalculatorField = {
  name: FieldName;
  label: string;
  helper: string;
  placeholder: string;
  prefix?: string;
  suffix?: string;
  max: number;
  step: string;
};

const CALCULATOR_ID = "missed_call_revenue_calculator";

const INITIAL_VALUES: FormValues = {
  missedCallsPerWeek: "",
  leadRate: "",
  averageJobValue: "",
  closeRate: "",
  recoveryRate: "",
};

const FIELDS: CalculatorField[] = [
  {
    name: "missedCallsPerWeek",
    label: "Missed calls per week",
    helper: "About how many business calls go unanswered in a typical week?",
    placeholder: "e.g. 6",
    max: MISSED_CALL_LIMITS.missedCallsPerWeek,
    step: "1",
  },
  {
    name: "leadRate",
    label: "How many missed calls are likely genuine sales leads?",
    helper:
      "Enter a percentage from 0 to 100. Exclude spam, suppliers, existing customers and unrelated calls.",
    placeholder: "e.g. 60",
    suffix: "%",
    max: 100,
    step: "0.1",
  },
  {
    name: "averageJobValue",
    label: "Average job value",
    helper: "Enter the typical dollar revenue from one new customer or job.",
    placeholder: "e.g. 2500",
    prefix: "$",
    max: MISSED_CALL_LIMITS.averageJobValue,
    step: "0.01",
  },
  {
    name: "closeRate",
    label: "Typical close rate",
    helper:
      "Of qualified leads you speak with, roughly what percentage become customers?",
    placeholder: "e.g. 30",
    suffix: "%",
    max: 100,
    step: "0.1",
  },
  {
    name: "recoveryRate",
    label: "Current missed-call recovery rate",
    helper:
      "What percentage currently get called back, texted or otherwise followed up successfully?",
    placeholder: "e.g. 25",
    suffix: "%",
    max: 100,
    step: "0.1",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

function NumericField({
  field,
  value,
  error,
  onChange,
}: {
  field: CalculatorField;
  value: string;
  error?: string;
  onChange: (name: FieldName, value: string) => void;
}) {
  const helperId = `${field.name}-helper`;
  const errorId = `${field.name}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-white" htmlFor={field.name}>
        {field.label}
      </label>
      <p className="text-sm leading-relaxed text-white/60" id={helperId}>
        {field.helper}
      </p>
      <div
        className={`flex min-h-12 items-center rounded-xl border bg-white/[0.045] transition-colors focus-within:bg-white/[0.07] ${
          error
            ? "border-red-400/70 focus-within:border-red-400"
            : "border-white/[0.1] focus-within:border-accent-blue"
        }`}
      >
        {field.prefix ? (
          <span aria-hidden="true" className="pl-4 font-bold text-white/55">
            {field.prefix}
          </span>
        ) : null}
        <input
          required
          aria-describedby={`${helperId}${error ? ` ${errorId}` : ""}`}
          aria-invalid={Boolean(error)}
          className="min-h-12 w-full min-w-0 bg-transparent px-4 py-3 text-base font-semibold text-white outline-none placeholder:font-normal placeholder:text-[#6f8098]"
          id={field.name}
          inputMode="decimal"
          max={field.max}
          min="0"
          name={field.name}
          placeholder={field.placeholder}
          step={field.step}
          type="number"
          value={value}
          onChange={(event) => onChange(field.name, event.target.value)}
        />
        {field.suffix ? (
          <span aria-hidden="true" className="pr-4 font-bold text-white/55">
            {field.suffix}
          </span>
        ) : null}
      </div>
      {error ? (
        <p
          className="text-sm font-medium text-red-300"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ResultsPanel({ results }: { results: MissedCallResults }) {
  const { openModal } = useLeadModal();

  const handleLeadReviewClick = () => {
    trackEvent("lead_review_clicked", {
      calculator_id: CALCULATOR_ID,
      source: "calculator_result",
    });
    openModal();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-[rgba(0,118,255,.32)] bg-gradient-to-br from-[rgba(0,118,255,.16)] to-[rgba(11,15,26,.4)] p-6 sm:p-8">
        <div className="flex items-center gap-3 text-accent-blue">
          <CheckCircle2 aria-hidden="true" size={20} />
          <p className="text-xs font-bold uppercase tracking-[.12em]">
            Your estimate
          </p>
        </div>
        <h2 className="mt-5 text-xl font-extrabold tracking-[-.02em]">
          Estimated unrecovered sales opportunity
        </h2>
        <p className="mt-3 break-words text-[clamp(36px,7vw,58px)] font-black leading-none tracking-[-.045em] text-white">
          {currencyFormatter.format(results.annualUnrecoveredOpportunity)}
          <span className="ml-2 text-lg font-bold tracking-normal text-white/55">
            / year
          </span>
        </p>
        <p className="mt-5 text-base leading-relaxed text-white/70">
          Based on your inputs, this is the approximate annual sales opportunity
          represented by missed calls that are not currently recovered.
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          {
            label: "Potential genuine leads",
            value: `${numberFormatter.format(results.annualPotentialLeads)} / year`,
          },
          {
            label: "Potential jobs represented",
            value: `${numberFormatter.format(results.annualPotentialJobs)} / year`,
            note: "After your current recovery rate",
          },
          {
            label: "Monthly unrecovered opportunity",
            value: `${currencyFormatter.format(results.monthlyUnrecoveredOpportunity)} / month`,
          },
          {
            label: "Total annual opportunity represented",
            value: `${currencyFormatter.format(results.annualOpportunity)} / year`,
            note: "Before current recovery",
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-white/[0.09] bg-white/[0.035] p-5"
          >
            <dt className="text-sm font-bold text-white/65">{metric.label}</dt>
            <dd className="mt-2 text-xl font-extrabold text-white">
              {metric.value}
            </dd>
            {metric.note ? (
              <dd className="mt-2 text-xs text-white/50">{metric.note}</dd>
            ) : null}
          </div>
        ))}
      </dl>

      <div className="rounded-2xl border border-white/[0.1] bg-black/20 p-5 text-sm leading-relaxed text-white/65">
        <p className="font-bold text-white">
          What this estimate does—and does not—mean
        </p>
        <p className="mt-2">
          This calculator estimates potential sales opportunity based on the
          numbers you enter. It does not predict guaranteed lost or recoverable
          revenue. Not every missed call is a lead, not every lead would close,
          and some calls are already recovered later.
        </p>
      </div>

      <section className="rounded-[20px] border border-white/[0.1] bg-content3 p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold tracking-[-.025em]">
          Missed calls are only one place leads can disappear.
        </h2>
        <p className="mt-4 leading-relaxed text-white/70">
          Slow response, weak quote forms, inconsistent follow-up, unclear
          ownership and poor lead tracking can create similar gaps. ALL8 can
          review the full path and identify what to fix first.
        </p>
        <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button type="button" onClick={handleLeadReviewClick}>
            Find Where I&apos;m Losing Leads <ArrowRight size={17} />
          </Button>
          <Link
            className="inline-flex min-h-11 items-center gap-2 py-2 font-bold text-accent-blue hover:text-[#8ec5ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
            href="/services/missed-call-recovery"
          >
            See how missed-call recovery works <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function MissedCallCalculator() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [results, setResults] = useState<MissedCallResults | null>(null);
  const startedRef = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent("calculator_view", { calculator_id: CALCULATOR_ID });
  }, []);

  const handleChange = (name: FieldName, value: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("calculator_started", { calculator_id: CALCULATOR_ID });
    }

    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missingErrors: FormErrors = {};

    for (const field of FIELDS) {
      if (!values[field.name].trim()) {
        missingErrors[field.name] = "Enter a value to calculate your estimate.";
      }
    }

    if (Object.keys(missingErrors).length) {
      setErrors(missingErrors);
      setResults(null);
      const firstMissingField = FIELDS.find(
        (field) => missingErrors[field.name],
      );

      window.requestAnimationFrame(() =>
        document.getElementById(firstMissingField?.name ?? "")?.focus(),
      );

      return;
    }

    const candidate = Object.fromEntries(
      FIELDS.map((field) => [field.name, Number(values[field.name])]),
    );
    const parsed = MissedCallInputsSchema.safeParse(candidate);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const nextErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(([name, messages]) => [
          name,
          messages?.[0],
        ]),
      ) as FormErrors;

      setErrors(nextErrors);
      setResults(null);
      const firstInvalidField = FIELDS.find((field) => nextErrors[field.name]);

      window.requestAnimationFrame(() =>
        document.getElementById(firstInvalidField?.name ?? "")?.focus(),
      );

      return;
    }

    const nextResults = calculateMissedCallOpportunity(parsed.data);

    setErrors({});
    setResults(nextResults);
    trackEvent("calculator_completed", {
      calculator_id: CALCULATOR_ID,
      result_band: getOpportunityBand(nextResults.annualUnrecoveredOpportunity),
    });
    window.requestAnimationFrame(() => resultRef.current?.focus());
  };

  return (
    <section
      aria-labelledby="calculator-heading"
      className="mx-auto mt-10 max-w-[1180px] px-5 sm:px-8"
    >
      <div className="overflow-hidden rounded-[24px] border border-white/[0.1] bg-content2 shadow-[0_24px_80px_-40px_rgba(0,118,255,.45)]">
        <div className="grid lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
          <div className="border-b border-white/[0.09] p-6 sm:p-9 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-3 text-accent-blue">
              <Calculator aria-hidden="true" size={21} />
              <p className="text-xs font-bold uppercase tracking-[.12em]">
                Use your own numbers
              </p>
            </div>
            <h2
              className="mt-4 text-3xl font-extrabold tracking-[-.025em]"
              id="calculator-heading"
            >
              Estimate the opportunity
            </h2>
            <p className="mt-3 leading-relaxed text-white/65">
              Nothing is pre-filled with industry averages. Not sure about a
              number? Use your best estimate.
            </p>

            <form noValidate className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {FIELDS.map((field) => (
                <NumericField
                  key={field.name}
                  error={errors[field.name]}
                  field={field}
                  value={values[field.name]}
                  onChange={handleChange}
                />
              ))}
              <Button className="w-full" size="lg" type="submit">
                Calculate My Estimate <ArrowRight size={18} />
              </Button>
              <p className="text-center text-xs leading-relaxed text-white/50">
                Calculated in your browser. Your inputs are not saved or sent to
                ALL8.
              </p>
            </form>
          </div>

          <div
            ref={resultRef}
            aria-atomic="true"
            aria-live="polite"
            className="min-w-0 p-6 outline-none sm:p-9"
            tabIndex={-1}
          >
            {results ? (
              <ResultsPanel results={results} />
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[20px] border border-dashed border-white/[0.12] bg-black/10 p-8 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-[rgba(0,118,255,.25)] bg-[rgba(0,118,255,.1)] text-accent-blue">
                  <PhoneMissed aria-hidden="true" size={25} />
                </div>
                <h2 className="mt-5 text-2xl font-extrabold">
                  Your estimate will appear here
                </h2>
                <p className="mt-3 max-w-md leading-relaxed text-white/60">
                  Enter all five values to see potential genuine leads, jobs,
                  monthly opportunity and annual unrecovered opportunity.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
