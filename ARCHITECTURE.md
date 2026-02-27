# 📐 Gallery Architecture Overview

## Component Hierarchy

```
GalleryGrid (Main Component)
│
├── Section Header
│   ├── Title with Gradient
│   └── Description
│
├── Filter Controls
│   ├── Category Button (All)
│   ├── Category Button (Boys)
│   ├── Category Button (Girls)
│   └── Category Button (Premium)
│
├── Gallery Grid (Responsive)
│   │
│   ├── Gallery Card #1
│   │   ├── Image Container
│   │   │   ├── Loading Skeleton
│   │   │   ├── Optimized Image (Next.js)
│   │   │   ├── Gradient Overlay
│   │   │   └── Content Overlay
│   │   ├── Category Badge
│   │   └── Decorative Corner
│   │
│   ├── Gallery Card #2
│   │   └── [Same structure as #1]
│   │
│   └── Gallery Card #N
│       └── [Same structure as #1]
│
└── CTA Section
    ├── Action Button
    └── Supporting Text
```

---

## Data Flow

```
User Interaction
    │
    ├─→ Click Filter Button
    │   └─→ setSelectedCategory()
    │       └─→ useEffect triggers
    │           └─→ filterGalleryItems()
    │               └─→ setFilteredItems()
    │                   └─→ Component re-renders
    │
    └─→ Image Loads
        └─→ onLoad event fires
            └─→ handleImageLoad()
                └─→ setLoadedImages()
                    └─→ Remove skeleton loader
                        └─→ Show loaded image
```

---

## State Management

```
GalleryGrid Component State:
├── selectedCategory: FilterCategory
│   └── Controls which items display
│
├── filteredItems: GalleryItem[]
│   └── Computed from selectedCategory
│
└── loadedImages: Set<string>
    └── Tracks individual image load states
```

---

## File Dependencies

```
pages/
└── [Gallery used in layout]

src/
├── components/
│   └── GalleryGrid.tsx
│       ├── Imports: gallery-config.ts
│       ├── Imports: React hooks
│       ├── Imports: Next.js Image
│       └── Uses: globals.css (gallery.css)
│
├── styles/
│   ├── gallery.css
│   │   └── Professional animations & layout
│   │
│   └── tokens.ts
│       └── Design system tokens
│
├── utils/
│   └── gallery.ts
│       ├── Image optimization helpers
│       ├── Category management
│       ├── Gradient constants
│       └── Configuration exports
│
├── hooks/
│   └── useGallery.ts
│       ├── useGalleryIntersection()
│       ├── useImageLoad()
│       ├── useLazyImages()
│       ├── useGalleryAnimation()
│       ├── useFilterAnimation()
│       ├── useResize()
│       └── usePrefersReducedMotion()
│
└── config/
    └── gallery-config.ts
        ├── Category definitions
        ├── Animation timings
        ├── Responsive breakpoints
        ├── Color palette
        ├── Gradient configs
        └── Accessibility settings
```

---

## CSS Architecture

```
gallery.css
├── Gallery Section Styling
│   ├── Base styles
│   └── Background decorations
│
├── Animation Keyframes
│   ├── fadeInUp
│   ├── floatDecor
│   ├── badgeBounce
│   ├── cardSlideUp
│   └── skeletonLoading
│
├── Component Styles
│   ├── .gallery-item
│   ├── .gallery-lightbox
│   ├── .image-container
│   └── .decor-corner
│
├── Responsive Styles
│   ├── @media (max-width: 768px)
│   └── @media (max-width: 480px)
│
├── Accessibility
│   ├── Focus states
│   ├── Reduced motion
│   └── Color contrast
│
└── Performance
    ├── will-change hints
    ├── GPU acceleration
    └── Smooth transitions
```

---

## Performance Optimization Layers

```
Layer 1: Image Optimization
├── Next.js Image component
├── Automatic format conversion
├── Responsive image sizing
└── Quality: 75% (optimized)

Layer 2: Lazy Loading
├── Intersection Observer
├── 50px before viewport trigger
├── Load only visible images
└── Priority: First 4 images

Layer 3: Rendering
├── GPU-accelerated animations
├── will-change CSS hints
├── Minimal re-renders
└── Efficient state management

Layer 4: Interaction
├── Debounced events
├── Optimized filters
├── Smooth transitions
└── Memory efficient
```

---

## Animation Pipeline

```
User Action
    │
    ├─→ Hover on Card
    │   └─→ CSS :hover state
    │       ├─→ Image scale: 0→1.1 (500ms)
    │       ├─→ Overlay fade: 0→1 (300ms)
    │       ├─→ Content slide: 16px↑ (300ms)
    │       └─→ Badge bounce: 0→scale(1) (400ms)
    │
    └─→ Load Page
        └─→ Cards appear staggered
            └─→ fadeInUp animation
                ├─→ Item 1: 0ms delay
                ├─→ Item 2: 100ms delay
                ├─→ Item 3: 200ms delay
                └─→ Item N: N*100ms delay
```

---

