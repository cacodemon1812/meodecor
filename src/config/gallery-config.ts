/**
 * Gallery Configuration Template
 * Copy this file and customize as needed for your specific implementation
 *
 * Example use case: Creating a new themed gallery variant
 */

// ============================================
// CATEGORY CONFIGURATION
// ============================================

export const CUSTOM_CATEGORIES = [
  {
    label: "Tất Cả Mẫu",
    value: "all",
    icon: "🎨",
    color: "#FF6B9D",
  },
  {
    label: "Sinh Nhật Bé Trai",
    value: "boys",
    icon: "👦",
    color: "#3498DB",
  },
  {
    label: "Sinh Nhật Bé Gái",
    value: "girls",
    icon: "👧",
    color: "#FF69B4",
  },
  {
    label: "Tiệc Sang Trọng",
    value: "premium",
    icon: "✨",
    color: "#D4AF37",
  },
  {
    label: "Sự Kiện Chuyên Biệt",
    value: "events",
    icon: "🎉",
    color: "#9B59B6",
  },
];

// ============================================
// ANIMATION CONFIGURATION
// ============================================

export const ANIMATION_CONFIG = {
  // Fade-in animation timing
  fadeIn: {
    duration: 600, // milliseconds
    easing: "ease-out",
    delay: 100, // stagger delay per item
  },

  // Hover effects timing
  hover: {
    imageDuration: 500, // image zoom duration
    overlayDuration: 300, // overlay fade duration
    contentDuration: 300, // content slide duration
  },

  // Filter transition timing
  filter: {
    duration: 400,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Skeleton loading animation
  skeleton: {
    duration: 1500,
    easing: "ease-in-out",
  },
};

// ============================================
// RESPONSIVE BREAKPOINTS
// ============================================

export const RESPONSIVE_CONFIG = {
  mobile: {
    breakpoint: 640,
    columns: 1,
    cardHeight: 256,
    gap: 12,
  },
  tablet: {
    breakpoint: 1024,
    columns: 2,
    cardHeight: 280,
    gap: 16,
  },
  desktop: {
    breakpoint: 1920,
    columns: 4,
    cardHeight: 320,
    gap: 24,
  },
  ultraWide: {
    breakpoint: Infinity,
    columns: 5,
    cardHeight: 350,
    gap: 24,
  },
};

// ============================================
// IMAGE OPTIMIZATION SETTINGS
// ============================================

export const IMAGE_CONFIG = {
  // Quality settings per context
  quality: {
    skeleton: 30, // While loading
    mobile: 60, // Mobile devices
    tablet: 75, // Tablet devices
    desktop: 85, // Desktop
    hero: 95, // Critical images
  },

  // Lazy loading configuration
  lazyLoad: {
    enabled: true,
    threshold: 0.1, // Load when 10% visible
    rootMargin: "50px", // Start loading 50px before visible
  },

  // Priority loading
  priorityCount: 4, // Number of images to load first
  preloadEarly: true,

  // Image formats
  formats: ["image/webp", "image/jpeg"],
  fallbackFormat: "image/jpeg",
};

// ============================================
// COLOR PALETTE
// ============================================

export const COLOR_PALETTE = {
  // Primary Colors
  primary: {
    main: "#FF6B9D",
    light: "#FFB3D9",
    lighter: "#FFE0F0",
    dark: "#E94B7F",
  },

  // Secondary Colors
  secondary: {
    main: "#6B5CE7",
    light: "#9B8FD9",
    lighter: "#E8E5F5",
  },

  // Accent Colors
  accent: {
    gold: "#D4AF37",
    blue: "#3498DB",
    purple: "#9B59B6",
    teal: "#1ABC9C",
  },

  // Neutral Colors
  neutral: {
    white: "#FFFFFF",
    offWhite: "#F9F9FB",
    gray50: "#F5F5F7",
    gray100: "#E8E8EC",
    gray300: "#D1D1D6",
    gray500: "#86868B",
    gray700: "#424245",
    dark: "#1D1D1F",
    black: "#000000",
  },

  // Status Colors
  status: {
    success: "#27AE60",
    warning: "#F39C12",
    error: "#E74C3C",
    info: "#3498DB",
  },
};

// ============================================
// GALLERY ITEMS TEMPLATE
// ============================================

export const GALLERY_ITEMS_TEMPLATE = [
  {
    id: "template-1",
    src: "/assets/img/category/1.jpg",
    category: "boys",
    alt: "Descriptive text for accessibility",
    title: "Display Title",
    theme: "Theme Name",
    metadata: {
      photographer: "Photographer Name",
      date: "2026-02-01",
      location: "Event Location",
    },
  },
];

// ============================================
// GRADIENT CONFIGURATIONS
// ============================================

export const GRADIENT_CONFIGS = {
  // Button gradients
  buttonPrimary: "from-[#FF6B9D] to-[#E94B7F]",
  buttonSecondary: "from-[#6B5CE7] to-[#9B8FD9]",
  buttonGold: "from-[#D4AF37] to-[#F4E4C1]",

  // Background gradients
  backgroundLight: "from-gray-50 to-white",
  backgroundDark: "from-gray-900 to-gray-800",
  backgroundOverlay: "from-black/60 via-transparent to-transparent",

  // Accent gradients
  accentWarm: "from-[#FF6B9D] to-[#D4AF37]",
  accentCool: "from-[#6B5CE7] to-[#3498DB]",
};

// ============================================
// SHADOW CONFIGURATIONS
// ============================================

export const SHADOW_CONFIG = {
  // Card shadows
  card: {
    default: "0 4px 12px rgba(0, 0, 0, 0.08)",
    hover: "0 12px 24px rgba(0, 0, 0, 0.15)",
    active: "0 8px 16px rgba(0, 0, 0, 0.12)",
  },

  // Text shadows
  text: {
    primary: "2px 2px 4px rgba(0, 0, 0, 0.1)",
    dark: "2px 2px 8px rgba(0, 0, 0, 0.3)",
  },

  // Glow effects
  glow: {
    pink: "0 0 20px rgba(255, 107, 157, 0.3)",
    gold: "0 0 20px rgba(212, 175, 55, 0.3)",
    purple: "0 0 20px rgba(107, 92, 231, 0.3)",
  },
};

// ============================================
// FILTER BUTTON CONFIGURATION
// ============================================

export const FILTER_BUTTON_CONFIG = {
  baseStyle:
    "px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105",

  activeStyle:
    "bg-gradient-to-r from-[#FF6B9D] to-[#E94B7F] text-white shadow-lg shadow-pink-300",

  inactiveStyle:
    "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#FF6B9D] hover:text-[#FF6B9D]",

  accessibility: {
    focusStyle: "focus-visible:outline-2 focus-visible:outline-offset-2",
    focusColor: "focus-visible:outline-[#FF6B9D]",
  },
};

// ============================================
// CARD CONFIGURATION
// ============================================

export const CARD_CONFIG = {
  borders: {
    radius: "12px",
    hoverRadius: "16px",
  },

  effects: {
    scaleOnHover: 1.1,
    rotateOnHover: 1, // degrees
    overlayOpacity: 0.6,
  },

  transitions: {
    default: "transition-all duration-500 ease-out",
    fast: "transition-all duration-300 ease-out",
  },
};

// ============================================
// ACCESSIBILITY CONFIGURATION
// ============================================

export const ACCESSIBILITY_CONFIG = {
  // Minimum contrast ratios
  contrastRatio: 4.5, // WCAG AA

  // Motion preferences
  respectReducedMotion: true,

  // Focus management
  focusVisible: true,
  focusOutlineColor: "#FF6B9D",
  focusOutlineWidth: 3,

  // ARIA labels
  ariaLabels: {
    filterButton: "Filter gallery by category",
    galleryImage: "Gallery image",
    loadingIndicator: "Loading image",
  },

  // Keyboard navigation
  keyboardSupport: true,
  tabIndex: 0,
};

// ============================================
// PERFORMANCE CONFIGURATION
// ============================================

export const PERFORMANCE_CONFIG = {
  // Image loading strategy
  imageStrategy: "lazy", // 'eager' | 'lazy'

  // Intersection Observer configuration
  observer: {
    threshold: [0.1, 0.25, 0.5],
    rootMargin: "50px 0px",
  },

  // Debounce/Throttle timings
  debounceDelay: 150, // milliseconds
  throttleDelay: 100, // milliseconds

  // Memory optimization
  cacheImages: true,
  maxCacheSize: 50, // max items in cache

  // Rendering optimization
  useMemo: true,
  useCallback: true,
};

// ============================================
// SEO CONFIGURATION
// ============================================

export const SEO_CONFIG = {
  galleryTitle: "Các Mẫu Trang Trí Sự Kiện | MeoDecor",
  galleryDescription:
    "Khám phá bộ sưu tập chuyên nghiệp của các mẫu trang trí sự kiện cho bé yêu với 500+ thiết kế độc đáo",

  structuredData: {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "MeoDecor Gallery",
    description: "Professional event decoration gallery",
    url: "https://meodecor.com/gallery",
  },
};

// ============================================
// ANALYTICS CONFIGURATION
// ============================================

export const ANALYTICS_CONFIG = {
  enableTracking: true,

  trackingEvents: {
    categoryFilter: "gallery_category_filter",
    imageView: "gallery_image_view",
    imageClick: "gallery_image_click",
    hoverDuration: "gallery_hover_time",
  },

  customProperties: {
    category: "string",
    imageId: "string",
    hoverDuration: "number",
  },
};

// ============================================
// EXPORT COMBINED CONFIG
// ============================================

export const GALLERY_CONFIG = {
  categories: CUSTOM_CATEGORIES,
  animations: ANIMATION_CONFIG,
  responsive: RESPONSIVE_CONFIG,
  images: IMAGE_CONFIG,
  colors: COLOR_PALETTE,
  gradients: GRADIENT_CONFIGS,
  shadows: SHADOW_CONFIG,
  filterButtons: FILTER_BUTTON_CONFIG,
  cards: CARD_CONFIG,
  accessibility: ACCESSIBILITY_CONFIG,
  performance: PERFORMANCE_CONFIG,
  seo: SEO_CONFIG,
  analytics: ANALYTICS_CONFIG,
};

export default GALLERY_CONFIG;

// ============================================
// USAGE EXAMPLE
// ============================================

/**
 * To use this configuration in your component:
 *
 * import { GALLERY_CONFIG } from '@/config/gallery-config';
 *
 * // Access specific config
 * const categories = GALLERY_CONFIG.categories;
 * const animationDuration = GALLERY_CONFIG.animations.fadeIn.duration;
 *
 * // Use in component
 * <div className={`${GALLERY_CONFIG.cards.transitions.default}`}>
 *   {content}
 * </div>
 */
