/**
 * Design System - Color, Typography, Spacing
 * Centralized design tokens for professional UI
 */

// ============ COLORS ============
export const COLORS = {
  // Primary palette - Elegant pastels for events
  primary: {
    main: "#FF6B9D", // Main accent
    light: "#FFB3D9", // Light variant
    lighter: "#FFE0F0", // Lightest variant
    dark: "#E94B7F", // Dark variant
  },

  // Secondary
  secondary: {
    main: "#6B5CE7", // Deep purple
    light: "#9B8FD9",
    lighter: "#E8E5F5",
  },

  // Gold/Luxury accents
  gold: {
    main: "#D4AF37", // Premium gold
    light: "#F4E4C1",
    dark: "#B8941B",
  },

  // Neutrals
  neutral: {
    white: "#FFFFFF",
    offwhite: "#F9F9FB",
    gray100: "#F5F5F7",
    gray200: "#E8E8EC",
    gray300: "#D1D1D6",
    gray500: "#86868B",
    gray700: "#424245",
    dark: "#1D1D1F",
    black: "#000000",
  },

  // Semantic
  success: "#27AE60",
  warning: "#F39C12",
  error: "#E74C3C",
  info: "#3498DB",

  // Backgrounds
  background: {
    light: "#FFFFFF",
    subtle: "#F9F9FB",
    overlay: "rgba(0, 0, 0, 0.5)",
  },
};

// ============ TYPOGRAPHY ============
export const TYPOGRAPHY = {
  fontFamily: {
    primary: "'Poppins', 'Segoe UI', sans-serif",
    secondary: "'Dancing Script', cursive",
    accent: "'Yellowtail', cursive",
  },

  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "28px",
    "4xl": "32px",
    "5xl": "36px",
    "6xl": "48px",
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

// ============ SPACING ============
export const SPACING = {
  0: "0",
  px: "1px",
  0.5: "2px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
};

// ============ SHADOWS ============
export const SHADOWS = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",

  // Premium shadows for event cards
  premium:
    "0 20px 40px rgba(255, 107, 157, 0.15), 0 10px 20px rgba(107, 92, 231, 0.1)",
  premiumHover:
    "0 30px 60px rgba(255, 107, 157, 0.25), 0 15px 30px rgba(107, 92, 231, 0.15)",
};

// ============ BORDER RADIUS ============
export const BORDER_RADIUS = {
  none: "0",
  sm: "4px",
  base: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  full: "9999px",
};

// ============ TRANSITIONS ============
export const TRANSITIONS = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  base: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  normal: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  slowest: "800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",

  ease: {
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// ============ Z-INDEX ============
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// ============ BREAKPOINTS ============
export const BREAKPOINTS = {
  xs: "0",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  "2xl": "1400px",
};
