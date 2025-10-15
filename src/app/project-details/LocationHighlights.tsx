"use client";

import { GetProjectDetails } from "@/api/apis";
import parse from "html-react-parser";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { NextIcon, PreviousIcon } from "@/app/projects/icons";

export default function LocationHighlights({ projectId }) {
  const [projectData, setProjectData] = useState(null);
  const [location, setLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const cardsRef = useRef([]);
  const [api, setApi] = useState(null);
  const [isHeld, setIsHeld] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await GetProjectDetails(projectId);
        setProjectData(response.data);

        if (
          response.data &&
          response.data.localities &&
          response.data.localities.length > 0
        ) {
          setLocation(response.data.localities);
        }
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  useEffect(() => {
    if (!api || isHeld) return;

    const autoSlideTimer = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(autoSlideTimer);
  }, [api, isHeld]);

  useEffect(() => {
    if (location.length > 0) {
      setTimeout(() => {
        const calculateEqualHeight = () => {
          cardsRef.current.forEach((card) => {
            if (card) {
              card.style.height = "auto";
            }
          });

          let maxHeight = 0;
          cardsRef.current.forEach((card) => {
            if (card && card.offsetHeight > maxHeight) {
              maxHeight = card.offsetHeight;
            }
          });

          if (maxHeight > 0) {
            cardsRef.current.forEach((card) => {
              if (card) {
                card.style.height = `${maxHeight}px`;
              }
            });
          }
        };

        calculateEqualHeight();

        window.addEventListener("resize", calculateEqualHeight);

        return () => {
          window.removeEventListener("resize", calculateEqualHeight);
        };
      }, 100);
    }
  }, [location]);

  const scrollPrev = () => {
    if (api) {
      api.scrollPrev();
    }
  };

  const scrollNext = () => {
    if (api) {
      api.scrollNext();
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (isLoading) {
    return (
      <section className="lg:py-16 lg:px-[7.5%] px-2">
        <p className="text-center py-12">Loading location highlights...</p>
      </section>
    );
  }

  if (!location || location.length === 0) {
    return (
      <section className="lg:py-16 py-6 lg:px-[7.5%] px-2">
        <div className="flex-1 w-full order-1 lg:order-2">
          <h2
            className="lg:text-start text-center mb-6 lg:text-[32px] lg:font-bold lg:leading-[44px] text-nbr-black02 font-roboto
                       text-[26px] leading-[35px] tracking-[0%] font-bold lg:tracking-normal"
          >
            Location Highlights
          </h2>
          <div className="text-center">No location highlights provided</div>
        </div>
      </section>
    );
  }

  const showNavigation = location.length > 4;
  const useCarouselView = location.length > 4;

  const renderLocationCard = (highlight, index) => (
    <div
      ref={(el) => (cardsRef.current[index] = el)}
      className="flex flex-col h-full"
    >
      <div className="relative w-full aspect-video">
        {highlight.fileUrl ? (
          <Image
            src={`${API_URL}${highlight.fileUrl}`}
            alt={highlight?.location || "Location highlight"}
            fill
            onError={(e) => {
              console.error("Image failed to load:", highlight.fileUrl);
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>
      <div
        className="bg-white p-6 flex flex-col gap-4 flex-grow"
        style={{ border: "1px solid #E5E5E5" }}
      >
        <div
          className="text-nbr-black03 font-roboto text-[16px] leading-[26px] tracking-[0.5px] font-normal text-left space-y-2
                [&_ul]:list-disc [&_ul]:pl-5 
                [&_ol]:list-decimal [&_ol]:pl-5 
                [&_li]:mb-2 
                [&_a]:text-blue-600 [&_a]:underline 
                [&_strong]:font-bold 
                [&_em]:italic 
                [&_u]:underline 
                [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold"
        >
          {highlight?.location
            ? parse(highlight.location)
            : "No description available"}
        </div>
      </div>
    </div>
  );

  const getFixedLayoutJustifyClass = () => {
    if (location.length <= 3) return "lg:justify-center";
    return "lg:justify-start";
  };

  const renderFixedLayout = () => (
    <div
      className={`hidden lg:flex lg:flex-row lg:flex-wrap ${getFixedLayoutJustifyClass()} lg:gap-3`}
    >
      {location.map((highlight, index) => (
        <div
          key={index}
          className="lg:basis-1/4 lg:max-w-[calc(25%-12px)] pl-0 "
        >
          {renderLocationCard(highlight, index)}
        </div>
      ))}
    </div>
  );

  const renderCarouselLayout = () => (
    <div className="hidden lg:block relative">
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 1,
          loop: true,
        }}
        setApi={setApi}
        className="w-full pl-0"
      >
        <CarouselContent
          className="flex-nowrap ml-0"
          onMouseDown={() => setIsHeld(true)}
          onMouseUp={() => setIsHeld(false)}
          onMouseLeave={() => setIsHeld(false)}
        >
          {location.map((highlight, index) => (
            <CarouselItem
              key={index}
              className="lg:basis-1/4 pl-0 pr-3 flex-grow-0 flex-shrink-0"
            >
              {renderLocationCard(highlight, index)}
            </CarouselItem>
          ))}
        </CarouselContent>

        {showNavigation && (
          <div className="absolute top-[30%] left-5 right-5 flex items-center justify-between z-10">
            <div
              className="cursor-pointer rounded-full bg-white"
              onClick={scrollPrev}
              style={{ border: "1px solid #E5E5E5" }}
            >
              <PreviousIcon />
            </div>
            <div
              className="cursor-pointer rounded-full bg-white"
              onClick={scrollNext}
              style={{ border: "1px solid #E5E5E5" }}
            >
              <NextIcon />
            </div>
          </div>
        )}
      </Carousel>
    </div>
  );

  const renderMobileContent = () => (
    <div className="flex flex-wrap justify-center gap-3 lg:hidden">
      {location.map((highlight, index) => (
        <div
          key={index}
          className="w-full sm:w-[calc(50%-0.5rem)] flex flex-col"
        >
          {renderLocationCard(highlight, index)}
        </div>
      ))}
    </div>
  );

  return (
    <section className="lg:py-16 lg:px-[7.5%] px-2">
      <div className="flex-1 w-full order-1 lg:order-2">
        <p
          className="lg:text-start text-center mb-6 lg:text-[32px] lg:font-bold lg:leading-[44px] text-nbr-black02 font-roboto
                     text-[26px] leading-[35px] tracking-[0%] font-bold lg:tracking-normal"
        >
          Location Highlights
        </p>

        {useCarouselView ? renderCarouselLayout() : renderFixedLayout()}

        {renderMobileContent()}
      </div>
    </section>
  );
}
