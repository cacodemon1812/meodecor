"use client";
import { useEffect } from "react";

export default function HeaderClient() {
  useEffect(() => {
    const header = document.getElementById("header");
    const hero = document.getElementById("hero");
    if (!header) return;
    const hasHero = !!hero;
    const onScroll = () => {
      // If there's no hero section (internal pages), keep header solid by default
      if (!hasHero) {
        header.classList.add("header-scrolled");
        header.classList.remove("header-transparent");
        return;
      }

      const threshold = hero ? hero.getBoundingClientRect().bottom : 80;
      if (window.scrollY > threshold - 20) {
        header.classList.add("header-scrolled");
        header.classList.remove("header-transparent");
      } else {
        header.classList.remove("header-scrolled");
        header.classList.add("header-transparent");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
