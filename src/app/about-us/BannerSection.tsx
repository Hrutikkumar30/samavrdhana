"use client";

import Image from "next/image";
import mbImg from "../../assests/images/AboutMobileBg.png";
import { useEffect, useState } from "react";
import { GetAllBannerImages } from "@/api/apis";

export default function BannerSection() {
  const [bannerImages, setBannerImages] = useState({
    aboutUsBannerImage: "",
    aboutUsMobileBannerImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchBannerImages();
  }, []);

  const fetchBannerImages = async () => {
    setIsLoading(true);
    try {
      const response = await GetAllBannerImages();
      if (response.data && response.data.length > 0) {
        const aboutUsBanner = response.data.find(
          (item) => item.aboutUsBannerImage
        );

        if (aboutUsBanner) {
          setBannerImages({
            aboutUsBannerImage: aboutUsBanner.aboutUsBannerImage,
            aboutUsMobileBannerImage:
              aboutUsBanner.aboutUsMobileBannerImage ||
              aboutUsBanner.aboutUsBannerImage,
          });
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <section className="relative lg:h-[25.3vw] h-[25vh] flex items-center">
        {isLoading ? (
          <div className="absolute inset-0 w-full h-full bg-gray-200 -z-10"></div>
        ) : bannerImages?.aboutUsBannerImage ? (
          <>
            <Image
              src={`${API_URL}/${bannerImages.aboutUsBannerImage}`}
              alt="Background"
              fill
              className="hidden lg:block -z-10 "
            />
            <Image
              src={`${API_URL}/${bannerImages.aboutUsBannerImage}`}
              alt="Background Mobile"
              fill
              className="block lg:hidden -z-10 "
            />
            <div className="absolute inset-0 lg:bg-opacity-30"></div>
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-300 flex items-center justify-center -z-10">
            <p className="text-[16px] mt-8">
              Banner is not available for About Us
            </p>
          </div>
        )}
        <div className="lg:px-[7.5%] px-2 relative z-10">
          <h1 className="text-[51.73px] leading-[100%] tracking-[0%] font-roboto font-bold text-nbr-black09 mb-4 lg:text-[80px] lg:leading-[100%]">
            About Us
          </h1>
        </div>
      </section>
    </>
  );
}
