import React from "react";

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-container">
        <div
          id="heroCarousel"
          data-bs-interval="5000"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <ol className="carousel-indicators" id="hero-carousel-indicators"></ol>

          <div className="carousel-inner" role="listbox">
            {/* Slide 1 */}
            <div
              className="carousel-item active"
              style={{ backgroundImage: "url(/assets/img/slidemeo/slide-1.jpg)" }}
            >
              <div className="carousel-container">
                <div className="carousel-content" style={{ width: "100%" }}>
                  <h2 className="animate__animated animate__fadeInDown">
                    <img
                      src="/assets/img/logo/logo.png"
                      alt=""
                      className="img-fluid logo-meo"
                    />
                  </h2>
                  <h2 className="animate__animated animate__fadeInDown">
                    <span>Meo Decor </span> Chuyên Nghiệp
                  </h2>
                  <p
                    className="animate__animated animate__fadeInUp"
                    style={{ fontSize: "larger !important" }}
                  >
                    Sở hữu một đội ngũ nhân sự lâu năm trong nghề tổ chức Event,
                    Meo Decor cam kết ”Đúng Hẹn – Đúng Sản Phẩm – Đúng Chất
                    Lượng”. Với chúng tôi, mỗi khách hàng là một người thân, mỗi
                    em bé là một Thiên Thần. Sự hài lòng là niềm tự hào của Meo
                    Decor
                  </p>
                  <div>
                    <a
                      href="#menu"
                      className="btn-menu animate__animated animate__fadeInUp scrollto"
                    >
                      Dịch vụ
                    </a>
                    <a
                      href="#book-a-table"
                      className="btn-book animate__animated animate__fadeInUp scrollto"
                    >
                      Liên hệ
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div
              className="carousel-item"
              style={{ backgroundImage: "url(/assets/img/slidemeo/slide-2.jpg)" }}
            >
              <div className="carousel-container">
                <div className="carousel-content">
                  <h2 className="animate__animated animate__fadeInDown">
                    <span>Meo Decor </span> Nhiệt Tình – Sáng Tạo
                  </h2>
                  <p className="animate__animated animate__fadeInUp">
                    Nhiệt Tình – Sáng Tạo : Meo Decor luôn trân quý những ý
                    tưởng của bạn và sẵn sàng cùng bạn hoàn thiện những ý tưởng
                    đó để ngày sinh nhật của bé yêu là ngày tuyệt vời nhất của
                    gia đình. Với sự đam mê và tâm huyết với nghề, Meo Decor không
                    ngừng sáng tạo để mang lại cho bé và gia đình những trải nghiệm
                    Mới – Đẹp – Lạ – Vui nhất!
                  </p>
                  <div>
                    <a
                      href="#menu"
                      className="btn-menu animate__animated animate__fadeInUp scrollto"
                    >
                      Dịch vụ
                    </a>
                    <a
                      href="#book-a-table"
                      className="btn-book animate__animated animate__fadeInUp scrollto"
                    >
                      Liên hệ
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div
              className="carousel-item"
              style={{ backgroundImage: "url(/assets/img/slidemeo/slide-3.jpg)" }}
            >
              <div className="carousel-container">
                <div className="carousel-content">
                  <h2 className="animate__animated animate__fadeInDown">
                    <span>Meo Decor </span> Tinh Tế
                  </h2>
                  <p className="animate__animated animate__fadeInUp">
                    Chúng tôi hiểu mỗi em bé là tài sản vô giá của cha mẹ, và ngày
                    sinh nhật bé là ngày thiêng liêng nhất của gia đình. Meo Decor
                    có mặt tại đây để chung tay cùng bạn trao cho bé một ngày thật
                    đặc biệt và tràn ngập yêu thương.
                  </p>
                  <div>
                    <a
                      href="#menu"
                      className="btn-menu animate__animated animate__fadeInUp scrollto"
                    >
                      Dịch vụ
                    </a>
                    <a
                      href="#book-a-table"
                      className="btn-book animate__animated animate__fadeInUp scrollto"
                    >
                      Liên hệ
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a className="carousel-control-prev" href="#heroCarousel" role="button" data-bs-slide="prev">
            <span className="carousel-control-prev-icon bi bi-chevron-left" aria-hidden="true"></span>
          </a>

          <a className="carousel-control-next" href="#heroCarousel" role="button" data-bs-slide="next">
            <span className="carousel-control-next-icon bi bi-chevron-right" aria-hidden="true"></span>
          </a>
        </div>
      </div>
    </section>
  );
}
