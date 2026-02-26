# 📋 Hướng Dẫn Sử Dụng Dữ Liệu & Hiệu Ứng

## 📂 Cấu Trúc Tệp Mới

```
src/
├── data/
│   └── constants.ts         # Tất cả dữ liệu (text, links, navigation)
├── config/
│   └── app.ts              # Cấu hình ứng dụng
├── utils/
│   └── animations.ts       # Utilities animation & performance
├── hooks/
│   └── useAnimations.ts    # Custom React hooks
└── app/
    └── animations.css      # CSS tối ưu cho animations
```

## 🎯 Cách Chỉnh Sửa Dữ Liệu

### 1. Chỉnh Sửa Navigation Links

**File:** `src/data/constants.ts`

```typescript
export const NAV_LINKS = [
  { label: "Trang Chủ", href: "#hero", id: "home" },
  { label: "Mẫu cho bé trai", href: "#maubegai", id: "boy" },
  // ... Thêm hoặc chỉnh sửa tại đây
];
```

### 2. Chỉnh Sửa Hero Slides

**File:** `src/data/constants.ts`

```typescript
export const HERO_SLIDES = [
  {
    id: 1,
    image: "/assets/img/slidemeo/slide-1.jpg",
    title: "Meo Decor",
    subtitle: "Chuyên Nghiệp",
    description: "Mô tả slide 1...",
  },
  // ... Thêm slides khác
];
```

### 3. Chỉnh Sửa CTA Buttons

**File:** `src/data/constants.ts`

```typescript
export const CTA_BUTTONS = {
  services: { label: "Dịch vụ", href: "#menu" },
  contact: { label: "Liên hệ", href: "#book-a-table" },
  booking: { label: "Đặt hàng", href: "#BaoGiaDichVu" },
};
```

### 4. Chỉnh Sửa Cấu Hình Ứng Dụng

**File:** `src/config/app.ts`

```typescript
export const CONFIG = {
  animations: {
    fast: 300, // Tốc độ animation nhanh
    normal: 500, // Tốc độ animation bình thường
    slow: 800, // Tốc độ animation chậm
  },
  // ... Các cấu hình khác
};
```

## 🎨 Các Hiệu Ứng Sẵn Có

### Animation Classes

```typescript
import { ANIMATIONS } from "@/data/constants";

// Sử dụng trong JSX
<h2 className={ANIMATIONS.fadeInDown}>Tiêu đề</h2>
<p className={ANIMATIONS.fadeInUp}>Mô tả</p>
```

**Các animation có sẵn:**

- `fadeInDown` - Fade in từ trên xuống
- `fadeInUp` - Fade in từ dưới lên
- `fadeIn` - Fade in bình thường
- `slideInLeft` - Slide từ trái sang
- `slideInRight` - Slide từ phải sang
- `zoomIn` - Zoom vào
- `pulse` - Nhấp nháy

## 🚀 Optimization Tips

### 1. Lazy Load Hình Ảnh

```typescript
import { useLazyLoadImages } from "@/hooks/useAnimations";

export default function Gallery() {
  useLazyLoadImages();
  // Component code...
}
```

### 2. Scroll Animation

```typescript
import { useScrollAnimation } from "@/hooks/useAnimations";

export default function Section() {
  useScrollAnimation(".fade-in"); // Tự động fade-in elements
  // Component code...
}
```

### 3. Smooth Scroll

```typescript
import { smoothScroll } from "@/utils/animations";

const handleClick = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) smoothScroll(element);
};
```

## ⚙️ Performance Best Practices

1. ✅ **Giảm Motion** - Tự động phát hiện `prefers-reduced-motion`
2. ✅ **GPU Acceleration** - Sử dụng `will-change` và `transform`
3. ✅ **Debouncing** - Tối ưu resize/scroll events
4. ✅ **Lazy Loading** - Tải ảnh khi cần
5. ✅ **Code Splitting** - Tách dữ liệu ra file riêng

## 📝 Thêm Component Mới

### 1. Tạo dữ liệu trong `constants.ts`

```typescript
export const NEW_SECTION_DATA = {
  title: "Tiêu đề",
  items: [
    { id: 1, label: "Item 1" },
    { id: 2, label: "Item 2" },
  ],
};
```

### 2. Import và sử dụng trong component

```typescript
import { NEW_SECTION_DATA } from "@/data/constants";

export default function NewSection() {
  return (
    <section>
      <h2>{NEW_SECTION_DATA.title}</h2>
      {NEW_SECTION_DATA.items.map(item => (
        <div key={item.id}>{item.label}</div>
      ))}
    </section>
  );
}
```

## 🔧 Modify CSS Animations

**File:** `src/app/animations.css`

```css
/* Customize timing */
:root {
  --animation-duration-fast: 300ms; /* Chỉnh tốc độ */
  --animation-duration-normal: 500ms;
  --animation-duration-slow: 800ms;
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 📱 Responsive Design

Hệ thống animation tự động tối ưu cho thiết bị di động:

- Giảm số lượng animation trên mobile
- Tối ưu performance trên CPU yếu
- Hỗ trợ `prefers-reduced-motion`

---

**Lưu ý:** Mỗi thay đổi dữ liệu trong `constants.ts` sẽ tự động cập nhật toàn bộ ứng dụng!
