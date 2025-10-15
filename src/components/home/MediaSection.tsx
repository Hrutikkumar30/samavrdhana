"use client";

import { useEffect, useState } from "react";
import parse from "html-react-parser";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { X } from "lucide-react";
import { NextIcon, PreviousIcon } from "@/app/projects/icons";
import { GetOurServices, GetOurServicesInfo } from "@/api/apis";

export default function MediaSection() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [info, setInfo] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

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

  useEffect(() => {
    fetchOurProjectInfo();
    fetchServices();

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const fetchOurProjectInfo = async () => {
    try {
      const response = await GetOurServicesInfo();

      setInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await GetOurServices();
      setServices(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // Auto slide functionality
  useEffect(() => {
    if (!api || isHeld || showPopup) return;

    const timer = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    setAutoSlideTimer(timer);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [api, isHeld, showPopup]);

  // Function to reset auto slide timer
  const resetAutoSlideTimer = () => {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
    }

    if (!api || isHeld || showPopup) return;

    const newTimer = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    setAutoSlideTimer(newTimer);
  };

  const scrollPrev = () => {
    if (api) {
      api.scrollPrev();
      resetAutoSlideTimer(); // Reset timer when user manually navigates
    }
  };

  const scrollNext = () => {
    if (api) {
      api.scrollNext();
      resetAutoSlideTimer(); // Reset timer when user manually navigates
    }
  };

  const openPopup = (content, title) => {
    setPopupContent(content);
    setPopupTitle(title);
    setShowPopup(true);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setShowPopup(false);
    document.body.style.overflow = "auto";
  };

  const truncateText = (text, title) => {
    const contentString = typeof text === "string" ? text : "";
    const estimatedLines = contentString.length / 60;

    if (estimatedLines <= 5) {
      return parse(text || "no service description is given");
    }

    const truncated = contentString.substring(0, 250);

    const combinedContent = `${truncated}... <span class="text-nbr-green font-medium text-sm cursor-pointer read-more-link">Read more</span>`;

    const parsedContent = parse(combinedContent, {
      replace: (domNode) => {
        if (
          domNode.attribs &&
          domNode.attribs.class &&
          domNode.attribs.class.includes("read-more-link")
        ) {
          domNode.attribs.onClick = (e) => {
            e.stopPropagation();
            openPopup(text, title);
          };
          return domNode;
        }
      },
    });

    return parsedContent;
  };

  const showDesktopNavigation = services.length > 3;

  return (
    <section
      className="py-16 lg:px-[7.5%] px-2 sm:justify-center"
      style={{ backgroundColor: "#136C010A" }}
    >
      <div className="flex-1 w-full order-1 lg:order-2">
        <div className="flex flex-col lg:gap-4 gap-[23px]">
          <div className="flex items-center justify-center lg:justify-start">
            <div className="w-[6%] h-[2px] bg-nbr-green mr-2"></div>
            <span className="text-[13px] font-semibold leading-[100%] text-nbr-green">
              OUR SERVICES
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <p
              className="text-center lg:text-left lg:text-[32px] lg:font-bold lg:leading-[44px] text-nbr-black02 font-roboto
                         text-[26px] leading-[35px] tracking-[0%] font-bold lg:tracking-normal"
            >
              {info?.title}
            </p>

            <p className="text-nbr-black03 font-roboto lg:text-[18px] text-[16px] lg:leading-[30px] leading-[26px] tracking-[0.5px] font-normal text-center lg:text-left">
              {parse(info?.description || "no service description")}
            </p>
          </div>
        </div>
        <div className="w-auto lg:ml-0 lg:mr-[-7.4vw] lg:pr-0 overflow-visible mt-4">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <p>Loading services...</p>
            </div>
          ) : services && services.length > 0 ? (
            <Carousel
              opts={{
                // align: "start",
                slidesToScroll: 1,
                loop: true,
                duration: 60,
              }}
              setApi={setApi}
              className="lg:pl-0"
            >
              <CarouselContent
                className={`flex-nowrap -ml-4 ${
                  services.length === 1 ? "justify-center" : "justify-start"
                }`}
                onMouseDown={() => setIsHeld(true)}
                onMouseUp={() => setIsHeld(false)}
                onMouseLeave={() => setIsHeld(false)}
                onTouchStart={() => setIsHeld(true)}
                onTouchEnd={() => setIsHeld(false)}
              >
                {services.map((service, index) => {
                  const imageUrl = process.env.NEXT_PUBLIC_API_URL;

                  return (
                    <CarouselItem
                      key={service.id || index}
                      className={`${
                        services.length === 1
                          ? "lg:basis-[30%] basis-[90%]"
                          : "lg:basis-[30%] basis-[90%]"
                      } flex-grow-0 flex-shrink-0 ${
                        index === 0 ? "lg:ml-0" : ""
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        <div className="relative overflow-hidden group lg:h-[15vw] h-[55vw]">
                          {service.image && service.image.length > 0 ? (
                            <Image
                              src={`${imageUrl}/${service.image}`}
                              alt={service?.title || "Service image"}
                              fill
                              unoptimized={true}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <p className="text-gray-500">
                                No image available
                              </p>
                            </div>
                          )}
                        </div>
                        <div
                          className="bg-white p-6 flex flex-col flex-grow"
                          style={{ border: "1px solid #E5E5E5" }}
                        >
                          <h2 className="font-roboto font-bold text-[22px] tracking-normal text-nbr-black04">
                            {service?.title}
                          </h2>
                          <div className="flex-grow flex items-start mt-6">
                            <div
                              className="font-roboto font-medium text-[14px] tracking-normal [&_p]:mb-4 
                [&_ul]:list-disc [&_ul]:pl-5 
                [&_ol]:list-decimal [&_ol]:pl-5 
                [&_li]:mb-2 
                [&_a]:text-blue-600 [&_a]:underline 
                [&_strong]:font-bold 
                [&_em]:italic 
                [&_u]:underline"
                            >
                              {truncateText(
                                service?.description,
                                service?.title
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              {(isMobile || showDesktopNavigation) && (
                <div className="mt-[23px] lg:absolute lg:top-[30%] lg:left-5 lg:right-20 lg:flex lg:items-center lg:justify-between flex justify-center">
                  <div
                    className={`mx-2 rounded-full ${
                      canScrollPrev
                        ? "cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={canScrollPrev ? scrollPrev : undefined}
                    style={{ border: "1px solid #E5E5E5" }}
                  >
                    <PreviousIcon />
                  </div>
                  <div
                    className={`mx-2 rounded-full ${
                      canScrollNext
                        ? "cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={canScrollNext ? scrollNext : undefined}
                    style={{ border: "1px solid #E5E5E5" }}
                  >
                    <NextIcon />
                  </div>
                </div>
              )}
            </Carousel>
          ) : (
            <div className="flex justify-center items-center h-60 bg-white rounded-lg shadow-sm">
              <p className="text-center text-nbr-black03 font-roboto text-lg">
                No services are available yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[45vw] lg:max-h-[45vw] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-xl font-bold text-nbr-black04">
                {popupTitle}
              </h2>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div
                className="font-roboto font-medium text-[16px] tracking-normal [&_p]:mb-4 
                [&_ul]:list-disc [&_ul]:pl-5 
                [&_ol]:list-decimal [&_ol]:pl-5 
                [&_li]:mb-2 
                [&_a]:text-blue-600 [&_a]:underline 
                [&_strong]:font-bold 
                [&_em]:italic 
                [&_u]:underline"
              >
                {parse(popupContent || "No description available")}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
