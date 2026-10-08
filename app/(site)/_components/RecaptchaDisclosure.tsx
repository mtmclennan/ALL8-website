export default function RecaptchaDisclosure() {
  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) return null;

  return (
    <p className="mt-3 text-center text-xs leading-relaxed text-white/60">
      This site is protected by reCAPTCHA and the Google{" "}
      <a
        className="underline hover:text-white"
        href="https://policies.google.com/privacy"
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        className="underline hover:text-white"
        href="https://policies.google.com/terms"
      >
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
}
