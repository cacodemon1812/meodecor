import type {
  NavLink,
  HeroSlide,
  Package,
  EventItem,
  HeroSlideBg,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export const NAV_LINKS: NavLink[] = [
  { label: "Trang Chủ", href: "#hero", id: "home" },
  { label: "Mẫu cho bé trai", href: "#MauBeGai", id: "boy" },
  { label: "Mẫu cho bé gái", href: "#maubetrai", id: "girl" },
  { label: "Mẫu sang xịn mịn", href: "#mausangsinmin", id: "premium" },
  { label: "Liên hệ", href: "#contact", id: "contact" },
];
// Ảnh nền khu vục đầu trang
export const HERO_SLIDES_BG: HeroSlideBg[] = [
  {
    id: 1,
    image: "/assets/img/anhnen/anhbia1.png",
  },
];
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: "Meo Decor",
    subtitle: "Chuyên Nghiệp",
    description:
      'Sở hữu một đội ngũ nhân sự lâu năm trong nghề tổ chức Event, Meo Decor cam kết "Đúng Hẹn – Đúng Sản Phẩm – Đúng Chất Lượng". Với chúng tôi, mỗi khách hàng là một người thân, mỗi em bé là một Thiên Thần. Sự hài lòng là niềm tự hào của Meo Decor',
  },
  {
    id: 2,
    title: "Meo Decor",
    subtitle: "Nhiệt Tình – Sáng Tạo",
    description:
      "Nhiệt Tình – Sáng Tạo : Meo Decor luôn trân quý những ý tưởng của bạn và sẵn sàng cùng bạn hoàn thiện những ý tưởng đó để ngày sinh nhật của bé yêu là ngày tuyệt vời nhất của gia đình. Với sự đam mê và tâm huyết với nghề, Meo Decor không ngừng sáng tạo để mang lại cho bé và gia đình những trải nghiệm Mới – Đẹp – Lạ – Vui nhất!",
  },
  {
    id: 3,
    title: "Meo Decor",
    subtitle: "Tinh Tế",
    description:
      "Chúng tôi hiểu mỗi em bé là tài sản vô giá của cha mẹ, và ngày sinh nhật bé là ngày thiêng liêng nhất của gia đình. Meo Decor có mặt tại đây để chung tay cùng bạn trao cho bé một ngày thật đặc biệt và tràn ngập yêu thương.",
  },
];

export const CTA_BUTTONS = {
  services: { label: "Dịch vụ", href: "#menu" },
  contact: { label: "Liên hệ", href: "#book-a-table" },
  booking: { label: "Đặt hàng", href: "#BaoGiaDichVu" },
};

export const ABOUT_DATA = {
  title: "Về Meo Decor",
  description: "Chúng tôi chuyên cung cấp dịch vụ tổ chức sự kiện cho trẻ em",
  videoUrl: "https://www.youtube.com/embed/Bje3D4Tn3lU?si=wY-5I-bzRcq7BxQ4",
  commitments: [
    "Sử dụng khí Heli an toàn tuyệt đối.",
    "KHÔNG GÂY CHÁY NỔ.",
    "Có tem kiểm định của nhà sản xuất.",
    "Bơm đủ số lượng bóng nhỏ trong mỗi quả bóng lớn.",
    "Phục vụ tận nơi nội thành Nam Định và các tỉnh lân cận!.",
  ],
  highlight:
    "Bóng bay kích nổ Nam Định - Dịch vụ bóng kích nổ đám cưới, sự kiện tại Nam Định và các tỉnh lân cận",
};

export const CONTACT_DATA = {
  title: "Liên hệ ngay với",
  subtitle: "Meo Decor - Party & Event Baby",
  address: "68/75 Điện Biên - Cửa Bắc - Tp Nam Định",
  openingHours: "Cả tuần: 6:00 AM - 23:00 PM",
  fanpage: "https://www.facebook.com/meodecorpartyeventbaby",
  phone: "0345669006",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d786.0147882859981!2d106.16421642030677!3d20.426652417656122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjDCsDI1JzM2LjgiTiAxMDbCsDA5JzUzLjAiRQ!5e0!3m2!1svi!2s!4v1713898005528!5m2!1svi!2s",
};

export const FOOTER_DATA = {
  company: "Meo Decor",
  year: new Date().getFullYear(),
  description:
    "Trang trí sự kiện cho trẻ em — chuyên nghiệp, an toàn và sáng tạo.",
  socials: {
    twitter: "#",
    facebook: "#",
    instagram: "#",
    linkedin: "#",
  },
  locations: [
    {
      id: "loc-nd",
      name: "Cơ sở TP. Nam Định",
      address: "158 vĩnh trường - Tp Nam Định",
      phone: "+84 345 669 006",
      email: "babystorm2310@gmail.com",
    },
    {
      id: "loc-hcm",
      name: "Cơ sở TP. Phủ Lý",
      address: "26/1 ngõ 36 Trần Văn Chuông  - Tp Phủ Lý",
      phone: "+84 345 669 006",
      email: "babystorm2310@gmail.com",
    },
    {
      id: "loc-hn",
      name: "Cơ sở Tp. Thái Bình",
      address: "Ngõ 7 Doãn Khuê - Quan Trung - Tp Thái Bình",
      phone: "++84 345 669 006",
      email: "babystorm2310@gmail.com",
    },
  ],
};

