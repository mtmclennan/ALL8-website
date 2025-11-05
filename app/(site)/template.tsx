// app/(site)/template.tsx
import type { ReactNode } from 'react';
import SchemaRouter from './SchemaRouter';

export default function SiteTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SchemaRouter pathname="/" />
    </>
  );
}
