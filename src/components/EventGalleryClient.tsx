"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "../styles/event-page.css";

type Props = {
  images: string[];
  title: string;
};

export default function EventGalleryClient({ images, title }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState(-1);

  const slides = images.map((src, i) => ({
    src,
    alt: `${title} – Ảnh ${i + 1}`,
  }));

  return (
    <>
      <div className="event-gallery-grid">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            className="event-gallery-item"
            onClick={() => setLightboxIdx(i)}
            aria-label={`Xem ảnh ${i + 1} – ${title}`}
          >
            {/https?:\/\//i.test(src) ? (
              <img
                src={src}
                alt={`${title} – Ảnh ${i + 1}`}
                className="event-gallery-img"
                onLoad={() => {}}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Image
                src={src}
                alt={`${title} – Ảnh ${i + 1}`}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="event-gallery-img"
                priority={i < 3}
              />
            )}
            <div className="event-gallery-overlay">
              <span className="event-gallery-icon">⤢</span>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={lightboxIdx >= 0}
        close={() => setLightboxIdx(-1)}
        slides={slides}
        index={lightboxIdx}
      />
    </>
  );
}
