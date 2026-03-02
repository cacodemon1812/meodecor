import React from "react";
import { fetchFooter } from "@/data/constants";

export default async function Footer() {
  const FOOTER = await fetchFooter();

  return (
    <footer id="footer" className="pt-5 pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h3 className="mb-2">{FOOTER.company}</h3>
            <p className="text-muted">{FOOTER.description}</p>
            <div className="social-links mt-3">
              <a href={FOOTER.socials.twitter} className="twitter">
                <i className="bx bxl-twitter"></i>
              </a>
              <a href={FOOTER.socials.facebook} className="facebook">
                <i className="bx bxl-facebook"></i>
              </a>
              <a href={FOOTER.socials.instagram} className="instagram">
                <i className="bx bxl-instagram"></i>
              </a>
              <a href={FOOTER.socials.linkedin} className="linkedin">
                <i className="bx bxl-linkedin"></i>
              </a>
            </div>
          </div>

          {FOOTER.locations &&
            FOOTER.locations.map((loc: any) => (
              <div className="col-lg-2 col-md-6 mb-4" key={loc.id}>
                <h5 className="mb-2">{loc.name}</h5>
                <p className="mb-1 small">{loc.address}</p>
                <p className="mb-1 small">Tel: {loc.phone}</p>
                <p className="small">{loc.email}</p>
              </div>
            ))}
        </div>

        <div className="row mt-4">
          <div className="col-12 text-center text-muted small">
            &copy; {FOOTER.year} <strong>{FOOTER.company}</strong>. All Rights
            Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
