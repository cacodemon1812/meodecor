import React from "react";
import { fetchTopbar } from "@/data/constants";

export default async function TopBar() {
  const topbarData = await fetchTopbar();

  return (
    <section
      id="topbar"
      className="d-flex align-items-center fixed-top topbar-transparent"
    >
      <div className="container-fluid container-xl d-flex align-items-center justify-content-center justify-content-lg-start">
        <i className="bi bi-phone d-flex align-items-center">
          <span>{topbarData.phone} </span>
        </i>
        <i className="bi bi-clock ms-4 d-none d-lg-flex align-items-center">
          <span>{topbarData.address}</span>
        </i>
      </div>
    </section>
  );
}
