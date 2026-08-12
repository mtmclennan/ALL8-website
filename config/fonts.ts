import {
  Archivo,
  DM_Sans,
  Fira_Code as FontMono,
  Orbitron,
} from "next/font/google";

export const fontArchivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Brand wordmark only ("ALL8 WEBWORKS" logotype) — kept from the pre-redesign
// brand identity. Not used for body copy or headings; see font-display/font-body
// in tailwind.config.js.
export const fontOrbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

export const fontDmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-dmsans",
  display: "swap",
});
