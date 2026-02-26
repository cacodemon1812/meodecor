import React from "react";

export default function AboutSection() {
  return (
    <section id="about" className="about">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5 align-items-stretch video-box">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Bje3D4Tn3lU?si=wY-5I-bzRcq7BxQ4"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch">
            <div className="content">
              <h2>Bóng Bay Kích Nổ tại <span>Nam Định</span></h2>
              <p>
                Bóng kích nổ hiện đang là một trong những xu hướng trang trí mới
                cho các sự kiện​ quan trọng bởi đem hiệu ứng đẹp, độc đáo.
              </p>
              <p className="fst-italic">
                🎈🎈🎈🎈🎈
                💁‍♂️ SỐP CAM KẾT : 
              </p>
              <ul>
                <li><i className="bx bx-check-double"></i>Sử dụng khí Heli an toàn tuyệt đối.</li>
                <li><i className="bx bx-check-double"></i>KHÔNG GÂY CHÁY NỔ.</li>
                <li><i className="bx bx-check-double"></i>Có tem kiểm định của nhà sản xuất.</li>
                <li><i className="bx bx-check-double"></i>Bơm đủ số lượng bóng nhỏ trong mỗi quả bóng lớn.</li>
                <li><i className="bx bx-check-double"></i>Phục vụ tận nơi nội thành Nam Định và các tỉnh lân cận!.</li>
              </ul>
              <p>
                💥💥💥Bóng bay kích nổ Nam Định💥💥💥
                🎈Dịch vụ bóng kích nổ đám cưới, sự kiện tại Nam Định và các tỉnh lân cận
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
