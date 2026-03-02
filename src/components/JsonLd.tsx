const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://meodecor.info";

const LOGO = `${SITE_URL}/assets/img/logo/logo.png`;
const OG_IMAGE = `${SITE_URL}/assets/img/slidemeo/slide-1.jpg`;

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: "Meo Decor",
        alternateName: "MeoDecor – Trang Trí Sự Kiện",
        description:
          "Meo Decor chuyên trang trí sinh nhật, tổ chức sự kiện cho trẻ em tại Nam Định, Hà Nam, Thái Bình, Ninh Bình. Cam kết Đúng Hẹn – Đúng Sản Phẩm – Đúng Chất Lượng.",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: LOGO,
          caption: "Meo Decor Logo",
        },
        image: OG_IMAGE,
        telephone: "+84345669006",
        priceRange: "₫₫",
        currenciesAccepted: "VND",
        paymentAccepted: "Cash, Bank Transfer",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "08:00",
            closes: "20:00",
          },
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Số 68/75 Điện Biên - Cửa Bắc",
          addressLocality: "Nam Định",
          addressRegion: "Nam Định",
          addressCountry: "VN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 20.4388,
          longitude: 106.1621,
        },
        areaServed: [
          { "@type": "City", name: "Nam Định" },
          { "@type": "City", name: "Hà Nam" },
          { "@type": "City", name: "Thái Bình" },
          { "@type": "City", name: "Ninh Bình" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Dịch vụ trang trí sự kiện",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Gói Mini",
                description:
                  "Trang trí sinh nhật gói mini – thích hợp không gian nhỏ",
                price: "1399000",
                priceCurrency: "VND",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Gói Tiêu Chuẩn",
                description:
                  "Trang trí sinh nhật tiêu chuẩn – phù hợp gia đình vừa và nhỏ",
                price: "2799000",
                priceCurrency: "VND",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Gói Premium",
                description: "Trang trí sự kiện sang trọng, trọn gói",
                price: "5499000",
                priceCurrency: "VND",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Gói Deluxe",
                description:
                  "Trải nghiệm VIP – concept riêng, kịch bản sự kiện hoàn chỉnh",
                price: "8999000",
                priceCurrency: "VND",
              },
            },
          ],
        },
        sameAs: ["https://www.facebook.com/meodecorpartyeventbaby"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Meo Decor",
        description:
          "Trang trí sinh nhật & sự kiện cho bé tại Nam Định, Hà Nam, Thái Bình, Ninh Bình",
        inLanguage: "vi",
        publisher: { "@id": `${SITE_URL}/#business` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
