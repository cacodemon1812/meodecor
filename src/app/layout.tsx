import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://meodecor.info";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-Y18EWCBSWM";

const LOGO = "/assets/img/logo/logo.png";
const OG_IMAGE = "/assets/img/slidemeo/slide-1.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Meo Decor – Trang Trí Sinh Nhật & Sự Kiện Cho Bé | Nam Định, Hà Nam, Thái Bình, Ninh Bình",
    template: "%s | Meo Decor",
  },

  description:
    "Meo Decor chuyên trang trí sinh nhật, tổ chức sự kiện cho trẻ em tại Nam Định, Hà Nam, Thái Bình, Ninh Bình. Đội ngũ chuyên nghiệp, giá hợp lý, cam kết Đúng Hẹn – Đúng Chất Lượng. Đặt ngay!",

  keywords: [
    "trang trí sinh nhật Nam Định",
    "tổ chức sự kiện Nam Định",
    "decor sinh nhật bé trai Nam Định",
    "decor sinh nhật bé gái Nam Định",
    "thuê trang trí sinh nhật Nam Định",
    "trang trí sinh nhật Hà Nam",
    "tổ chức sinh nhật Hà Nam",
    "trang trí sinh nhật Thái Bình",
    "tổ chức sự kiện Thái Bình",
    "trang trí sinh nhật Ninh Bình",
    "tổ chức sự kiện Ninh Bình",
    "meo decor",
    "decor bóng bay",
    "trang trí tiệc sinh nhật trẻ em",
    "party trang trí cho bé",
    "backdrop sinh nhật",
    "trang trí phòng sinh nhật",
    "dịch vụ trang trí sự kiện",
    "decor sự kiện chuyên nghiệp",
  ],

  authors: [{ name: "Meo Decor", url: SITE_URL }],
  creator: "Meo Decor",
  publisher: "Meo Decor",

  /* ── Icons — handled by src/app/icon.tsx (App Router convention)
        apple-touch-icon và shortcut remain here as supplementary ── */
  icons: {
    shortcut: LOGO,
    apple: { url: LOGO, type: "image/png" },
  },

  /* ── Open Graph ─────────────────────────────────────────────── */
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: "Meo Decor",
    title:
      "Meo Decor – Trang Trí Sinh Nhật & Sự Kiện Cho Bé | Nam Định, Hà Nam, Thái Bình, Ninh Bình",
    description:
      "Chuyên trang trí sinh nhật, sự kiện cho trẻ em tại Nam Định, Hà Nam, Thái Bình, Ninh Bình. Đội ngũ nhiệt tình, sáng tạo, chuyên nghiệp.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Meo Decor – Trang trí sinh nhật, sự kiện cho bé",
      },
      {
        url: LOGO,
        width: 512,
        height: 512,
        alt: "Meo Decor Logo",
      },
    ],
  },

  /* ── Twitter / X ────────────────────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    title: "Meo Decor – Trang Trí Sinh Nhật & Sự Kiện Cho Bé",
    description:
      "Chuyên trang trí sinh nhật, sự kiện cho trẻ em tại Nam Định, Hà Nam, Thái Bình, Ninh Bình.",
    images: [OG_IMAGE],
  },

  /* ── Robots ─────────────────────────────────────────────────── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Canonical ──────────────────────────────────────────────── */
  alternates: {
    canonical: SITE_URL,
    languages: { "vi-VN": SITE_URL },
  },

  // Bỏ comment khi có token từ Google Search Console
  // verification: {
  //   google: "GOOGLE_SEARCH_CONSOLE_TOKEN",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Favicon — explicit tags override favicon.ico default */}
        <link rel="icon" href={LOGO} type="image/png" />
        <link rel="shortcut icon" href={LOGO} type="image/png" />
        <link rel="apple-touch-icon" href={LOGO} />
        {/* Vendor CSS */}
        <link
          href="/assets/vendor/bootstrap/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="/assets/vendor/bootstrap-icons/bootstrap-icons.css"
          rel="stylesheet"
        />
        <link
          href="/assets/vendor/boxicons/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link href="/assets/css/style.css" rel="stylesheet" />
        {/* Structured data */}
        <JsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
