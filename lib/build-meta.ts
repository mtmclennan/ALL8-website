export const BUILD_DATE = new Date(
  process.env.NEXT_PUBLIC_BUILD_TIME || Date.now(),
);
