"use client";

import React, { useEffect, useState } from "react";
import {
  CTA_BUTTONS,
  fetchCtaButtons,
  fetchHeroBackgrounds,
  fetchHeroSlides,
  HERO_SLIDES,
  HERO_SLIDES_BG,
} from "@/data/constants";
import Image from "next/image";

export default function Hero() {
  const [slides, setSlides] = useState(HERO_SLIDES);
  const [heroBackgrounds, setHeroBackgrounds] = useState(HERO_SLIDES_BG);
  const [ctaButtons, setCtaButtons] = useState(CTA_BUTTONS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      const [remoteSlides, remoteBackgrounds, remoteCtas] = await Promise.all([
        fetchHeroSlides(),
        fetchHeroBackgrounds(),
        fetchCtaButtons(),
      ]);
      if (remoteSlides?.length) {
        setSlides(remoteSlides);
      }
      if (remoteBackgrounds?.length) {
        setHeroBackgrounds(remoteBackgrounds);
      }
      if (remoteCtas) {
        setCtaButtons(remoteCtas);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!slides.length) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides]);

  const activeSlide = slides[currentIndex] ?? HERO_SLIDES[0];
  const heroBackground =
    heroBackgrounds?.[0]?.image ?? "/assets/img/logo/logo.png";
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
          <h2 className="hero-logo-wrap items-center text-center flex flex-col gap-4">
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
            <a href={ctaButtons.services.href} className="btn-menu scrollto">
              {ctaButtons.services.label}
            </a>
            <a href={ctaButtons.contact.href} className="btn-book scrollto">
              {ctaButtons.contact.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
