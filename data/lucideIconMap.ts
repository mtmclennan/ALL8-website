import * as Icons from 'lucide-react';

// Explicitly type your map:
export const lucideIconMap = {
  Rocket: Icons.Rocket,
  Wrench: Icons.Wrench,
  Search: Icons.Search,
  Target: Icons.Target,
  Server: Icons.Server,
  LayoutGrid: Icons.LayoutGrid,
  MapPin: Icons.MapPin,
  TrendingUp: Icons.TrendingUp,
  ClipboardList: Icons.ClipboardList,
  Brush: Icons.Brush,
  Zap: Icons.Zap,
  ShieldCheck: Icons.ShieldCheck,
  AlertTriangle: Icons.AlertTriangle,
  PlugZap: Icons.PlugZap,
  MousePointerClick: Icons.MousePointerClick,
  ShieldOff: Icons.ShieldOff,
} as const;

// ✅ Strong type alias for icons
export type LucideIconName = keyof typeof lucideIconMap;
