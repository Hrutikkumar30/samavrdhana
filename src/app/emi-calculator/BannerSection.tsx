"use client";

import Image from "next/image";
import img2 from "../../assests/images/EmiCalc.png";
import { useEffect, useState } from "react";
import { GetAllBannerImages } from "@/api/apis";

export default function EmiBanner() {
  const [bannerImages, setBannerImages] = useState({
    blogsBannerImage: "",
    blogsBannerMobileImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBannerImages();
  }, []);

  const fetchBannerImages = async () => {
    setIsLoading(true);
    try {
      const response = await GetAllBannerImages();
      if (response.data && response.data.length > 0) {
        const projectBanner = response.data.find(
          (item) => item.blogsBannerImage
        );

        if (projectBanner) {
          setBannerImages({
            blogsBannerImage: projectBanner.blogsBannerImage,

            blogsBannerMobileImage:
              projectBanner.blogsBannerMobileImage ||
              projectBanner.blogsBannerImage,
          });
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div>
      <section className="relative lg:h-[25.3vw] h-[25vh] flex items-center">
        {isLoading ? (
          <div className="absolute inset-0 w-full h-full bg-gray-200 -z-10"></div>
        ) : bannerImages.blogsBannerImage ? (
          <>
            <Image
              //   src={`${API_URL}/${bannerImages.blogsBannerImage}`}
              src={img2}
              alt="Background"
              fill
              className="hidden lg:block -z-10 "
            />
            <Image
              src={img2}
              alt="Background Mobile"
              fill
              className="block lg:hidden -z-10  "
            />
            <div className="absolute inset-0"></div>
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-300 flex items-center justify-center -z-10">
            <p className="text-[16px] mt-12">
              Banner is not available for Emi Calculator
            </p>
          </div>
        )}
        <div className="lg:px-[7.5%] px-2 relative z-10">
          <h1 className="text-[51.73px] leading-[100%] tracking-[0%] font-roboto font-bold  mb-4 lg:text-[80px] lg:leading-[100%] text-nbr-black09">
            EMI Calculator
          </h1>
        </div>
      </section>
    </div>
  );
}
