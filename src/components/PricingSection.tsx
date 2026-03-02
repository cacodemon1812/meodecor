import React from "react";
import { fetchPricing } from "@/data/constants";
import PricingSliderClient from "@/components/PricingSliderClient";

export default async function PricingSection() {
  const packages = await fetchPricing();

  return (
    <section id="BaoGiaDichVu" className="events">
      <div className="container">
        <div className="section-title">
          <h2>
            Báo Giá Dịch Vụ <span>MeoDecor</span>
          </h2>
        </div>

        <div className="mt-6">
          <PricingSliderClient items={packages} />
        </div>
      </div>
    </section>
  );
}
