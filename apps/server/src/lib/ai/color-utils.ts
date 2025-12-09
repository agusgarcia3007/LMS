import Color from "colorjs.io";

export function hexToOklch(hex: string): string {
  const color = new Color(hex);
  const oklch = color.oklch;
  const lightness = oklch.l.toFixed(2);
  const chroma = oklch.c.toFixed(3);
  const hue = Number.isNaN(oklch.h) ? 0 : Math.round(oklch.h);
  return `oklch(${lightness} ${chroma} ${hue})`;
}
