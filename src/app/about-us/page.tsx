"use client";

import BannerSection from "./BannerSection";
import JourneySection from "./JourneySection";
import WhatWeOfferSection from "./WhatWeOfferSection";
import WhyChooseSection from "./WhyChooseSection";
import AboutUsSection from "./AboutSection";

export default function AboutUs() {
  return (
    <div>
      <BannerSection />
      <AboutUsSection />
      <JourneySection />
      <WhyChooseSection />
      <WhatWeOfferSection />

      <section className="lg:pt-64 pt-[110vh]"></section>
    </div>
  );
}