## Responsive Breakpoint System

```
Mobile First Approach:
┌─────────────────────────────────────────┐
│ Mobile      | Tablet    | Desktop      │
│ < 640px     | 640-1024px| > 1024px     │
├─────────────────────────────────────────┤
│ 1 column    | 2 columns | 4 columns    │
│ 256px tall  | 280px tall| 320px tall   │
│ 16px gap    | 16px gap  | 24px gap     │
│ Single col  | 2 col grid| 4 col grid   │
└─────────────────────────────────────────┘
```

---

## Accessibility Architecture

```
Semantic HTML
├── <section> wrapper
├── Proper heading hierarchy
└── Semantic tags for content

ARIA Implementation
├── aria-labels on buttons
├── role attributes
└── Live regions for status

Keyboard Navigation
├── Tab order management
├── Focus visible states
└── Enter/Space activation

Color & Contrast
├── 4.5:1 minimum ratio
├── No color-only indicators
└── Alternative text for images

Motion Respect
├── prefers-reduced-motion query
├── Optional animations
└── Graceful degradation
```

---

## Type Safety (TypeScript)

```
Interfaces:
├── GalleryItem
│   └── id, src, category, alt, title, theme
│
├── FilterCategory
│   └── "all" | "boys" | "girls" | "premium" | "events"
│
└── UseGalleryIntersectionOptions
    └── threshold, rootMargin, triggerOnce

Type-safe Exports:
├── GALLERY_CATEGORIES (const)
├── COLOR_PALETTE (const)
├── ANIMATION_TIMINGS (const)
└── GRADIENT_COLORS (const)
```

---

## Configuration Hierarchy

```
Design Tokens (src/styles/tokens.ts)
    ↓
Gallery Config (src/config/gallery-config.ts)
    ↓
Component Props & State (GalleryGrid.tsx)
    ↓
CSS Rules (src/styles/gallery.css)
    ↓
Rendered Output
```

---

## Error Handling & Fallbacks

```
Image Loading Flow:
├─→ Image not found?
│   └─→ Show placeholder/error message
│
├─→ Network slow?
│   └─→ Show skeleton loader longer
│
├─→ JavaScript disabled?
│   └─→ Fallback to basic HTML grid
│
└─→ Accessibility issues?
    └─→ ARIA labels provide fallback text
```

---

## Browser Compatibility

```
Modern Browsers (Full Support):
├── Chrome 90+
├── Edge 90+
├── Firefox 88+
└── Safari 14+

Fallbacks:
├── CSS Grid support
├── Flex layout fallback
├── Image element support
└── Intersection Observer polyfill ready
```

---

## Development Workflow

```
1. Component Logic (React)
   └── State management, event handling

2. Styling (CSS)
   └── Layout, animations, responsiveness

3. Utilities (TypeScript)
   └── Helper functions, constants

4. Hooks (React)
   └── Reusable logic, side effects

5. Configuration (TypeScript)
   └── Customizable settings

6. Testing (Local)
   └── Verify all features work

7. Documentation (Markdown)
   └── Record implementation
```

---

## Performance Budget

```
Component Resources:
├── JavaScript: ~8 KB (minified)
├── CSS: ~12 KB (minified)
├── Images: Lazy loaded
└── Total: ~20 KB impact

Lighthouse Targets:
├── Performance: 90+
├── Accessibility: 95+
├── Best Practices: 95+
└── SEO: 100
```

---

## Future Extension Points

```
Easy to Add:
├── Lightbox modal overlay
├── Image carousel
├── Favorites/wishlist
├── User ratings/reviews
├── Social sharing buttons
├── Analytics tracking
└── Backend integration

Modular Design Allows:
├── Reuse in other pages
├── Extend with new features
├── Customize for variants
└── Integrate with CMS
```

---

## Summary: Technology Stack

```
Frontend:
├── React 18+ (UI framework)
├── Next.js 13+ (Image optimization)
├── TypeScript (Type safety)
└── Tailwind CSS (Utility styles)

Styling:
├── CSS Grid (Responsive layout)
├── CSS Animations (Effects)
├── CSS Variables (Theming)
└── Media Queries (Responsive)

Browser APIs:
├── Intersection Observer (Lazy load)
├── Window Events (Resize)
├── Performance API (Tracking)
└── Media Query API (Preferences)

Zero External Dependencies:
└── Everything is built-in!
```

---

## Architecture Principles

1. **Responsive-First**: Mobile layouts scale up
2. **Performance**: Optimize before features
3. **Accessibility**: Built-in, not afterthought
4. **Modularity**: Reusable components & hooks
5. **TypeScript**: Type safety throughout
6. **Semantic HTML**: Proper structure
7. **Progressive Enhancement**: Works without JS
8. **Maintainability**: Clear code & docs

---

This architecture is designed for:
✅ Scalability (easy to add more items)
✅ Customization (config-based)
✅ Performance (optimized at every level)
✅ Accessibility (WCAG AA compliant)
✅ Maintainability (well-documented)
✅ Extensibility (easy to add features)
