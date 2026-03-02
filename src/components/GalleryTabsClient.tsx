"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "../styles/gallery-tabs.css";

type Tab = {
  id: string;
  label: string;
  images: string[];
};

export default function GalleryTabsClient({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(-1);

  // Auto-select tab when navigating from nav links (hash-based)
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#", "");
      const idx = tabs.findIndex((t) => t.id === hash);
      if (idx !== -1) setActive(idx);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [tabs]);

  const slides = tabs[active].images.map((src, i) => ({
    src,
    alt: `${tabs[active].label} ${i + 1}`,
  }));

  return (
    <section id="gallery" className="gallery-tabs-section">
      {/* Hidden anchors for nav-link compatibility */}
      {tabs.map((tab) => (
        <span key={tab.id} id={tab.id} className="gallery-anchor" />
      ))}

      <div className="container">
        {/* Section header */}
        <div className="section-title">
          <h2>
            Bộ Sưu Tập <span>MeoDecor</span>
          </h2>
          <p>Trang trí sự kiện cho bé yêu — sáng tạo, chuyên nghiệp, đáng yêu</p>
        </div>

        {/* Tab buttons */}
        <div className="gallery-tabs" role="tablist">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`gallery-tab-btn ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Image grid — key forces re-mount animation on tab switch */}
        <div key={active} className="gallery-grid" role="tabpanel">
          {tabs[active].images.map((src, i) => (
            <a
              key={i}
              href={src}
              className="gallery-item"
              aria-label={`Xem ảnh ${tabs[active].label} ${i + 1}`}
              onClick={(e) => {
                e.preventDefault();
                setLightboxIdx(i);
              }}
            >
              <Image
                src={src}
                alt={`${tabs[active].label} ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="gallery-img"
                priority={i < 4}
              />
              <div className="gallery-img-overlay">
                <span className="gallery-img-icon">⤢</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <Lightbox
        open={lightboxIdx >= 0}
        close={() => setLightboxIdx(-1)}
        slides={slides}
        index={lightboxIdx}
      />
    </section>
  );
}
