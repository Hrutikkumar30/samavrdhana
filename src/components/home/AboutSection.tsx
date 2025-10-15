"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { GetWhoWeAreInfo } from "@/api/apis";

export default function AboutSection() {
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchWhoWeAreInfo();
  }, []);

  const fetchWhoWeAreInfo = async () => {
    setIsLoading(true);
    try {
      const response = await GetWhoWeAreInfo();
      setInfo(response.data);
    } catch (err) {
      console.log(err);
      setInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Show message when loading
  if (isLoading) {
    return (
      <div className="py-16 lg:px-[7.5%] px-2">
        <p className="text-center text-lg text-gray-600">Loading content...</p>
      </div>
    );
  }

  // if (!info) {
  //   return (
  //     <div className="py-16 lg:px-[7.5%] px-2">
  //       <p className="text-center text-lg text-gray-600">
  //         No data is available
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="py-16 lg:px-[7.5%] px-2">
      <div className="flex flex-col lg:flex-row items-start gap-[50px]">
        <div className="relative w-full lg:flex-1 order-2 lg:order-1">
          <div className="block relative h-[400px] w-full">
            {info?.image1 ? (
              <Image
                src={`${API_URL}/${info?.image1}`}
                alt="samvardhana.png"
                fill
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">No image is available</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:flex-1 w-full lg:order-2">
          <div className="flex flex-col lg:gap-4 gap-[23px]">
            <div className="flex items-center justify-center lg:justify-start">
              <div className="w-[6%] h-[2px] bg-nbr-green mr-2"></div>
              <span className="text-[13px] font-semibold leading-[100%] text-nbr-green">
                WHO WE ARE
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <p
                className="text-center lg:text-left lg:text-[32px] lg:font-bold lg:leading-[44px] text-nbr-black02 font-roboto
                         text-[26px] leading-[35px] tracking-[0%] font-bold lg:tracking-normal"
              >
                {info?.title || "No title available"}
              </p>

              <p className="text-nbr-black03 font-roboto text-[16px] leading-[32px] tracking-[0.5px] font-normal text-center lg:text-left">
                {info?.description || "No description available"}
              </p>
            </div>
            <div className="flex justify-center lg:justify-start">
              <Button
                asChild
                className="bg-nbr-green hover:bg-nbr-green/90 text-white font-roboto"
              >
                <Link href="/about-us">
                  Know More <ArrowRight size={16} className="ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
