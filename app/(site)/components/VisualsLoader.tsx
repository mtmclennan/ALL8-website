'use client';
import { useEffect } from 'react';

export function VisualsLoader() {
  useEffect(() => {
    import('@/styles/visuals.css');
    import('@/styles/animations.css');
  }, []);
  return null;
}
