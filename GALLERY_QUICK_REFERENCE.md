# 🎨 Gallery Enhancement - Quick Reference Guide

## 📍 File Locations

| File           | Location                         | Purpose                |
| -------------- | -------------------------------- | ---------------------- |
| Main Component | `src/components/GalleryGrid.tsx` | Gallery UI & logic     |
| Styles         | `src/styles/gallery.css`         | Professional styling   |
| Utilities      | `src/utils/gallery.ts`           | Helper functions       |
| Custom Hooks   | `src/hooks/useGallery.ts`        | React hooks            |
| Config         | `src/config/gallery-config.ts`   | Customization template |
| Documentation  | `GALLERY_DOCUMENTATION.md`       | Full docs              |
| Changelog      | `GALLERY_CHANGELOG.md`           | Version history        |

## 🎯 Key Features (Checklist)

- ✅ Responsive grid (1-4 columns)
- ✅ Category filtering
- ✅ Image lazy loading
- ✅ Skeleton loaders
- ✅ Smooth animations
- ✅ Hover effects
- ✅ Professional styling
- ✅ Accessibility support
- ✅ Image optimization
- ✅ Performance tracking

## 📊 Component Structure

```
GalleryGrid
├── Section Title + Description
├── Filter Buttons
│   ├── All
│   ├── Boys
│   ├── Girls
│   └── Premium
├── Gallery Grid
│   ├── Gallery Cards (mapped)
│   │   ├── Image Container
│   │   │   ├── Loading Skeleton
│   │   │   ├── Optimized Image
│   │   │   ├── Gradient Overlay
│   │   │   └── Content Overlay
│   │   ├── Category Badge
│   │   └── Decorative Corner
│   └── CTA Button
└── Animations CSS
```

## 🎨 Colors Quick Reference

```css
/* Primary */
Primary Pink: #FF6B9D
Dark Pink: #E94B7F
Light Pink: #FFB3D9

/* Accent */
Gold: #D4AF37
Purple: #6B5CE7
Light Purple: #9B8FD9

/* Neutral */
White: #FFFFFF
Gray 50: #F5F5F7
Gray 700: #424245
Dark: #1D1D1F
```

## ⚡ Animation Timings

| Animation  | Duration | Delay          |
| ---------- | -------- | -------------- |
| Fade-In    | 600ms    | 100ms per item |
| Hover Zoom | 500ms    | Instant        |
| Overlay    | 300ms    | On hover       |
| Filter     | 400ms    | On click       |
| Skeleton   | 1500ms   | Repeat         |

## 📱 Responsive Layout

| Device     | Breakpoint  | Columns | Card Height |
| ---------- | ----------- | ------- | ----------- |
| Mobile     | < 640px     | 1       | 256px       |
| Tablet     | 640-1024px  | 2       | 280px       |
| Desktop    | 1024-1920px | 4       | 320px       |
| Ultra-Wide | > 1920px    | 4-5     | 350px       |

## 🔧 Common Customizations

### Change Primary Color

```typescript
// In GalleryGrid.tsx
<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#YourColor] to-[#D4AF37]">
  MeonDecor
</span>
```

### Add More Items

```typescript
// In GalleryGrid.tsx, add to galleryItems array
{
  id: "new-id",
  src: "/assets/img/path/image.jpg",
  category: "boys",
  alt: "Description",
  title: "Title",
  theme: "Theme",
}
```

### Change Grid Columns

```typescript
// In GalleryGrid.tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* grid-cols-3 = 3 columns instead of 4 */}
```

### Adjust Animation Speed

```css
/* In gallery.css */
.fade-in {
  animation: fadeInUp 0.8s ease-out forwards; /* Change 0.6s */
}
```

## 🎬 Animation Classes

| Class                      | Effect              | Duration |
| -------------------------- | ------------------- | -------- |
| `.fade-in`                 | Fade in from bottom | 600ms    |
| `.group-hover:scale-110`   | Image zoom on hover | 500ms    |
| `.group-hover:opacity-100` | Overlay appears     | 300ms    |
| `.animate-pulse`           | Skeleton loading    | 1500ms   |

## 🔍 Image Optimization

```typescript
// Auto-optimized by Next.js Image component
<Image
  src={item.src}
  alt={item.alt}
  fill
  quality={75}                    // Image quality
  priority={idx < 4}              // Prioritize first 4
  onLoad={() => handleImageLoad()} // Track load state
/>
```

