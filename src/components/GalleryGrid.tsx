import React from "react";

const images = [
  "/assets/img/mauthinhhanh/1.jpg",
  "/assets/img/mauthinhhanh/2.jpg",
  "/assets/img/mauthinhhanh/3.jpg",
  "/assets/img/mauthinhhanh/4.jpg",
  "/assets/img/mauthinhhanh/5.jpg",
  "/assets/img/mauthinhhanh/6.jpg",
  "/assets/img/mauthinhhanh/7.jpg",
  "/assets/img/mauthinhhanh/8.jpg",
];

export default function GalleryGrid() {
  return (
    <section id="gallery" className="gallery">
      <div className="container-fluid">
        <div className="section-title">
          <h2>Các mẫu thịnh hành <span>MeoDecor</span></h2>
        </div>
        <div className="row g-0">
          {images.map((src, idx) => (
            <div key={idx} className="col-lg-3 col-md-4">
              <div className="gallery-item">
                <a href={src} className="gallery-lightbox">
                  <img src={src} alt="" className="img-fluid" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
