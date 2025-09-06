import * as Lucide from 'lucide-react';

export function getIconByName(
  name: string
): React.ComponentType<{ className?: string }> {
  // Fallback to Circle if missing
  // @ts-ignore – dynamic index of lucide exports
  return (Lucide[name] as any) ?? Lucide.Circle;
}
