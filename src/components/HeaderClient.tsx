"use client";
import { useEffect } from "react";

export default function HeaderClient() {
  useEffect(() => {
    const header = document.getElementById("header");
    const hero = document.getElementById("hero");
    const navbar = document.getElementById("navbar");
    const mobileToggle =
      document.querySelector<HTMLElement>(".mobile-nav-toggle");
    const navLinks =
      document.querySelectorAll<HTMLAnchorElement>("#navbar .nav-link");
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

    const closeMobileMenu = () => {
      if (!navbar || !mobileToggle) return;
      navbar.classList.remove("navbar-mobile");
      mobileToggle.classList.remove("bi-x");
      mobileToggle.classList.add("bi-list");
      document.body.classList.remove("mobile-nav-active");
    };

    const toggleMobileMenu = () => {
      if (!navbar || !mobileToggle) return;
      const opened = navbar.classList.toggle("navbar-mobile");
      mobileToggle.classList.toggle("bi-list", !opened);
      mobileToggle.classList.toggle("bi-x", opened);
      document.body.classList.toggle("mobile-nav-active", opened);
    };

    mobileToggle?.addEventListener("click", toggleMobileMenu);
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("resize", closeMobileMenu);

    return () => {
      mobileToggle?.removeEventListener("click", toggleMobileMenu);
      navLinks.forEach((link) => {
        link.removeEventListener("click", closeMobileMenu);
      });
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", closeMobileMenu);
    };
  }, []);

  return null;
}
