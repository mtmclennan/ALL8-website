import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Every integration test must explicitly mock its dependencies. Never reach a vendor.
vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Unexpected network access in integration test'); }));
afterEach(() => {
  cleanup();
  vi.mocked(fetch).mockReset().mockImplementation(() => { throw new Error('Unexpected network access in integration test'); });
});
