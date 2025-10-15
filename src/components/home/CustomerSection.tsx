"use client";

import React, { useEffect, useState, useRef } from "react";
import parse from "html-react-parser";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { NextIcon, PreviousIcon, VideoIcon } from "@/app/projects/icons";
import { GetCustomerReviewInfo } from "@/api/apis";
import { X } from "lucide-react";

export default function CustomerSection() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024
  );
  const [isHeld, setIsHeld] = useState(false);
  const [popupReviewId, setPopupReviewId] = useState(null);
  const [textOverflowing, setTextOverflowing] = useState({});
  const reviewRefs = useRef({});

  const isPlayingVideo = useRef(false);

  const lastVideoClickTime = useRef(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await GetCustomerReviewInfo();
        setTestimonials(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setTestimonials([]);
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const checkTextOverflow = () => {
    const newOverflowState = {};

    testimonials.forEach((testimonial) => {
      const element = reviewRefs.current[testimonial.id];
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        const lineHeightValue =
          computedStyle.lineHeight === "normal"
            ? parseInt(computedStyle.fontSize) * 1.2
            : parseFloat(computedStyle.lineHeight);

        const lineHeight =
          lineHeightValue === parseInt(lineHeightValue.toString())
            ? lineHeightValue
            : parseInt(computedStyle.fontSize) * lineHeightValue;

        const maxHeight = lineHeight * 5;

        newOverflowState[testimonial.id] = element.scrollHeight > maxHeight;
      }
    });

    setTextOverflowing(newOverflowState);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setTimeout(checkTextOverflow, 100);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!loading && testimonials.length > 0) {
      setTimeout(checkTextOverflow, 100);
      setTimeout(checkTextOverflow, 500);
    }
  }, [loading, testimonials]);

  useEffect(() => {
    if (api) {
      const handleScroll = () => {
        setTimeout(checkTextOverflow, 100);
      };

      api.on("scroll", handleScroll);

      return () => {
        api.off("scroll", handleScroll);
      };
    }
  }, [api]);

  useEffect(() => {
    if (
      !api ||
      testimonials.length <= 1 ||
      isHeld ||
      playingVideoId !== null ||
      isPlayingVideo.current
    )
      return;

    const autoSlideTimer = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(autoSlideTimer);
  }, [api, testimonials, isHeld, playingVideoId]);

  useEffect(() => {
    isPlayingVideo.current = playingVideoId !== null;
  }, [playingVideoId]);

  useEffect(() => {
    if (popupReviewId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [popupReviewId]);

  const scrollPrev = () => {
    if (playingVideoId) {
      setPlayingVideoId(null);
      isPlayingVideo.current = false;
    }

    if (api) {
      api.scrollPrev();
    }
  };

  const scrollNext = () => {
    if (playingVideoId) {
      setPlayingVideoId(null);
      isPlayingVideo.current = false;
    }

    if (api) {
      api.scrollNext();
    }
  };

  function isValidYouTubeUrl(url: string) {
    if (!url) return false;
    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;
    return regExp.test(url);
  }

  function extractYouTubeId(url: string) {
    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : "";
  }

  function getMediaUrl(testimonial) {
    if (isValidYouTubeUrl(testimonial.videoLink)) {
      return { type: "youtube", url: testimonial.videoLink };
    } else if (isValidYouTubeUrl(testimonial.image)) {
      return { type: "youtube", url: testimonial.image };
    } else if (testimonial.image && !isValidYouTubeUrl(testimonial.image)) {
      return { type: "image", url: testimonial.image };
    }
    return { type: "none", url: null };
  }

  const hasLongText = (text) => {
    if (!text) return false;
    const plainText = text.replace(/<[^>]*>/g, "");
    return plainText.length > 250;
  };

  const openReviewPopup = (id) => {
    setPopupReviewId(id);
  };

  const closeReviewPopup = () => {
    setPopupReviewId(null);
  };

  const handlePopupBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeReviewPopup();
    }
  };

  const handleScrollChange = () => {
    const now = Date.now();

    if (playingVideoId && now - lastVideoClickTime.current > 1000) {
      setPlayingVideoId(null);
    }

    setTimeout(checkTextOverflow, 100);
  };

  useEffect(() => {
    if (api) {
      api.on("scroll", handleScrollChange);

      return () => {
        api.off("scroll", handleScrollChange);
      };
    }
  }, [api, playingVideoId]);

  const handleVideoClick = (id, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    lastVideoClickTime.current = Date.now();

    setPlayingVideoId(id);
    isPlayingVideo.current = true;

    setIsHeld(true);

    if (api) {
      api.off("scroll", handleScrollChange);

      setTimeout(() => {
        api.on("scroll", handleScrollChange);
      }, 1000);
    }
  };

  const handleIframeLoad = () => {
    isPlayingVideo.current = true;
  };

  const isSingleTestimonial = testimonials.length === 1;
  const isTwoTestimonials = testimonials.length === 2;

  return (
    <div className="lg:py-16 py-6 lg:px-[7.5%] px-2 sm:justify-center flex flex-col lg:gap-[66px] gap-[36px]">
      <div className="flex flex-col items-center lg:gap-4 gap-[13px]">
        <p className="text-[26px] leading-[35px] whitespace-nowrap lg:text-[32px] lg:leading-[100%] tracking-[0%] text-center font-bold font-roboto text-nbr-black02">
          What our customers say?
        </p>
        <h2 className="text-center font-medium text-base leading-none text-nbr-black05 font-plus-jakarta">
          Hear from our satisfied customers and clients.
        </h2>
      </div>

      <div className="relative">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <p className="text-center text-nbr-black03 font-roboto text-lg">
              Loading reviews...
            </p>
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <Carousel
            opts={{
              align:
                isDesktop && (isSingleTestimonial || isTwoTestimonials)
                  ? "center"
                  : "start",
              loop: true,
              duration: 60,
              // Allow dragging even when video is playing
              draggable: true,
            }}
            className="w-full overflow-visible"
            setApi={setApi}
          >
            <CarouselContent
              className={`-ml-4 ${
                isDesktop && (isSingleTestimonial || isTwoTestimonials)
                  ? "flex justify-center"
                  : ""
              }`}
              onMouseDown={() => setIsHeld(true)}
              onMouseUp={() => setIsHeld(false)}
              onMouseLeave={() => setIsHeld(false)}
              onTouchStart={() => setIsHeld(true)}
              onTouchEnd={() => setIsHeld(false)}
            >
              {testimonials.map((testimonial) => {
                const media = getMediaUrl(testimonial);
                const shouldShowReadMore =
                  textOverflowing[testimonial.id] ||
                  hasLongText(testimonial.review);
                const isPlaying = playingVideoId === testimonial.id;

                return (
                  <CarouselItem
                    key={testimonial.id}
                    className={`pl-4 ${
                      isDesktop && isSingleTestimonial
                        ? "basis-[90%] sm:basis-[70%] md:basis-1/2 lg:basis-1/3 xl:basis-1/3"
                        : isDesktop && isTwoTestimonials
                        ? "basis-[90%] sm:basis-[70%] md:basis-[45%] lg:basis-[40%] xl:basis-[35%]"
                        : "basis-[90%] sm:basis-[90%] md:basis-1/2 lg:basis-1/2 xl:basis-1/3 2xl:basis-1/3"
                    }`}
                  >
                    <div
                      className="bg-white rounded-lg shadow-sm h-full flex flex-col"
                      style={{
                        border: "1.5px solid #E5E5E5",
                      }}
                    >
                      {media.type === "youtube" ? (
                        <div className="relative w-full lg:h-[12vw] h-[55vw]">
                          {isPlaying ? (
                            <iframe
                              className="w-full h-full"
                              src={`https://www.youtube.com/embed/${extractYouTubeId(
                                media.url
                              )}?autoplay=1&rel=0`}
                              title={testimonial.name}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              onLoad={handleIframeLoad}
                            ></iframe>
                          ) : (
                            <>
                              <Image
                                src={`https://img.youtube.com/vi/${extractYouTubeId(
                                  media.url
                                )}/hqdefault.jpg`}
                                alt={testimonial.name}
                                className="w-full h-full object-cover rounded-t-lg"
                                fill
                              />

                              <div
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="cursor-pointer p-4 focus:outline-none"
                                  onClick={(e) =>
                                    handleVideoClick(testimonial.id, e)
                                  }
                                  aria-label="Play video"
                                >
                                  <VideoIcon />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ) : media.type === "image" ? (
                        <div className="relative w-full lg:h-[12vw] h-[55vw]">
                          <Image
                            src={`${API_URL}/${media.url}`}
                            alt={testimonial.name}
                            className="w-full h-full rounded-t-lg"
                            fill
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full lg:h-[12vw] h-[55vw] bg-gray-200 rounded-t-lg">
                          <div className="text-center px-4">
                            <h3 className="font-bold text-2xl text-nbr-black02">
                              {testimonial.name}
                            </h3>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col items-center p-4 gap-4">
                        <h3 className="font-semibold text-xl text-nbr-black02 mb-3 text-center">
                          {testimonial?.name}
                        </h3>

                        <div className="w-full relative">
                          <div
                            ref={(el) =>
                              (reviewRefs.current[testimonial.id] = el)
                            }
                            className="text-nbr-gray02 font-roboto font-normal text-base leading-relaxed tracking-normal text-left line-clamp-4 overflow-hidden"
                          >
                            {parse(testimonial?.review)}
                          </div>

                          {shouldShowReadMore && (
                            <span
                              onClick={() => openReviewPopup(testimonial.id)}
                              className="mt-2 text-nbr-green font-medium cursor-pointer block"
                            >
                              Read more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {(testimonials.length > 3 && isDesktop) || !isDesktop ? (
              <div className="flex justify-center lg:gap-4 gap-2 mt-8">
                <div
                  className="cursor-pointer mx-2 rounded-full"
                  onClick={scrollPrev}
                  style={{ border: "1px solid #E5E5E5" }}
                >
                  <PreviousIcon desktopSpecialBg={true} />
                </div>
                <div
                  className="cursor-pointer mx-2 rounded-full"
                  onClick={scrollNext}
                  style={{ border: "1px solid #E5E5E5" }}
                >
                  <NextIcon desktopSpecialBg={true} />
                </div>
              </div>
            ) : null}
          </Carousel>
        ) : (
          <div className="flex justify-center items-center h-60 bg-white rounded-lg shadow-sm">
            <p className="text-center text-nbr-black03 font-roboto text-lg">
              Customers are yet to review
            </p>
          </div>
        )}
      </div>

      {/* Popup Modal for Review */}
      {popupReviewId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handlePopupBackdropClick}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[45vw] lg:max-h-[45vw] max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              onClick={closeReviewPopup}
              className="absolute top-4 right-4 text-nbr-black03 hover:text-nbr-black02"
            >
              <X size={24} />
            </button>

            {testimonials.find((t) => t.id === popupReviewId) && (
              <>
                <h3 className="font-semibold text-xl text-nbr-black02 mb-4 pr-8">
                  {testimonials.find((t) => t.id === popupReviewId).name}
                </h3>
                <div className="text-nbr-gray02 font-roboto font-normal text-base leading-relaxed tracking-normal">
                  {parse(
                    testimonials.find((t) => t.id === popupReviewId).review
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
