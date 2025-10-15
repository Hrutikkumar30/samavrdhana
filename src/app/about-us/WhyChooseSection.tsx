"use client";

import { GetWhyToChooseInfo } from "@/api/apis";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function WhyChooseSection() {
  const [chooseinfo, setChooseInfo] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchWhyToChooseInfo();
  }, []);

  const fetchWhyToChooseInfo = async () => {
    try {
      const response = await GetWhyToChooseInfo();
      setChooseInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getIconComponent = (iconUrl: string): JSX.Element => {
    return (
      <div className="relative w-6 h-6">
        <Image
          src={`${API_URL}/${iconUrl}`}
          alt="Icon"
          fill
          className="object-contain"
        />
      </div>
    );
  };

  return (
    <>
      <section className="py-16 bg-white lg:mt-64 mt-[330px]">
        <div className="lg:px-[7.5%] px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="flex flex-row lg:flex-row items-start gap-[45px]">
              <div className="flex flex-col w-full">
                <p
                  className="text-[26px] leading-[35px] tracking-[0%] text-center font-roboto font-bold text-nbr-black02 mb-6 
                     lg:text-[32px] lg:leading-[44px] lg:text-left lg:whitespace-nowrap"
                >
                  {chooseinfo?.heading}
                </p>
                <div className="flex flex-col gap-4">
                  {chooseinfo?.title1 && (
                    <div
                      style={{
                        backgroundColor: "#F5F5F580",
                        border: "1px solid #E5E5E5",
                        borderRadius: "3px",
                      }}
                    >
                      <div className="p-5">
                        <h2 className="flex items-center gap-[10px] font-roboto font-semibold text-[18px] leading-[32px] tracking-normal">
                          {chooseinfo?.icon1 &&
                            getIconComponent(chooseinfo?.icon1)}
                          {chooseinfo?.title1}
                        </h2>
                        <p className="font-roboto font-normal text-[16px] leading-[27px] tracking-[0.5px] lg:text-[16px] lg:leading-[30px] lg:tracking-normal">
                          {chooseinfo?.description1}
                        </p>
                      </div>
                    </div>
                  )}

                  {chooseinfo?.title2 && (
                    <div
                      style={{
                        backgroundColor: "#F5F5F580",
                        border: "1px solid #E5E5E5",
                        borderRadius: "3px",
                      }}
                    >
                      <div className="p-5">
                        <h2 className="flex items-center gap-[10px] font-roboto font-semibold text-[18px] leading-[32px] tracking-normal">
                          {chooseinfo?.icon2 &&
                            getIconComponent(chooseinfo?.icon2)}{" "}
                          {chooseinfo?.title2}
                        </h2>
                        <p className="font-roboto font-normal text-[16px] leading-[27px] tracking-[0.5px] lg:text-[16px] lg:leading-[30px] lg:tracking-normal">
                          {chooseinfo?.description2}
                        </p>
                      </div>
                    </div>
                  )}

                  {chooseinfo?.title3 && (
                    <div
                      style={{
                        backgroundColor: "#F5F5F580",
                        border: "1px solid #E5E5E5",
                        borderRadius: "3px",
                      }}
                    >
                      <div className="p-5">
                        <h2 className="flex items-center gap-[10px] font-roboto font-semibold text-[18px] leading-[32px] tracking-normal">
                          {chooseinfo?.icon3 &&
                            getIconComponent(chooseinfo?.icon3)}{" "}
                          {chooseinfo?.title3}
                        </h2>
                        <p className="font-roboto font-normal text-[16px] leading-[27px] tracking-[0.5px] lg:text-[16px] lg:leading-[30px] lg:tracking-normal">
                          {chooseinfo?.description3}
                        </p>
                      </div>
                    </div>
                  )}

                  {chooseinfo?.title4 && (
                    <div
                      style={{
                        backgroundColor: "#F5F5F580",
                        border: "1px solid #E5E5E5",
                        borderRadius: "3px",
                      }}
                    >
                      <div className="p-5">
                        <h2 className="flex items-center gap-[10px] font-roboto font-semibold text-[18px] leading-[32px] tracking-normal">
                          {chooseinfo?.icon4 &&
                            getIconComponent(chooseinfo.icon4)}{" "}
                          {chooseinfo?.title4}
                        </h2>
                        <p className="font-roboto font-normal text-[16px] leading-[27px] tracking-[0.5px] lg:text-[16px] lg:leading-[30px] lg:tracking-normal">
                          {chooseinfo?.description4}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="relative w-full h-[50vh] lg:h-full">
              {chooseinfo.mainImage && (
                <Image
                  src={`${API_URL}/${chooseinfo?.mainImage.replace(
                    "why_choose_image/",
                    "icon_image/"
                  )}`}
                  alt="Choose.png"
                  fill
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
