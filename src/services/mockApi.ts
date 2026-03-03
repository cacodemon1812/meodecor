// Mock API / data layer — replace with real API later
import type { NavLink, HeroSlide, Package, EventItem } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Trang Chủ", href: "#hero", id: "home" },
  { label: "Mẫu cho bé trai", href: "#MauBeGai", id: "boy" },
  { label: "Mẫu cho bé gái", href: "#maubetrai", id: "girl" },
  { label: "Mẫu sang xịn mịn", href: "#mausangsinmin", id: "premium" },
  { label: "Liên hệ", href: "#contact", id: "contact" },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "/assets/img/slidemeo/slide-1.jpg",
    title: "Meo Decor",
    subtitle: "Chuyên Nghiệp",
    description:
      'Sở hữu một đội ngũ nhân sự lâu năm trong nghề tổ chức Event, Meo Decor cam kết "Đúng Hẹn – Đúng Sản Phẩm – Đúng Chất Lượng". Với chúng tôi, mỗi khách hàng là một người thân, mỗi em bé là một Thiên Thần. Sự hài lòng là niềm tự hào của Meo Decor',
  },
  {
    id: 2,
    image: "/assets/img/slidemeo/slide-2.jpg",
    title: "Meo Decor",
    subtitle: "Nhiệt Tình – Sáng Tạo",
    description:
      "Nhiệt Tình – Sáng Tạo : Meo Decor luôn trân quý những ý tưởng của bạn và sẵn sàng cùng bạn hoàn thiện những ý tưởng đó để ngày sinh nhật của bé yêu là ngày tuyệt vời nhất của gia đình. Với sự đam mê và tâm huyết với nghề, Meo Decor không ngừng sáng tạo để mang lại cho bé và gia đình những trải nghiệm Mới – Đẹp – Lạ – Vui nhất!",
  },
  {
    id: 3,
    image: "/assets/img/slidemeo/slide-3.jpg",
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
      phone: "+84 912 345 678",
      email: "babystorm2310@gmail.com",
    },
    {
      id: "loc-hn",
      name: "Cơ sở Tp. Thái Bình",
      address: "Ngõ 7 Doãn Khuê - Quan Trung - Tp Thái Bình",
      phone: "+84 987 654 321",
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

// Simple mock fetch helpers (simulate async API)
export const fetchNavLinks = async () => {
  return Promise.resolve(NAV_LINKS);
};
export const fetchHeroSlides = async () => Promise.resolve(HERO_SLIDES);
export const fetchCtaButtons = async () => Promise.resolve(CTA_BUTTONS);
export const fetchAbout = async () => Promise.resolve(ABOUT_DATA);
export const fetchFooter = async () => Promise.resolve(FOOTER_DATA);
export const fetchTopbar = async () => Promise.resolve(TOPBAR_DATA);

export const PRICING_DATA: Package[] = [
  {
    id: "pkg-mini",
    title: "Gói Mini",
    price: "1.000.000",
    currency: "VND",
    image: "/assets/img/maubetrai/24.jpg",
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

export const fetchPricing = async () => Promise.resolve(PRICING_DATA);

export const EVENTS_DATA: EventItem[] = [
  {
    id: "event-1",
    title: "TRANG TRÍ NGÀY LỄ, KỶ niỆM",
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

export const fetchEvents = async () => Promise.resolve(EVENTS_DATA);
export const fetchEventById = async (id: string) =>
  Promise.resolve(EVENTS_DATA.find((e) => e.id === id));
