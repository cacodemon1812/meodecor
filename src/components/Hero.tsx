"use client";

import React, { useEffect, useState } from "react";
import { HERO_SLIDES, CTA_BUTTONS } from "@/data/constants";
import { HERO_SLIDES_BG } from "@/services/mockApi";
import Image from "next/image";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const activeSlide = HERO_SLIDES[currentIndex];
  const heroBackground =
    HERO_SLIDES_BG?.[0]?.image ?? "/assets/img/logo/logo.png";
  const activeSubtitle = activeSlide?.subtitle?.trim()
    ? activeSlide.subtitle
    : (activeSlide?.title ?? "");

  return (
    <section
      id="hero"
      className="hero-static-v3"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="hero-static-overlay">
        <div className="hero-static-panel">
          <h2 className={" items-center text-center flex flex-col gap-4"}>
            <Image
              src="/assets/img/logo/logo.png"
              alt="Meo Decor Logo"
              width={120}
              height={120}
              className="img-fluid logo-meo"
              priority
            />
          </h2>

          <h2
            key={`subtitle-${activeSlide.id}`}
            className="hero-subtitle-type"
            aria-live="polite"
          >
            {activeSubtitle}
          </h2>

          <p
            key={`description-${activeSlide.id}`}
            className="hero-description-glow"
          >
            {activeSlide.description}
          </p>

          <div className="hero-actions hero-actions-fixed">
            <a href={CTA_BUTTONS.services.href} className="btn-menu scrollto">
              {CTA_BUTTONS.services.label}
            </a>
            <a href={CTA_BUTTONS.contact.href} className="btn-book scrollto">
              {CTA_BUTTONS.contact.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
