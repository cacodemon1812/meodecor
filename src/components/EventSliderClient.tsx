"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = { images: string[] };

export default function EventSliderClient({ images }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!paused) {
      timer.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % images.length);
      }, 3500);
    }
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [images.length, paused]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") return prev();
    if (e.key === "ArrowRight") return next();
    if (e.key === " ") return setPaused((p) => !p);
    if (e.key === "Home") return setIndex(0);
    if (e.key === "End") return setIndex(images.length - 1);
  };

  return (
    <div
      className="event-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      tabIndex={0}
      role="region"
      aria-label={`Image gallery with ${images.length} items`}
      onKeyDown={onKey}
    >
      <div className="slides">
        {images.map((src, i) => (
          <div key={i} className={`slide ${i === index ? "active" : ""}`}>
            <div style={{ position: "relative", width: "100%", height: 420 }}>
              <Image
                src={src}
                alt={`Slide ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                style={{ objectFit: "cover" }}
                priority={i === 0}
              />
            </div>
            <div className="slide-caption">
              {i + 1} / {images.length}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="slide-btn prev"
        onClick={prev}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        className="slide-btn next"
        onClick={next}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="thumbnails">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            className={`thumb ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-pressed={i === index}
          >
            <div style={{ position: "relative", width: 80, height: 60 }}>
              <Image
                src={src}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="80px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
