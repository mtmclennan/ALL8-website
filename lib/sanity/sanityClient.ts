import { createClient } from 'next-sanity';

export const sanity = createClient({
  projectId: '3w8t68j2', // your ID
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
