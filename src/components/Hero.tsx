import React from "react";
import { fetchHeroSlides, fetchCtaButtons, ANIMATIONS } from "@/data/constants";

export default async function Hero() {
  const HERO_SLIDES = await fetchHeroSlides();
  const CTA_BUTTONS = await fetchCtaButtons();

  // render using fetched data
  return (
    <section id="hero">
      <div className="hero-container">
        <div
          id="heroCarousel"
          data-bs-interval="5000"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <ol
            className="carousel-indicators"
            id="hero-carousel-indicators"
          ></ol>

          <div className="carousel-inner" role="listbox">
            {HERO_SLIDES.map((slide: any, index: number) => (
              <div
                key={slide.id}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="carousel-container">
                  <div className="carousel-content" style={{ width: "100%" }}>
                    {index === 0 && (
                      <h2 className={ANIMATIONS.fadeInDown}>
                        <img
                          src="/assets/img/logo/logo.png"
                          alt="Meo Decor Logo"
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
            data-bs-slide="prev"
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
            data-bs-slide="next"
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
