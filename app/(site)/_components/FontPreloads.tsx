"use client";

import { preload } from "react-dom";

const latinFonts = [
  "/fonts/archivo-v25-latin.woff2",
  "/fonts/dm-sans-v17-latin.woff2",
  "/fonts/orbitron-v35-latin.woff2",
];

export function FontPreloads() {
  for (const href of latinFonts) {
    preload(href, { as: "font", crossOrigin: "anonymous", type: "font/woff2" });
  }

  return null;
}