## 🎯 State Management

```typescript
// Component State
const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all"); // Active filter
const [filteredItems, setFilteredItems] = useState<GalleryItem[]>(galleryItems); // Filtered data
const [loadedImages, setLoadedImages] = // Image load tracking
  useState<Set<string>>(new Set());
```

## 🔌 Custom Hooks Usage

### useGalleryIntersection

```typescript
const { ref, isVisible } = useGalleryIntersection();
return <div ref={ref} className={isVisible ? "visible" : ""} />;
```

### useImageLoad

```typescript
const { isLoading, isError } = useImageLoad(imageSrc);
```

### usePrefersReducedMotion

```typescript
const prefersReducedMotion = usePrefersReducedMotion();
```

## 📊 Performance Metrics

- **Image Load**: ~50ms (optimized)
- **Filter Transition**: ~400ms
- **First Paint**: < 2s
- **Lighthouse Score**: 90+ (target)

## ♿ Accessibility Features

✅ Semantic HTML structure  
✅ ARIA labels and roles  
✅ Keyboard navigation (Tab support)  
✅ Focus visible indicators  
✅ Color contrast ≥ 4.5:1  
✅ Respects `prefers-reduced-motion`  
✅ Screen reader friendly alt text

## 🐛 Debugging Tips

```javascript
// Check if lazy loading works
const images = document.querySelectorAll("[data-lazy]");
console.log("Lazy images:", images.length);

// Monitor image load events
const img = document.querySelector(".gallery-item img");
img?.addEventListener("load", () => console.log("Loaded!"));

// Check animation performance
performance.mark("gallery-animation-start");
// ... code ...
performance.mark("gallery-animation-end");
performance.measure("animation", "start", "end");
```

## 📦 Dependencies

```json
{
  "next": "^Latest",
  "react": "^18.0",
  "tailwindcss": "^3.0"
}
```

No additional libraries required!

## 🚀 Production Checklist

- [ ] All image paths verified
- [ ] Images optimized (< 1MB each)
- [ ] Lighthouse audit passed (90+)
- [ ] Tested on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Console errors resolved
- [ ] Performance monitored
- [ ] Analytics integrated
- [ ] Fallback content ready

## 🔗 Import Statements

```typescript
// Main component
import GalleryGrid from "@/components/GalleryGrid";

// Utilities
import {
  getGridColsClass,
  getCategoryDescription,
  GALLERY_CATEGORIES,
} from "@/utils/gallery";

// Custom hooks
import {
  useGalleryIntersection,
  useImageLoad,
  usePrefersReducedMotion,
} from "@/hooks/useGallery";

// Styles (auto-imported in globals.css)
// @import "../styles/gallery.css";
```

## 📈 Growth Path

1. **Phase 1** (Current): Basic gallery with filtering
2. **Phase 2**: Add lightbox modal
3. **Phase 3**: Implement favorites
4. **Phase 4**: Backend integration for dynamic images
5. **Phase 5**: Analytics and recommendations

## 🎓 Learning Resources

**In This Project:**

- React hooks patterns
- CSS animations & transitions
- Image optimization
- TypeScript interfaces
- Responsive design
- Accessibility (a11y)

## 💾 Quick Save/Restore

**Backup before customizing:**

```bash
# Backup original
cp src/components/GalleryGrid.tsx src/components/GalleryGrid.backup.tsx

# Restore if needed
cp src/components/GalleryGrid.backup.tsx src/components/GalleryGrid.tsx
```

## 🎯 Next Session Tips

1. Check `GALLERY_DOCUMENTATION.md` for full reference
2. Use `gallery-config.ts` for bulk customizations
3. Test locally before deploying
4. Monitor performance in DevTools
5. Keep analytics enabled

## 📞 Quick Troubleshooting

| Problem              | Solution                              |
| -------------------- | ------------------------------------- |
| Images not showing   | Check `/public` folder paths          |
| Animations slow      | Reduce items or disable some effects  |
| Filter not working   | Verify category value matches exactly |
| Mobile layout broken | Check responsive breakpoints          |
| Accessibility issues | Test with keyboard & screen reader    |

---

**Keep This Guide Handy!** 🎨✨
