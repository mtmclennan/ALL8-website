// types/html.d.ts
import 'react';

declare module 'react' {
  interface LinkHTMLAttributes<T> extends React.HTMLAttributes<T> {
    fetchPriority?: 'high' | 'low' | 'auto';
  }
}
