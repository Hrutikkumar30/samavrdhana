import { useState, useEffect, useRef } from "react";
import { GetProjectDetails } from "@/api/apis";
import Image from "next/image";
import { PreviousIcon, NextIcon } from "../projects/icons";

export default function AboutAmenitiesSection({ projectId }) {
  const [isMobile, setIsMobile] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

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

        if (response.data && response.data.amenities) {
          setAmenities(response.data.amenities);
        } else {
          // If amenities field doesn't exist or is null/empty
          setAmenities([]);
        }
      } catch (err) {
        console.error(err);
        setAmenities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  // Manual carousel navigation
  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const hasSingleAmenity = amenities.length === 1;
  const showNavigationIcons = amenities.length > 1;

  // Prepare content based on loading and data state
  const renderAmenitiesContent = () => {
    if (isLoading) {
      return <div className="py-8 text-center">Loading amenities...</div>;
    }

    if (!amenities || amenities.length === 0) {
      return <div className="py-8 text-center">No amenities added</div>;
    }

    return (
      <>
        {/* Desktop View - Grid Layout */}
        <div className="hidden lg:grid grid-cols-5 gap-4 py-4 w-[85%]">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="p-2 rounded flex gap-2 items-center justify-start text-center"
              style={{ border: "1px solid #E5E5E5" }}
            >
              {amenity.fileUrl ? (
                <div className="relative">
                  <Image
                    src={`${baseUrl}${amenity?.fileUrl}`}
                    alt={amenity.title}
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              )}
              <p className="text-nbr-black04 font-roboto font-medium text-[14px] leading-[24px] tracking-[0.5px] whitespace-nowrap overflow-hidden text-ellipsis">
                {amenity?.title}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile View - Centered Single Amenity or Carousel */}
        <div className="lg:hidden py-4">
          {hasSingleAmenity ? (
            // Centered single amenity for mobile
            <div className="flex justify-center">
              <div className="w-3/5">
                <div
                  className="p-4 rounded flex gap-3 items-center h-full"
                  style={{ border: "1px solid #E5E5E5" }}
                >
                  {amenities[0].fileUrl ? (
                    <div className="relative w-[5vh] h-[5vh]">
                      <Image
                        src={`${baseUrl}/${amenities[0].fileUrl}`}
                        alt={amenities[0].title}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  )}
                  <p className="text-nbr-black04 whitespace-nowrap font-roboto font-medium text-[16px] leading-[30px] tracking-[0.5px]">
                    {amenities[0].title}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Multiple amenities carousel
            <>
              <div
                ref={carouselRef}
                className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="snap-start flex-shrink-0 w-3/5 mr-4"
                  >
                    <div
                      className="p-4 rounded flex gap-3 items-center h-full"
                      style={{ border: "1px solid #E5E5E5" }}
                    >
                      {amenity.fileUrl ? (
                        <div className="relative">
                          <Image
                            src={`${baseUrl}/${amenity?.fileUrl}`}
                            alt={amenity.title}
                            width={30}
                            height={30}
                            // className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      )}
                      <p className="text-nbr-black04 whitespace-nowrap overflow-hidden text-ellipsis font-roboto font-medium text-[16px] leading-[30px] tracking-[0.5px]">
                        {amenity?.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {showNavigationIcons && (
                <div className="flex justify-center mt-4 pb-4">
                  <div
                    className="cursor-pointer mx-2 rounded-full h-10 w-10 flex items-center justify-center"
                    onClick={scrollPrev}
                    style={{ border: "1px solid #E5E5E5" }}
                  >
                    <PreviousIcon />
                  </div>
                  <div
                    className="cursor-pointer mx-2 rounded-full h-10 w-10 flex items-center justify-center"
                    onClick={scrollNext}
                    style={{ border: "1px solid #E5E5E5" }}
                  >
                    <NextIcon />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="lg:py-12 lg:px-[7.5%] px-2">
      <div className="flex flex-col lg:flex-row items-start gap-[50px]">
        <div className="lg:flex-1 w-full lg:order-2">
          <div className="flex flex-col lg:gap-[61px] gap-[23px]">
            <div className="flex flex-col gap-4">
              <p
                className="text-center lg:text-left lg:text-[32px] lg:font-bold lg:leading-[44px] text-nbr-black02 font-roboto
                           text-[26px] leading-[35px] tracking-[0%] font-bold lg:tracking-normal"
              >
                Key Amenities
              </p>
              <p className="text-nbr-black03 font-roboto text-[16px] leading-[32px] tracking-[0.5px] font-normal text-center lg:text-left">
                The well-designed space offers a range of premium amenities for
                your comfort and convenience.
              </p>
            </div>
          </div>

          {renderAmenitiesContent()}
        </div>
      </div>
    </div>
  );
}
