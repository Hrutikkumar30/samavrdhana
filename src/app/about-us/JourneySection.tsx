"use client";

import { useEffect, useState } from "react";
import parse from "html-react-parser";
import Image from "next/image";
import { X } from "lucide-react";
import {
  GetOurJourneyInfo,
  GetOurMissionInfo,
  GetOurVisionInfo,
} from "@/api/apis";
import propMobBgImg from "../../assests/images/JourneyMobile.png";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { NextIcon, PreviousIcon } from "../projects/icons";

export default function JourneySection() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [journeyInfo, setJourneyInfo] = useState(null);
  const [visionInfo, setVisionInfo] = useState(null);
  const [missionInfo, setMissionInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchOurJourneyInfo();
    fetchVisionInfo();
    fetchMissionInfo();
  }, []);

  const fetchOurJourneyInfo = async () => {
    try {
      const response = await GetOurJourneyInfo();
      if (response.data && response.data.length > 0) {
        setJourneyInfo(response.data[0]);
      } else if (response.data) {
        setJourneyInfo(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchVisionInfo = async () => {
    try {
      const response = await GetOurVisionInfo();

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setVisionInfo({
          id: response.data[0].id,
          title: response.data[0].title,
          content: response.data[0].description,
          image: response.data[0].image
            ? `${API_URL}/${response.data[0].image}`
            : img1,
        });
      } else if (response.data) {
        setVisionInfo({
          id: response.data.id,
          title: response.data.title,
          content: response.data.description,
          image: response.data.image
            ? `${API_URL}/${response.data.image}`
            : img1,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMissionInfo = async () => {
    try {
      const response = await GetOurMissionInfo();

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setMissionInfo({
          id: response.data[0].id,
          title: response.data[0].title,
          content: response.data[0].description,
          image: response.data[0].image
            ? `${API_URL}/${response.data[0].image}`
            : "",
        });
      } else if (response.data) {
        // Handle if response is a single object
        setMissionInfo({
          id: response.data.id,
          title: response.data.title,
          content: response.data.description,
          image: response.data.image ? `${API_URL}/${response.data.image}` : "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

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

  // Popup functionality
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
    if (!text) return "Content not available";

    const contentString = typeof text === "string" ? text : "";

    const maxCharsDesktop = 110 * 5;

    if (contentString.length <= maxCharsDesktop) {
      return typeof text === "string" && text.includes("<")
        ? parse(text)
        : text;
    }

    const truncatedContent = contentString.substring(0, maxCharsDesktop);
    let truncatedWithEllipsis = truncatedContent;

    const lastSpaceIndex = truncatedWithEllipsis.lastIndexOf(" ");
    if (lastSpaceIndex > 0) {
      truncatedWithEllipsis = truncatedWithEllipsis.substring(
        0,
        lastSpaceIndex
      );
    }

    const combinedContent = `${truncatedWithEllipsis}... <span class="text-nbr-green font-medium text-sm cursor-pointer inline read-more-link">Read more</span>`;

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

  return (
    <>
      <section className="relative lg:h-[40.7vw] h-[70vh] flex flex-col">
        <Image
          src={`${API_URL}/${journeyInfo?.image}`}
          alt="Background"
          layout="fill"
          className="hidden lg:block -z-10"
        />

        <Image
          src={`${API_URL}/${journeyInfo?.image}`}
          alt="Background Mobile"
          fill
          className="block lg:hidden -z-10"
        />

        <div className="lg:px-[7.5%] relative z-10 flex flex-row gap-4 lg:mt-[40px] mt-4 lg:max-w-[65%] w-full px-4">
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <p className="text-[26px] lg:text-[40px] leading-[44px] tracking-[0%] font-roboto font-bold text-white text-center lg:text-left">
              {journeyInfo?.title}
            </p>
            <div
              className="text-[16px] lg:text-[18px] lg:leading-[36px] leading-[24px] tracking-[0.5px] font-roboto font-normal text-white text-center lg:text-left mb-16 lg:mb-0 [&_p]:mb-4 
  [&_ul]:list-disc [&_ul]:pl-5 
  [&_ol]:list-decimal [&_ol]:pl-5 
  [&_li]:mb-2 
  [&_a]:text-blue-600 [&_a]:underline 
  [&_strong]:font-bold 
  [&_em]:italic 
  [&_u]:underline"
            >
              {parse(journeyInfo?.description ?? "")}
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 lg:bottom-0 bottom-[-80px] translate-y-1/2 z-20 flex justify-center gap-6 lg:w-[83%] w-full">
          <div className="lg:hidden w-full flex flex-col items-center">
            <Carousel className="p-2 h-full" setApi={setApi}>
              <CarouselContent>
                {[visionInfo, missionInfo]
                  .filter((card) => card)
                  .map((card, index) => (
                    <CarouselItem key={card?.id} className="w-full">
                      <div
                        className="bg-white overflow-hidden w-full h-full flex flex-col"
                        style={{
                          boxShadow:
                            "0px 16px 32px 0px #01132A14, 0px 4px 12px -4px #01132A14",
                        }}
                      >
                        <div className="relative h-[34vw]">
                          <Image
                            src={card?.image}
                            alt={card?.title}
                            layout="fill"
                          />
                        </div>

                        <div className="flex flex-col gap-4 pt-3 p-8">
                          <p className="text-[22px] leading-[100%] tracking-[0%] font-roboto font-bold text-nbr-black04">
                            {card?.title}
                          </p>
                          <div
                            className="text-[14px] leading-[26px] tracking-[0%] font-roboto font-medium text-nbr-black [&_p]:mb-4 
  [&_ul]:list-disc [&_ul]:pl-5 
  [&_ol]:list-decimal [&_ol]:pl-5 
  [&_li]:mb-2 
  [&_a]:text-blue-600 [&_a]:underline 
  [&_strong]:font-bold 
  [&_em]:italic 
  [&_u]:underline"
                          >
                            {truncateText(card?.content, card?.title)}
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
            </Carousel>

            {/* Navigation buttons for mobile */}
            <div className="flex justify-center">
              <div
                className="cursor-pointer mx-2 rounded-full"
                onClick={scrollPrev}
                style={{ border: "1px solid #E5E5E5" }}
              >
                <PreviousIcon />
              </div>
              <div
                className="cursor-pointer mx-2 rounded-full"
                onClick={scrollNext}
                style={{ border: "1px solid #E5E5E5" }}
              >
                <NextIcon />
              </div>
            </div>
          </div>

          {[visionInfo, missionInfo]
            .filter((card) => card)
            .map((card, index) => (
              <div
                key={card?.id}
                className="hidden lg:flex bg-white overflow-hidden w-full flex-col"
                style={{
                  boxShadow:
                    "0px 16px 32px 0px #01132A14, 0px 4px 12px -4px #01132A14",
                }}
              >
                <div className="relative h-[13.4vw]">
                  <Image
                    src={card?.image}
                    alt={card?.title}
                    layout="fill"
                    // objectFit="cover"
                  />
                </div>

                <div className="flex flex-col gap-4 pt-3 p-6">
                  <h2 className="text-[22px] leading-[100%] tracking-[0%] font-roboto font-bold text-nbr-black04">
                    {card?.title}
                  </h2>
                  <div
                    className="text-[14px] leading-[26px] tracking-[0%] font-roboto font-medium text-nbr-black [&_p]:mb-4 
  [&_ul]:list-disc [&_ul]:pl-5 
  [&_ol]:list-decimal [&_ol]:pl-5 
  [&_li]:mb-2 
  [&_a]:text-blue-600 [&_a]:underline 
  [&_strong]:font-bold 
  [&_em]:italic 
  [&_u]:underline"
                  >
                    {truncateText(card?.content, card?.title)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Popup for displaying full content */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">{popupTitle}</h3>
              <button
                onClick={closePopup}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            <div
              className="p-6 [&_p]:mb-4 
              [&_ul]:list-disc [&_ul]:pl-5 
              [&_ol]:list-decimal [&_ol]:pl-5 
              [&_li]:mb-2 
              [&_a]:text-blue-600 [&_a]:underline 
              [&_strong]:font-bold 
              [&_em]:italic 
              [&_u]:underline"
            >
              {parse(popupContent || "")}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
