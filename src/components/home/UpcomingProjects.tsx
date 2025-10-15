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
import { GetUpComingProjectDetails } from "@/api/apis";

export default function UpcomingProjects() {
  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState();
  const [projectsData, setProjectsData] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoSlideTimer, setAutoSlideTimer] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await GetUpComingProjectDetails();

        const data = response.data || response;

        const projectsArray = Array.isArray(data)
          ? data
          : [data].filter(Boolean);

        setProjectsData(projectsArray);

        const allSlides = [];

        projectsArray.forEach((project) => {
          if (
            project.upCommingProjectBanner &&
            project.upCommingProjectBanner.length > 0
          ) {
            const projectSlides = project.upCommingProjectBanner.map(
              (banner) => ({
                image: banner.upCommingProjectBannerImage,
                cardBg: project.image,
                projectName: project.projectName,
                city: project.city,
                locationIcon: project.locationIcon,
                projectId: project.id,
              })
            );

            allSlides.push(...projectSlides);
          }
        });

        setBannerImages(allSlides);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  const resetAutoSlideTimer = useCallback(() => {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
    }

    if (api && !loading && bannerImages.length > 1) {
      const timer = setInterval(() => {
        api.scrollNext();
      }, 5000);
      setAutoSlideTimer(timer);
    }
  }, [api, loading, bannerImages.length, autoSlideTimer]);

  useEffect(() => {
    if (!api || loading || bannerImages.length <= 1) {
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
  }, [api, loading, bannerImages.length]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
    resetAutoSlideTimer();
  }, [api, resetAutoSlideTimer]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
    resetAutoSlideTimer();
  }, [api, resetAutoSlideTimer]);

  if (loading) {
    return (
      <section className="relative w-full h-[45vw] flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  if (bannerImages.length === 0) {
    return <div></div>;
  }

  return (
    <section className="relative w-full lg:h-[45vw] h-[120vw]  lg:py-0 py-4">
      <div className="absolute top-8 left-0 right-0 z-20 flex justify-center">
        <p className="text-nbr-black04 font-roboto font-bold text-center text-[clamp(26px,5vw,48px)] leading-[44px] tracking-normal">
          Upcoming Projects
        </p>
      </div>

      <Carousel
        className="w-full h-full"
        setApi={setApi}
        onSelect={(api) => setCurrent(api.selectedScrollSnap())}
        opts={{
          align: "start",
          slidesToScroll: 1,
          loop: bannerImages.length > 1,
        }}
      >
        <CarouselContent className="lg:h-[45vw] h-[120vw] ">
          {bannerImages.map((slide, index) => (
            <CarouselItem
              key={`${slide.projectId}-${index}`}
              className="h-full w-full overflow-hidden p-0"
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={`${API_URL}/${slide?.image}`}
                    alt={`${slide.projectName} project banner`}
                    fill
                  />
                </div>

                <div className="relative h-full w-full flex items-center justify-center">
                  <div className="text-center mx-4 sm:mx-auto max-w-xs sm:max-w-sm md:max-w-2xl bg-nbr-blurblack1 rounded-lg relative overflow-hidden flex flex-col">
                    <div className="absolute inset-0 w-full h-full opacity-10 z-0">
                      {slide.cardBg && (
                        <Image
                          src={`${API_URL}/${slide?.cardBg}`}
                          alt="Card background"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="p-8 md:p-12 lg:p-16 relative z-10 flex-grow mt-6">
                      <p className="font-light text-white mb-6 md:mb-12">
                        <span className="md:hidden font-roboto font-bold text-[28px] leading-[100%] tracking-normal">
                          Coming Soon
                        </span>
                        <span className="hidden md:inline font-roboto font-bold text-[48px] leading-[100%] tracking-normal text-center">
                          Coming
                          <br />
                          Soon
                        </span>
                      </p>
                    </div>

                    <div className="flex text-white bg-nbr-blurblack p-6 md:p-8 lg:p-10 items-center gap-4 md:gap-6 relative z-10 mt-auto">
                      <div className="relative w-6 h-6 md:w-8 md:h-8">
                        <Image
                          src={`${API_URL}/${slide?.locationIcon}`}
                          alt="Location Icon"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col text-start">
                        <h2 className="font-roboto font-medium text-[18px] leading-[43.15px] lg:text-[26.55px]">
                          {slide?.projectName}
                        </h2>

                        <h3 className="font-roboto font-normal text-[16px] lg:text-[23.23px] leading-[43.15px] text-white">
                          {slide?.city}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {bannerImages.length > 1 && (
          <>
            <button
              className="hidden md:block absolute left-4 md:left-10 lg:left-20 top-1/2 text-white z-20 transform -translate-y-1/2"
              onClick={scrollPrev}
            >
              <PreviousIcon />
            </button>
            <button
              className="hidden md:block absolute right-4 md:right-10 lg:right-20 top-1/2 text-white z-20 transform -translate-y-1/2"
              onClick={scrollNext}
            >
              <NextIcon />
            </button>
          </>
        )}
      </Carousel>
    </section>
  );
}
