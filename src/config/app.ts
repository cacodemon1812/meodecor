/**
 * Application Configuration
 * Centralized settings for easy maintenance
 */

export const CONFIG = {
  // Animation timings
  animations: {
    fast: 300,
    normal: 500,
    slow: 800,
  },

  // Scroll behavior
  scroll: {
    smoothDuration: 1000,
    offset: 80, // navbar height
    intersectionThreshold: 0.1,
    intersectionMargin: "0px 0px -50px 0px",
  },

  // Performance
  performance: {
    lazyLoadImages: true,
    prefetchLinks: true,
    reduceMotion: true,
    debounceDelay: 250,
    throttleDelay: 100,
  },

  // API endpoints
  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") ||
      "http://localhost:5001",
    timeout: 10000,
  },

  // Social media
  socialMedia: {
    facebook: "https://facebook.com/meodecor",
    instagram: "https://instagram.com/meodecor",
    phone: "+84 XXX XXX XXX",
    email: "contact@meodecor.com",
  },

  // Image optimization
  images: {
    quality: 85,
    sizes: {
      thumbnail: 300,
      small: 600,
      medium: 1200,
      large: 1920,
    },
  },

  // Feature flags
  features: {
    enableGallery: true,
    enableBooking: true,
    enableContactForm: true,
    enableComments: false,
  },
};

// Environment-specific config override
if (process.env.NODE_ENV === "production") {
  // Production-specific settings
}
