"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HERO_SLIDES, CTA_BUTTONS, ANIMATIONS } from "@/data/constants";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const goPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  };

  return (
    <section id="hero">
      <div className="hero-container">
        <div id="heroCarousel" className="carousel slide carousel-fade">
          <ol className="carousel-indicators" id="hero-carousel-indicators">
            {HERO_SLIDES.map((slide, index) => (
              <li
                key={slide.id}
                className={index === currentIndex ? "active" : ""}
                onClick={() => setCurrentIndex(index)}
              ></li>
            ))}
          </ol>

          <div className="carousel-inner" role="listbox">
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-item ${index === currentIndex ? "active" : ""}`}
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "#fdf8f2",
                }}
              >
                <div className="carousel-container">
                  <div className="carousel-content " style={{ width: "100%" }}>
                    {index === 0 && (
                      <h2
                        className={
                          ANIMATIONS.fadeInDown +
                          " items-center text-center flex flex-col gap-4"
                        }
                      >
                        <Image
                          src="/assets/img/logo/logo.png"
                          alt="Meo Decor Logo"
                          width={120}
                          height={120}
                          className="img-fluid logo-meo"
                        />
                      </h2>
                    )}
                    <h2 className={ANIMATIONS.fadeInDown}>
                      <span>{slide.title}</span> {slide.subtitle}
                    </h2>
                    <p
                      className={ANIMATIONS.fadeInUp}
                      style={{ fontSize: "larger" }}
                    >
                      {slide.description}
                    </p>
                    <div>
                      <a
                        href={CTA_BUTTONS.services.href}
                        className={`btn-menu ${ANIMATIONS.fadeInUp} scrollto`}
                      >
                        {CTA_BUTTONS.services.label}
                      </a>
                      <a
                        href={CTA_BUTTONS.contact.href}
                        className={`btn-book ${ANIMATIONS.fadeInUp} scrollto`}
                      >
                        {CTA_BUTTONS.contact.label}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <a
            className="carousel-control-prev"
            href="#heroCarousel"
            role="button"
            onClick={(e) => {
              e.preventDefault();
              goPrev();
            }}
          >
            <span
              className="carousel-control-prev-icon bi bi-chevron-left"
              aria-hidden="true"
            ></span>
          </a>

          <a
            className="carousel-control-next"
            href="#heroCarousel"
            role="button"
            onClick={(e) => {
              e.preventDefault();
              goNext();
            }}
          >
            <span
              className="carousel-control-next-icon bi bi-chevron-right"
              aria-hidden="true"
            ></span>
          </a>
        </div>
      </div>
    </section>
  );
}
