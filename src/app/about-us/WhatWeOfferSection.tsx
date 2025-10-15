"use client";

import Image from "next/image";
import propBgImg from "../../assests/images/PropertiesBg.png";
import OfferingBgMbImg from "../../assests/images/OfferingMbBgImg.png";
import { GetWhatWeOfferInfo } from "@/api/apis";
import { useEffect, useState } from "react";

export default function WhatWeOfferSection() {
  const [offerinfo, setOfferInfo] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchWhatWeOfferInfo();
  }, []);

  const fetchWhatWeOfferInfo = async () => {
    try {
      const response = await GetWhatWeOfferInfo();
      setOfferInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createCardsFromResponse = (data) => {
    if (!data) return [];

    return [
      {
        title: data.title1,
        content: data.description1,
        image: `${API_URL}/${data.icon1}`,
      },
      {
        title: data.title2,
        content: data.description2,
        image: `${API_URL}/${data.icon2}`,
      },
      {
        title: data.title3,
        content: data.description3,
        image: `${API_URL}/${data.icon3}`,
      },
    ];
  };

  const cards = offerinfo ? createCardsFromResponse(offerinfo) : [];
  return (
    <>
      <section className="relative h-[50vh] md:h-[24.4vw] flex flex-col">
        <div className="absolute inset-0 w-full">
          <Image
            src={propBgImg}
            alt="Background"
            layout="fill"
            className="hidden lg:block"
          />
          <Image
            src={OfferingBgMbImg}
            alt="Background"
            layout="fill"
            className="block lg:hidden -z-10"
          />
        </div>

        <div className="relative z-10 flex justify-center mt-[40px]">
          <p className="lg:text-[40px] text-[26px] lg:leading-[44px] leading-[35px] tracking-[0%] font-roboto font-bold text-white">
            {offerinfo?.heading}
          </p>
        </div>

        <div
          className="lg:absolute relative left-0 right-0 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:bottom-0 lg:translate-y-1/2 
       z-20 flex flex-col md:flex-row justify-center items-stretch gap-4 w-full px-4 md:w-[87.6%] 
       mt-10 lg:mt-0 mx-auto"
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow-lg flex flex-col mb-4 md:mb-0 shadow-[0_4px_8px_rgba(0,0,0,0.15)]  mx-auto md:mx-0  md:flex-1 rounded-t-md "
            >
              <div className="relative lg:h-[11.6vw] h-[21.1vh] w-full flex items-center justify-center ">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={card?.image}
                    alt="cards"
                    className="object-contain"
                    fill
                    sizes="100vw"
                    style={{
                      maxWidth: "90%",
                      maxHeight: "80%",
                      margin: "auto",
                      display: "block",
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-3 p-5 items-center flex-grow">
                <h2
                  className="text-[16px] leading-[27px] tracking-[0.5%] font-roboto font-bold text-nbr-black04 
               lg:text-[18px] lg:leading-[32px] lg:font-semibold lg:text-center"
                >
                  {card?.title}
                </h2>
                <p
                  className="text-center text-[14px] leading-[22px] tracking-[0%] font-roboto font-medium text-nbr-black 
               lg:text-[16px] lg:leading-[27px] lg:tracking-[0.5px] lg:font-normal lg:text-center"
                >
                  {card?.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
