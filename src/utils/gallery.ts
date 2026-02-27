/**
 * Gallery Utilities
 * Provides image optimization, loading states, and gallery configuration
 */

/**
 * Generate responsive image sizes for Next.js Image component
 * Optimizes for different breakpoints
 */
export const generateImageSizes = () => {
  return {
    mobile: "(max-width: 640px) 100vw",
    tablet: "(max-width: 1024px) 50vw",
    desktop: "25vw",
  };
};

/**
 * Image quality settings for different scenarios
 */
export const IMAGE_QUALITY = {
  thumbnail: 40,
  preview: 60,
  full: 85,
  hero: 90,
} as const;

/**
 * Lazy loading configuration
 */
export const LAZY_LOAD_CONFIG = {
  threshold: 0.1,
  rootMargin: "50px",
} as const;

/**
 * Gallery animation timings (in milliseconds)
 */
export const ANIMATION_TIMINGS = {
  cardDelay: 100,
  fadeInDuration: 600,
  hoverDuration: 300,
  filterTransition: 400,
} as const;

/**
 * Format image URL with optimization parameters
 */
export const optimizeImageUrl = (
  url: string,
  width?: number,
  height?: number,
): string => {
  // If using Next.js Image component, this is handled automatically
  // But if needed for direct URLs, add optimization params here
  return url;
};

/**
 * Preload critical images for better performance
 */
export const preloadImages = (imageUrls: string[]): void => {
  if (typeof window === "undefined") return;

  imageUrls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Check if image is already in viewport (for lazy loading)
 */
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
};

/**
 * Debounce utility for scroll events during lazy loading
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Intersection Observer for smooth fade-in animations
 */
export const setupGalleryObserver = (selector: string = ".fade-in") => {
  if (typeof window === "undefined") return null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => observer.observe(el));

  return observer;
};

/**
 * Track image load performance metrics
 */
export const trackImageMetrics = (imageId: string, loadTime: number) => {
  if (typeof window !== "undefined" && "performance" in window) {
    console.debug(`Image ${imageId} loaded in ${loadTime}ms`);
  }
};

/**
 * Get image dimensions for aspect ratio calculation
 */
export const getImageAspectRatio = (width: number, height: number): string => {
  const gcd = (a: number, b: number) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor} / ${height / divisor}`;
};

/**
 * Category labels and configuration
 */
export const GALLERY_CATEGORIES = {
  all: {
    label: "Tất Cả",
    icon: "🎨",
    value: "all",
  },
  boys: {
    label: "Cho Bé Trai",
    icon: "👦",
    value: "boys",
  },
  girls: {
    label: "Cho Bé Gái",
    icon: "👧",
    value: "girls",
  },
  premium: {
    label: "Sang Xịn Mịn",
    icon: "👑",
    value: "premium",
  },
  events: {
    label: "Sự Kiện",
    icon: "🎉",
    value: "events",
  },
} as const;

/**
 * Get description for category
 */
export const getCategoryDescription = (category: string): string => {
  const descriptions: Record<string, string> = {
    boys: "Các mẫu trang trí sáng tạo và vui nhộn dành riêng cho các bé trai",
    girls: "Thiết kế tinh tế và nữ tính cho những buổi tiệc của các bé gái",
    premium: "Bộ sưu tập sang trọng và cao cấp cho những dịp đặc biệt",
    events: "Trang trí chuyên nghiệp cho tất cả các loại sự kiện",
  };
  return descriptions[category] || "";
};

/**
 * Generate responsive grid class based on screen size
 */
export const getGridColsClass = (): string => {
  if (typeof window === "undefined") return "grid-cols-4";

  const width = window.innerWidth;
  if (width < 640) return "grid-cols-1";
  if (width < 768) return "grid-cols-2";
  if (width < 1024) return "grid-cols-3";
  return "grid-cols-4";
};

/**
 * Accessibility helper for gallery navigation
 */
export const announceToScreenReader = (message: string) => {
  const ariaLive = document.getElementById("aria-live");
  if (ariaLive) {
    ariaLive.textContent = message;
  }
};

/**
 * Export gradient colors for consistency
 */
export const GRADIENT_COLORS = {
  primary: "from-[#FF6B9D] to-[#E94B7F]",
  accent: "from-[#FF6B9D] to-[#D4AF37]",
  gold: "from-[#D4AF37] to-[#F4E4C1]",
  purple: "from-[#6B5CE7] to-[#9B8FD9]",
} as const;
