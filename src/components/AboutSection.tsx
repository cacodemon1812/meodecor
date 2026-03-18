import React from "react";
import { fetchAbout } from "@/data/constants";

export default async function AboutSection() {
  const ABOUT = await fetchAbout();

  return (
    <section id="about" className="about">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5 align-items-stretch video-box">
            <iframe
              width="100%"
              height="100%"
              src={ABOUT.videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch">
            <div className="content">
              <h2>
                {ABOUT.title} <span>MeoDecor</span>
              </h2>
              <p>{ABOUT.description}</p>
              <p className="fst-italic">🎈🎈🎈🎈🎈 💁‍♂️ SỐP CAM KẾT :</p>
              <ul>
                {ABOUT.commitments?.map((commitment: string) => (
                  <li key={commitment}>
                    <i className="bx bx-check-double"></i>
                    {commitment}
                  </li>
                ))}
              </ul>
              <p>{ABOUT.highlight}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