export const TOPBAR_DATA = {
  phone: "0345669006",
  address: "Số 68/75 Điện Biên - Cửa Bắc - Tp Nam Định.",
};

export const ANIMATIONS = {
  fadeInDown: "animate__animated animate__fadeInDown",
  fadeInUp: "animate__animated animate__fadeInUp",
  fadeIn: "animate__animated animate__fadeIn",
  slideInLeft: "animate__animated animate__slideInLeft",
  slideInRight: "animate__animated animate__slideInRight",
  zoomIn: "animate__animated animate__zoomIn",
  pulse: "animate__animated animate__pulse",
};

const GALLERY_TABS = [
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

export const fetchNavLinks = async () =>
  fetchJson<NavLink[]>("/api/public/navigation", NAV_LINKS);
export const fetchHeroSlides = async () =>
  fetchJson<HeroSlide[]>("/api/public/hero-slides", HERO_SLIDES);
export const fetchHeroBackgrounds = async () =>
  fetchJson<HeroSlideBg[]>("/api/public/hero-backgrounds", HERO_SLIDES_BG);
export const fetchCtaButtons = async () =>
  fetchJson<typeof CTA_BUTTONS>("/api/public/cta-buttons", CTA_BUTTONS);
export const fetchAbout = async () =>
  fetchJson<typeof ABOUT_DATA>("/api/public/about", ABOUT_DATA);
export const fetchContact = async () =>
  fetchJson<typeof CONTACT_DATA>("/api/public/contact", CONTACT_DATA);
export const fetchFooter = async () =>
  fetchJson<typeof FOOTER_DATA>("/api/public/footer", FOOTER_DATA);
export const fetchTopbar = async () =>
  fetchJson<typeof TOPBAR_DATA>("/api/public/topbar", TOPBAR_DATA);
export const fetchGalleryTabs = async () =>
  fetchJson<typeof GALLERY_TABS>("/api/public/gallery/tabs", GALLERY_TABS);

export const PRICING_DATA: Package[] = [
  {
    id: "pkg-mini",
    title: "Gói Mini",
    price: "1.000.000",
    currency: "VND",
    image: "/assets/img/maubetrai/1.jpg",
    tagline: "Thích hợp không gian nhỏ.",
    bullets: ["Biển tên.", "Chibi ảnh bé.", "Sét đồ phụ kiện."],
  },
  {
    id: "pkg-standard",
    title: "Gói Tiêu Chuẩn",
    price: "1.550.000",
    currency: "VND",
    image: "/assets/img/maubetrai/7.jpg",
    tagline: "Phù hợp gia đình vừa và nhỏ.",
    bullets: ["Backdrop", "Bóng bay trang trí", "Bàn quà"],
  },
  {
    id: "pkg-premium",
    title: "Gói Premium",
    price: "2.200.000",
    currency: "VND",
    image: "/assets/img/SangSinMin/3.jpg",
    tagline: "Sự kiện sang trọng, trọn gói.",
    bullets: ["Trang trí trọn gói", "Backdrop cao cấp", "Trang trí ánh sáng"],
  },
  {
    id: "pkg-deluxe",
    title: "Gói Deluxe",
    price: "5.300.000",
    currency: "VND",
    image: "/assets/img/meobaogia/gia1.jpg",
    tagline: "Trải nghiệm VIP, kịch bản sự kiện.",
    bullets: ["Concept riêng", "Quà lưu niệm", "Hậu cần trọn gói"],
  },
  // more packages can be added here
];

export const fetchPricing = async () =>
  fetchJson<Package[]>("/api/public/pricing", PRICING_DATA);

export const EVENTS_DATA: EventItem[] = [
  {
    id: "event-1",
    title: "TRANG TRÍ NGÀY LỄ, KỶ NIỆM",
    cover: "/assets/img/meobaogia/gia1.jpg",
    images: [
      "/assets/img/meobaogia/gia1.jpg",
      "/assets/img/meobaogia/gia1-2.jpg",
      "/assets/img/meobaogia/gia1-3.jpg",
    ],
    description:
      "Trang trí ngày lễ, kỷ niệm với phong cách sáng tạo và ấm cúng.",
  },
  {
    id: "event-2",
    title: "TRANG TRÍ TẾT",
    cover: "/assets/img/meobaogia/gia2.jpg",
    images: [
      "/assets/img/meobaogia/gia2.jpg",
      "/assets/img/meobaogia/gia2-2.jpg",
    ],
    description: "Ý tưởng trang trí Tết truyền thống pha chút hiện đại.",
  },
  {
    id: "event-3",
    title: "TRANG TRÍ NOEL",
    cover: "/assets/img/meobaogia/gia4.jpg",
    images: [
      "/assets/img/meobaogia/gia4.jpg",
      "/assets/img/meobaogia/gia4-2.jpg",
    ],
    description: "Không khí Giáng sinh ấm áp, lộng lẫy cho mọi không gian.",
  },
];

export const fetchEvents = async () =>
  fetchJson<EventItem[]>("/api/public/events", EVENTS_DATA);
export const fetchEventById = async (id: string) => {
  const fallback = EVENTS_DATA.find((e) => e.id === id);
  return fetchJson<EventItem | undefined>(`/api/public/events/${id}`, fallback);
};
