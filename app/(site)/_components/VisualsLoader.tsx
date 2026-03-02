'use client';
import { useEffect } from 'react';

export default function VisualsLoader() {
  useEffect(() => {
    import('@/styles/visuals.css');
    import('@/styles/animations.css');
  }, []);

  return null;
}
