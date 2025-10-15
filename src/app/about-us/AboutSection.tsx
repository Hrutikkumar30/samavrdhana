"use client";

import { GetAboutUsInfo } from "@/api/apis";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";

export default function AboutUsSection() {
  const [info, setInfo] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef(null);
  const [isLongContent, setIsLongContent] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchAboutUsInfo();
  }, []);

  useEffect(() => {
    if (info?.description) {
      const container = document.createElement("div");
      container.innerHTML = info.description;
      container.style.width = descriptionRef.current?.clientWidth + "px";
      container.style.lineHeight = "32px";
      container.style.position = "absolute";
      container.style.visibility = "hidden";
      document.body.appendChild(container);

      const height = container.clientHeight;
      const lineHeight = 32;
      const lines = Math.ceil(height / lineHeight);

      setIsLongContent(lines > 6);

      document.body.removeChild(container);
    }
  }, [info]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const fetchAboutUsInfo = async () => {
    try {
      const response = await GetAboutUsInfo();
      setInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const renderDescription = () => {
    if (!info?.description) return "No description available";

    if (!isLongContent) {
      return parse(info.description);
    }

    if (isExpanded) {
      return (
        <>
          {parse(info.description)}
          <span
            onClick={toggleExpanded}
            className="text-nbr-green font-medium cursor-pointer hover:underline ml-2 inline-block"
          >
            Read Less
          </span>
        </>
      );
    } else {
      return (
        <div className="relative">
          <div className="line-clamp-6 overflow-hidden">
            {parse(info.description)}
          </div>
          <span
            onClick={toggleExpanded}
            className="text-nbr-green font-medium cursor-pointer hover:underline ml-2 inline-block"
          >
            Read More
          </span>
        </div>
      );
    }
  };

  return (
    <>
      <section className="py-16 bg-white">
        <div className="lg:px-[7.5%] px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="relative lg:h-full h-[40vh] order-2 lg:order-1">
              {info?.image ? (
                <Image
                  src={`${API_URL}/${info?.image}`}
                  alt="samvardhana"
                  fill
                  className="rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 rounded">
                  No image available
                </div>
              )}
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex flex-col lg:gap-4 gap-[23px]">
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="w-[6%] h-[2px] bg-nbr-green mr-2"></div>
                  <span className=" text-[13px] font-semibold leading-[100%] text-nbr-green">
                    ABOUT US
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  <h2
                    className="text-center lg:text-left lg:text-[32px] lg:font-bold lg:leading-[44px] text-nbr-black02 font-roboto
                                 text-[26px] leading-[35px] tracking-[0%] font-bold lg:tracking-normal"
                  >
                    {info?.title}
                  </h2>

                  <div
                    ref={descriptionRef}
                    className="text-nbr-black03 font-roboto text-[16px] leading-[32px] tracking-[0.5px] font-normal lg:text-left text-center space-y-4 
                            [&_p]:mb-4 
                            [&_ul]:list-disc [&_ul]:pl-5 
                            [&_ol]:list-decimal [&_ol]:pl-5 
                            [&_li]:mb-2 
                            [&_a]:text-blue-600 [&_a]:underline 
                            [&_strong]:font-bold 
                            [&_em]:italic 
                            [&_u]:underline"
                  >
                    {renderDescription()}
                  </div>
                </div>
                <div className="flex justify-center lg:justify-start"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
