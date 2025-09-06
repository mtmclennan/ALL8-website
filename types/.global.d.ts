declare const grecaptcha: {
  ready(cb: () => void): void;
  execute(siteKey: string, opts: { action: string }): Promise<string>;
};
