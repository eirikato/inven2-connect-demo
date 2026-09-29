import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Prefixes root-absolute asset paths with the app base so they resolve under a subpath host (GitHub Pages).
export function assetUrl(url: string) {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
  return `${base}/${url.replace(/^\//, "")}`;
}
