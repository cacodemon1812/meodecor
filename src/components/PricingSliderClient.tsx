"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Package } from "@/types";
import "../styles/pricing.css";

export default function PricingSliderClient({ items }: { items: Package[] }) {
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 4000);
  }, [items.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [startTimer]);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + items.length) % items.length),
    [items.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % items.length),
    [items.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const selectPackage = useCallback(
    (i: number) => {
      setIndex(i);
      startTimer();
    },
    [startTimer],
  );

  return (
    <div className="pricing-slider" role="region" aria-label="Pricing carousel">
      {/* ── Slides ── */}
      <div className="pricing-track">
        {items.map((pkg, i) => (
          <article
            key={pkg.id}
            className={`pricing-card ${i === index ? "active" : ""}`}
            aria-hidden={i !== index}
          >
            {/* Left: full-height image */}
            {pkg.image && (
              <div className="pricing-image-wrapper">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 44vw"
                  className="pricing-image"
                  priority={i === 0}
                />
              </div>
            )}

            {/* Right: info panel */}
            <div className="pricing-body">
              <h3>{pkg.title}</h3>

              {pkg.tagline && (
                <p className="pricing-tagline">{pkg.tagline}</p>
              )}

              <div className="pricing-divider" />

              <div className="pricing-amount">
                <strong>{pkg.price}</strong>
                <span className="currency">{pkg.currency ?? "VND"}</span>
              </div>

              {pkg.bullets && pkg.bullets.length > 0 && (
                <ul className="pricing-bullets">
                  {pkg.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}

              <a className="pricing-cta" href="#contact">
                Đặt ngay →
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* ── Package selector ── */}
      <div className="package-selector">
        {items.map((pkg, i) => (
          <button
            key={pkg.id}
            type="button"
            className={`package-btn ${i === index ? "active" : ""}`}
            onClick={() => selectPackage(i)}
            aria-pressed={i === index}
            aria-label={`Chọn ${pkg.title}`}
          >
            {pkg.title}
          </button>
        ))}
      </div>

      {/* ── Screen reader live region ── */}
      <div className="sr-only" aria-live="polite">
        {items[index]
          ? `${items[index].title}, ${items[index].price} ${items[index].currency ?? "VND"}`
          : ""}
      </div>

      {/* ── Prev / dots / next ── */}
      <div className="pricing-controls">
        <button type="button" className="prev" onClick={prev} aria-label="Gói trước">
          ‹
        </button>

        <div className="dots">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Gói thứ ${i + 1}`}
            />
          ))}
        </div>

        <button type="button" className="next" onClick={next} aria-label="Gói tiếp theo">
          ›
        </button>
      </div>
    </div>
  );
}
