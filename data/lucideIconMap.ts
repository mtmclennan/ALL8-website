import * as Icons from "lucide-react";

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
  PhoneMissed: Icons.PhoneMissed,
  MessageSquare: Icons.MessageSquare,
  Users: Icons.Users,
  BarChart3: Icons.BarChart3,
  Gauge: Icons.Gauge,
  Plug: Icons.Plug,
} as const;

// ✅ Strong type alias for icons
export type LucideIconName = keyof typeof lucideIconMap;
