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
import { X } from "lucide-react";
import { useParams } from "next/navigation";
import { GetProjectDetails } from "@/api/apis";
import AboutProjectSection from "./AboutProject";
import AboutAmenitiesSection from "./Amenities";
import PlanSection from "./PlanSection";
import LocationSection from "./LocationSection";
import LocationHighlights from "./LocationHighlights";

export default function ProjectDetails() {
  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState();
  const [isMobile, setIsMobile] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHeld, setIsHeld] = useState(false);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [autoSlideTimer, setAutoSlideTimer] = useState(null);

  useEffect(() => {
    if (!api) return;

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateScrollState();

    api.on("select", updateScrollState);

    return () => {
      api.off("select", updateScrollState);
    };
  }, [api]);

  const params = useParams();
  const projectId = params.id;
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
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    handleSelect();
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || projectData?.images?.length <= 1 || isHeld) {
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
  }, [api, projectData, isHeld]);

  const resetAutoSlideTimer = useCallback(() => {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
    }

    if (api && projectData?.images?.length > 1 && !isHeld) {
      const timer = setInterval(() => {
        api.scrollNext();
      }, 5000);
      setAutoSlideTimer(timer);
    }
  }, [api, projectData, isHeld, autoSlideTimer]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (!projectId) {
          return;
        }

        setLoading(true);
        const response = await GetProjectDetails(projectId);
        setProjectData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
    resetAutoSlideTimer();
  }, [api, resetAutoSlideTimer]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
    resetAutoSlideTimer();
  }, [api, resetAutoSlideTimer]);

  const openFullscreen = (imageUrl, index) => {
    setFullscreenImage(imageUrl);
    setFullscreenIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    setFullscreenIndex(null);
    document.body.style.overflow = "";
  };

  const navigateFullscreen = (direction) => {
    if (fullscreenIndex === null || !projectData?.images) return;

    const totalImages = projectData.images.length;
    let newIndex;

    if (direction === "next") {
      newIndex = (fullscreenIndex + 1) % totalImages;
    } else {
      newIndex = (fullscreenIndex - 1 + totalImages) % totalImages;
    }

    setFullscreenImage(`${API_URL}${projectData.images[newIndex].fileUrl}`);
    setFullscreenIndex(newIndex);
    resetAutoSlideTimer();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (fullscreenImage) {
        if (e.key === "Escape") {
          closeFullscreen();
        } else if (e.key === "ArrowRight") {
          navigateFullscreen("next");
        } else if (e.key === "ArrowLeft") {
          navigateFullscreen("prev");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenImage, fullscreenIndex, projectData]);

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        Loading project details...
      </div>
    );
  }

  const projectImages = projectData?.images || [];

  // Handle case with no images
  if (projectImages.length === 0) {
    return (
      <div>
        <section className="relative w-full lg:h-[33vw]">
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <p className="text-lg text-gray-500">
              No images available for this project
            </p>
          </div>
        </section>
        <AboutProjectSection projectId={projectId} />
        <AboutAmenitiesSection projectId={projectId} />
        <PlanSection projectId={projectId} />
        <LocationSection projectId={projectId} />
        <LocationHighlights projectId={projectId} />
      </div>
    );
  }

  if (projectImages.length === 1) {
    return (
      <div>
        <section className="relative w-full lg:h-[33vw] h-[50vh]">
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={() =>
              openFullscreen(`${API_URL}${projectImages[0].fileUrl}`, 0)
            }
          >
            <Image
              src={`${API_URL}${projectImages[0].fileUrl}`}
              alt="Property image"
              fill
            />
          </div>
        </section>

        {fullscreenImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center">
            <div className="absolute top-4 right-4 z-10">
              <button
                className="text-white p-2 rounded-full"
                onClick={closeFullscreen}
              >
                <X size={24} />
              </button>
            </div>
            <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-auto my-auto">
              <Image
                src={fullscreenImage}
                alt="Fullscreen property image"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        <AboutProjectSection projectId={projectId} />
        <AboutAmenitiesSection projectId={projectId} />
        <PlanSection projectId={projectId} />
        <LocationSection projectId={projectId} />
        <LocationHighlights projectId={projectId} />
      </div>
    );
  }

  const renderCarouselContent = () => {
    if (isMobile) {
      // Mobile: Always one image per slide
      return projectImages.map((image, index) => (
        <CarouselItem
          key={index}
          className="h-full w-full overflow-hidden pl-4"
        >
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={() => openFullscreen(`${API_URL}${image.fileUrl}`, index)}
          >
            <Image
              src={`${API_URL}${image.fileUrl}`}
              alt={`Property image ${index + 1}`}
              fill
            />
          </div>
        </CarouselItem>
      ));
    } else {
      // Desktop: Handle different image counts
      if (projectImages.length === 1) {
        // Single image: Full width
        return (
          <CarouselItem className="h-full w-full overflow-hidden p-0">
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={() =>
                openFullscreen(`${API_URL}${projectImages[0].fileUrl}`, 0)
              }
            >
              <Image
                src={`${API_URL}${projectImages[0].fileUrl}`}
                alt="Property image"
                fill
              />
            </div>
          </CarouselItem>
        );
      } else if (projectImages.length === 2) {
        // Two images: Equal width (50% each)
        return (
          <CarouselItem className="h-full w-full overflow-hidden p-0">
            <div className="flex w-full h-full gap-4">
              {projectImages.map((image, index) => (
                <div
                  key={index}
                  className="relative w-1/2 h-full overflow-hidden cursor-pointer"
                  onClick={() =>
                    openFullscreen(`${API_URL}${image.fileUrl}`, index)
                  }
                >
                  <Image
                    src={`${API_URL}${image.fileUrl}`}
                    alt={`Property image ${index + 1}`}
                    fill
                  />
                </div>
              ))}
            </div>
          </CarouselItem>
        );
      } else if (projectImages.length === 3) {
        // Three images: Equal width (33.333% each)
        return (
          <CarouselItem className="h-full w-full overflow-hidden pl-4">
            <div className="flex w-full h-full gap-4">
              {projectImages.map((image, index) => (
                <div
                  key={index}
                  className="relative flex-1 h-full overflow-hidden cursor-pointer"
                  onClick={() =>
                    openFullscreen(`${API_URL}${image.fileUrl}`, index)
                  }
                >
                  <Image
                    src={`${API_URL}${image.fileUrl}`}
                    alt={`Property image ${index + 1}`}
                    fill
                  />
                </div>
              ))}
            </div>
          </CarouselItem>
        );
      } else {
        // More than 3 images: One image per slide, show 3 at once
        return projectImages.map((image, index) => (
          <CarouselItem
            key={index}
            className="h-full overflow-hidden pl-4"
            style={{ flexBasis: "33.333%" }}
          >
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={() =>
                openFullscreen(`${API_URL}${image.fileUrl}`, index)
              }
            >
              <Image
                src={`${API_URL}${image.fileUrl}`}
                alt={`Property image ${index + 1}`}
                fill
              />
            </div>
          </CarouselItem>
        ));
      }
    }
  };

  // Determine if we should show navigation buttons
  const showNavigationButtons =
    projectImages.length > 1 && (isMobile || projectImages.length > 3);

  return (
    <div>
      <section className="relative w-full lg:h-[33vw] h-[50vh]">
        <Carousel
          key={isMobile ? "mobile" : "desktop"}
          className="w-full h-full"
          setApi={setApi}
          opts={{
            duration: 60,
            loop: true,
          }}
        >
          <CarouselContent
            className="h-full lg:h-[33vw] h-[50vh]"
            onMouseDown={() => setIsHeld(true)}
            onMouseUp={() => setIsHeld(false)}
            onMouseLeave={() => setIsHeld(false)}
            onTouchStart={() => setIsHeld(true)}
            onTouchEnd={() => setIsHeld(false)}
          >
            {renderCarouselContent()}
          </CarouselContent>

          {showNavigationButtons && (
            <>
              {isMobile ? (
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
                  <button className="p-2" onClick={scrollPrev}>
                    <PreviousIcon />
                  </button>
                  <button className="p-2 text-white" onClick={scrollNext}>
                    <NextIcon />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 z-20 ${
                      canScrollPrev
                        ? "cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={canScrollPrev ? scrollPrev : undefined}
                    disabled={!canScrollPrev}
                  >
                    <PreviousIcon />
                  </button>
                  <button
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 z-20 ${
                      canScrollNext
                        ? "cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={canScrollNext ? scrollNext : undefined}
                    disabled={!canScrollNext}
                  >
                    <NextIcon />
                  </button>
                </>
              )}
            </>
          )}
        </Carousel>
      </section>

      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center">
          <div className="absolute top-4 right-4 z-10">
            <button
              className="text-white p-2  rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              onClick={closeFullscreen}
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-auto my-auto">
            <Image
              src={fullscreenImage}
              alt="Fullscreen property image"
              fill
              className="object-contain"
            />
          </div>

          {projectImages.length > 1 && (
            <>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
                <button
                  className="text-white p-3 rounded-full hover:bg-opacity-70"
                  onClick={() => navigateFullscreen("prev")}
                >
                  <PreviousIcon />
                </button>
                <button
                  className="text-white p-3 rounded-full hover:bg-opacity-70"
                  onClick={() => navigateFullscreen("next")}
                >
                  <NextIcon />
                </button>
              </div>

              <div className="absolute bottom-2 left-0 right-0 text-center text-white text-sm">
                {fullscreenIndex !== null
                  ? `${fullscreenIndex + 1} / ${projectImages.length}`
                  : ""}
              </div>
            </>
          )}
        </div>
      )}

      <AboutProjectSection projectId={projectId} />
      <AboutAmenitiesSection projectId={projectId} />
      <PlanSection projectId={projectId} />
      <LocationSection projectId={projectId} />
      <LocationHighlights projectId={projectId} />
    </div>
  );
}
