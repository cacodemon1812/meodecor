"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import { Button } from "@/components/ui/button";
import "yet-another-react-lightbox/styles.css";
import "../styles/gallery-tabs.css";

type Tab = {
  id: string;
  label: string;
  images: string[];
};

const FALLBACK_TABS: Tab[] = [
  {
    id: "maubetrai",
    label: "Mẫu bé trai",
    images: [
      "/assets/img/maubetrai/1.jpg",
      "/assets/img/maubetrai/2.jpg",
      "/assets/img/maubetrai/3.jpg",
    ],
  },
  {
    id: "MauBeGai",
    label: "Mẫu bé gái",
    images: [
      "/assets/img/MauBeGai/1.jpg",
      "/assets/img/MauBeGai/2.jpg",
      "/assets/img/MauBeGai/3.jpg",
    ],
  },
  {
    id: "mausangsinmin",
    label: "Mẫu sang sịn mịn",
    images: [
      "/assets/img/SangSinMin/1.jpg",
      "/assets/img/SangSinMin/2.jpg",
      "/assets/img/SangSinMin/3.jpg",
    ],
  },
];

async function fetchGalleryTabsFromApi(): Promise<Tab[]> {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/gallery/tabs`, {
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error(`Cannot load gallery tabs: ${response.status}`);
    return (await response.json()) as Tab[];
  } catch (error) {
    console.warn(
      "Failed to load gallery tabs from API, using fallback:",
      error,
    );
    return FALLBACK_TABS;
  }
}

export default function GalleryTabsClient({
  tabs: initialTabs,
}: {
  tabs?: Tab[];
} = {}) {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs || []);
  const [active, setActive] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(-1);
  const [isLoading, setIsLoading] = useState(!initialTabs);
  const [displayCount, setDisplayCount] = useState(12);

  const ITEMS_PER_LOAD = 12; // 3 rows × 4 columns (typical desktop layout)

  // Fetch tabs from API if not provided as prop
  useEffect(() => {
    if (initialTabs) return;
    (async () => {
      setIsLoading(true);
      const data = await fetchGalleryTabsFromApi();
      setTabs(data);
      setIsLoading(false);
    })();
  }, [initialTabs]);

  // Auto-select tab when navigating from nav links (hash-based)
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#", "");
      const idx = tabs.findIndex((t) => t.id === hash);
      if (idx !== -1) {
        setActive(idx);
        setDisplayCount(ITEMS_PER_LOAD);
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [tabs]);

  const activeTab = tabs[active];
  const totalImages = activeTab?.images.length ?? 0;
  const visibleCount = Math.min(displayCount, totalImages);
  const remainingCount = Math.max(totalImages - visibleCount, 0);
  const canLoadMore = remainingCount > 0;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + ITEMS_PER_LOAD, totalImages));
  };

  const slides = activeTab
    ? activeTab.images.map((src, i) => ({
        src,
        alt: `${activeTab.label} ${i + 1}`,
      }))
    : [];

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
          <p>
            Trang trí sự kiện cho bé yêu — sáng tạo, chuyên nghiệp, đáng yêu
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Đang tải bộ sưu tập...</p>
          </div>
        ) : tabs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chưa có bộ sưu tập nào</p>
          </div>
        ) : (
          <>
            {/* Tab buttons */}
            <div className="gallery-tabs" role="tablist">
              {tabs.map((tab, i) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className={`gallery-tab-btn ${i === active ? "active" : ""}`}
                  onClick={() => {
                    setActive(i);
                    setDisplayCount(ITEMS_PER_LOAD);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Image grid — key forces re-mount animation on tab switch */}
            {activeTab && (
              <>
                <div key={active} className="gallery-grid" role="tabpanel">
                  {activeTab.images
                    .slice(0, visibleCount)
                    .map((src, displayIdx) => {
                      const actualIdx = displayIdx; // Index in sliced array matches actual position when slides[i] is clicked
                      const isExternalUrl = /^https?:\/\//.test(src);
                      return (
                        <a
                          key={`${activeTab.id}-${displayIdx}`}
                          href={src}
                          className="gallery-item"
                          aria-label={`Xem ảnh ${activeTab.label} ${displayIdx + 1}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setLightboxIdx(actualIdx);
                          }}
                        >
                          <Image
                            src={src}
                            alt={`${activeTab.label} ${displayIdx + 1}`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="gallery-img"
                            priority={displayIdx < 4}
                            unoptimized={isExternalUrl}
                          />
                          <div className="gallery-img-overlay">
                            <span className="gallery-img-icon">⤢</span>
                          </div>
                        </a>
                      );
                    })}
                </div>

                {/* Load More Button */}
                {canLoadMore && (
                  <div className="mt-10 mb-6 flex justify-center">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleLoadMore}
                      className="group relative h-8 min-w-[180px] overflow-hidden rounded-full px-4 text-xs font-semibold tracking-[0.01em] text-white transition-all duration-500 ease-out hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 active:scale-[0.99]"
                      style={{
                        background:
                          "linear-gradient(135deg, #ffb03b 0%, #ff7a18 45%, #ff5f00 100%)",
                        border: "1px solid rgba(255,199,120,0.35)",
                        boxShadow:
                          "0 6px 16px rgba(255,115,0,0.32), 0 1px 4px rgba(0,0,0,0.28)",
                      }}
                    >
                      Xem thêm {Math.min(ITEMS_PER_LOAD, remainingCount)} mẫu
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
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
