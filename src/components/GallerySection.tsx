import React from "react";

interface GallerySectionProps {
  id: string;
  title: string;
  images: string[];
}

export default function GallerySection({ id, title, images }: GallerySectionProps) {
  return (
    <section id={id} className="contact">
      <div className="container">
        <div className="section-title">
          <h2>
            <span>{title}</span> Meo Decor - Party & Event Baby
          </h2>
        </div>
      </div>
      <div className="container mt-5">
        <div className="gallery">
          {images.map((src, i) => (
            <a key={i} href={src} className={i === 0 ? "big" : undefined}>
              <img src={src} alt="" title="" />
            </a>
          ))}
          <div className="clear"></div>
        </div>
      </div>
    </section>
  );
}
