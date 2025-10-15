"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { NextIcon, PreviousIcon } from "@/app/projects/icons";
import img3 from "../../assests/images/mobileBanner.png";
import { GetHomeBannerImages } from "@/api/apis";

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [isMobile, setIsMobile] = useState(false);
  const [apiImages, setApiImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHeld, setIsHeld] = useState(false);
  const [autoSlideTimer, setAutoSlideTimer] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    if (!api || isHeld) {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        setAutoSlideTimer(null);
      }
      return;
    }

    const timer = setInterval(() => {
      api.scrollNext();
    }, 5000);

    setAutoSlideTimer(timer);

    return () => {
      clearInterval(timer);
      setAutoSlideTimer(null);
    };
  }, [api, isHeld]);

  useEffect(() => {
    fetchBannerImages();
  }, []);

  const fetchBannerImages = async () => {
    setIsLoading(true);
    try {
      const response = await GetHomeBannerImages();
      if (response.data && Array.isArray(response.data)) {
        setApiImages(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAutoSlideTimer = useCallback(() => {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
    }

    if (api && !isHeld) {
      const timer = setInterval(() => {
        api.scrollNext();
      }, 5000);
      setAutoSlideTimer(timer);
    }
  }, [api, isHeld, autoSlideTimer]);

  const mobileSlides = [{ image: img3 }, { image: img3 }];

  const desktopSlides = apiImages.map((item) => ({
    imageUrl: `${API_URL}/home_page_banner/${item.bannerImage}`,
  }));

  const slides = desktopSlides;

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
    resetAutoSlideTimer();
  }, [api, resetAutoSlideTimer]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
    resetAutoSlideTimer();
  }, [api, resetAutoSlideTimer]);

  // Loading state
  if (isLoading) {
    return (
      <section
        className="relative w-full flex items-center justify-center bg-gray-100"
        style={{ height: "45vw" }}
      >
        <div className="text-center">
          <div className="mb-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-gray-700 text-lg">Loading banners...</p>
        </div>
      </section>
    );
  }

  if (!isMobile && apiImages.length === 0) {
    return (
      <section
        className="relative w-full flex items-center justify-center bg-gray-50"
        style={{ height: "45vw" }}
      >
        <div className="text-center p-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">
            No Banners Available
          </h1>
          <p className="text-gray-600">
            There are currently no banner images to display. Please check back
            later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative w-full ${isMobile ? "h-[70vw]" : "h-[53vw]"}`}
    >
      <Carousel
        key={isMobile ? "mobile" : "desktop"}
        className="w-full h-full"
        setApi={setApi}
        onSelect={(api) => setCurrent(api.selectedScrollSnap())}
        opts={{
          align: "center",
          slidesToScroll: 1,
          loop: true,
          duration: 60,
        }}
      >
        <CarouselContent
          className={`h-full ${isMobile ? "h-[70vw]" : "h-[53vw]"}`}
          onMouseDown={() => setIsHeld(true)}
          onMouseUp={() => setIsHeld(false)}
          onMouseLeave={() => setIsHeld(false)}
          onTouchStart={() => setIsHeld(true)}
          onTouchEnd={() => setIsHeld(false)}
        >
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className="h-full w-full overflow-hidden flex justify-center items-center"
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 w-full h-full">
                  {/* For mobile, use imported image */}
                  {isMobile ? (
                    <Image
                      src={slide.imageUrl}
                      alt={`Banner ${index + 1}`}
                      fill
                    />
                  ) : (
                    <Image
                      src={slide?.imageUrl}
                      alt={`Banner ${index + 1}`}
                      fill
                    />
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {slides.length > 1 && (
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
            <button className="text-white" onClick={scrollPrev}>
              <PreviousIcon />
            </button>
            <button className="text-white" onClick={scrollNext}>
              <NextIcon />
            </button>
          </div>
        )}
      </Carousel>
    </section>
  );
}
