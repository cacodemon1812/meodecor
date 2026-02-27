"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface GalleryItem {
  id: string;
  src: string;
  category: "boys" | "girls" | "premium" | "events";
  alt: string;
  title: string;
  theme?: string;
}

const galleryItems: GalleryItem[] = [
  // Boys collection
  {
    id: "b1",
    src: "/assets/img/maubegai/1.jpg",
    category: "boys",
    alt: "Mẫu trang trí cho bé trai 1",
    title: "Chủ đề Siêu Nhân",
    theme: "Siêu Nhân",
  },
  {
    id: "b2",
    src: "/assets/img/maubegai/2.jpg",
    category: "boys",
    alt: "Mẫu trang trí cho bé trai 2",
    title: "Chủ đề Khám Phá",
    theme: "Khám Phá",
  },
  {
    id: "b3",
    src: "/assets/img/maubegai/3.jpg",
    category: "boys",
    alt: "Mẫu trang trí cho bé trai 3",
    title: "Chủ đề Xe Đua",
    theme: "Xe Đua",
  },
  {
    id: "b4",
    src: "/assets/img/maubegai/4.jpg",
    category: "boys",
    alt: "Mẫu trang trí cho bé trai 4",
    title: "Chủ đề Không Gian",
    theme: "Không Gian",
  },
  // Girls collection
  {
    id: "g1",
    src: "/assets/img/maubetrai/1.jpg",
    category: "girls",
    alt: "Mẫu trang trí cho bé gái 1",
    title: "Chủ đề Nàng Tiên",
    theme: "Nàng Tiên",
  },
  {
    id: "g2",
    src: "/assets/img/maubetrai/2.jpg",
    category: "girls",
    alt: "Mẫu trang trí cho bé gái 2",
    title: "Chủ đề Công Chúa",
    theme: "Công Chúa",
  },
  {
    id: "g3",
    src: "/assets/img/maubetrai/3.jpg",
    category: "girls",
    alt: "Mẫu trang trí cho bé gái 3",
    title: "Chủ đề Hoa Bướm",
    theme: "Hoa Bướm",
  },
  {
    id: "g4",
    src: "/assets/img/maubetrai/4.jpg",
    category: "girls",
    alt: "Mẫu trang trí cho bé gái 4",
    title: "Chủ đề Cổ Tích",
    theme: "Cổ Tích",
  },
  // Premium collection
  {
    id: "p1",
    src: "/assets/img/SangSinMin/1.jpg",
    category: "premium",
    alt: "Mẫu Sang Xịn Mịn 1",
    title: "Lễ Tiệc Sang Trọng",
    theme: "Vàng Kim",
  },
  {
    id: "p2",
    src: "/assets/img/SangSinMin/2.jpg",
    category: "premium",
    alt: "Mẫu Sang Xịn Mịn 2",
    title: "Tiệc Hoàng Gia",
    theme: "Hoa Nước",
  },
];

type FilterCategory = "all" | "boys" | "girls" | "premium" | "events";

export default function GalleryGrid() {
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("all");
  const [filteredItems, setFilteredItems] =
    useState<GalleryItem[]>(galleryItems);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(
        galleryItems.filter((item) => item.category === selectedCategory),
      );
    }
  }, [selectedCategory]);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set([...prev, id]));
  };

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      boys: "Bé Trai",
      girls: "Bé Gái",
      premium: "Sang Trọng",
      events: "Sự Kiện",
    };
    return labels[category] || category;
  };

  const categories: { label: string; value: FilterCategory; icon: string }[] = [
    { label: "Tất Cả", value: "all", icon: "🎨" },
    { label: "Cho Bé Trai", value: "boys", icon: "👦" },
    { label: "Cho Bé Gái", value: "girls", icon: "👧" },
    { label: "Sang Xịn Mịn", value: "premium", icon: "👑" },
  ];

  // Prepare slides for lightbox
  const slides = filteredItems.map((item) => ({
    src: item.src,
    alt: item.alt,
    title: item.title,
  }));

  return (
    <section
      id="gallery"
      className="gallery py-20 bg-linear-to-b from-white via-gray-50 to-white overflow-hidden"
    >
      <div className="container-fluid px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Elegant Section Header */}
        <div className="section-header mb-20 text-center fade-in">
          <div className="flex justify-center mb-4">
            <div className="h-1 w-12 bg-linear-to-r from-[#FF6B9D] to-[#D4AF37] rounded-full" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 mb-4">
            Bộ Sưu Tập Mẫu Trang Trí
          </h2>
          <div className="w-full h-0.5 bg-linear-to-r from-transparent via-[#FF6B9D] to-transparent mb-6" />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Khám phá bộ sưu tập trang trí sự kiện chuyên nghiệp dengan hàng trăm
            mẫu độc đáo dành cho các sự kiện của bé yêu
          </p>
        </div>

        {/* Elegant Filter Tabs */}
        <div className="filter-tabs-wrapper mb-16 fade-in">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`
                  group relative px-6 md:px-8 py-3 md:py-3.5 rounded-full font-semibold 
                  transition-all duration-300 ease-out transform hover:scale-105 active:scale-95
                  ${
                    selectedCategory === cat.value
                      ? "bg-linear-to-r from-[#FF6B9D] to-[#E94B7F] text-white shadow-lg shadow-pink-300/50 scale-105"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#FF6B9D] hover:text-[#FF6B9D] hover:shadow-md"
                  }
                `}
                aria-selected={selectedCategory === cat.value}
              >
                <span className="mr-2 text-lg">{cat.icon}</span>
                <span className="whitespace-nowrap">{cat.label}</span>
                {selectedCategory === cat.value && (
                  <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div
          className="gallery-grid-container w-full max-w-full"
          id="gallery-container"
        >
          <div className="flex flex-wrap justify-center gap-6 md:gap-5 w-full">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className="fade-in group w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] min-w-0 flex flex-col"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="gallery-card rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer relative bg-white w-full flex-1 flex flex-col">
                  {/* Image */}
                  <button
                    type="button"
                    onClick={() => handleImageClick(idx)}
                    className="gallery-image-wrapper relative w-full overflow-hidden shrink-0 bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label={`View ${item.title}`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onLoad={() => handleImageLoad(item.id)}
                      quality={80}
                      priority={idx < 4}
                    />

                    {/* Loading Skeleton */}
                    {!loadedImages.has(item.id) && (
                      <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse z-5" />
                    )}
                  </button>

                  {/* Caption */}
                  <div className="p-4 text-center bg-white flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    {item.theme && (
                      <p className="text-xs text-gray-500 font-medium">
                        {item.theme}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="mt-24 text-center fade-in">
          <button className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#FF6B9D] to-[#E94B7F] text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-base md:text-lg shadow-lg hover:shadow-2xl hover:shadow-pink-300/50 transform hover:scale-105 active:scale-95 transition-all duration-300">
            <span>➕</span>
            Xem Thêm Mẫu Khác
          </button>
          <p className="text-gray-500 mt-6 text-sm md:text-base">
            Có hơn <span className="font-semibold text-gray-700">500+</span> mẫu
            trang trí để lựa chọn
          </p>
        </div>
      </div>

      {/* React Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />

      {/* Inline Styles for Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
