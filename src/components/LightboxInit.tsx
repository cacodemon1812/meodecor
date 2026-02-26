"use client";

import { useEffect } from "react";

export default function LightboxInit() {
  useEffect(() => {
    // initialize when script has loaded
    if (typeof window !== "undefined" && (window as any).SimpleLightbox) {
      new (window as any).SimpleLightbox('.gallery a', {});
    }
  }, []);

  return null;
}
