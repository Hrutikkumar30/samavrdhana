"use client";

import Image from "next/image";
import parse from "html-react-parser";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import mobileBg from "../../assests/images/ProjectsMbBg.png";
import Banner from "../../assests/images/Nofeature.webp";
import { GetOurProjectBanner, GetProjectList } from "@/api/apis";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Projects() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [bannerImages, setBannerImages] = useState({
    ourProjectBannerImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carouselStates, setCarouselStates] = useState({});
  const [isHeld, setIsHeld] = useState(false);

  useEffect(() => {
    if (projects.length > 0) {
      setCarouselStates((prev) => {
        const newStates = { ...prev };

        projects.forEach((project) => {
          if (!project.id || newStates[project.id]) return;

          newStates[project.id] = {
            api: null,
            currentIndex: 0,
          };
        });

        return newStates;
      });
    }
  }, [projects]);

  const setCarouselApi = useCallback((projectId, api) => {
    if (!projectId) return;

    setCarouselStates((prev) => {
      // Only update if the API actually changed
      if (prev[projectId]?.api === api) return prev;

      return {
        ...prev,
        [projectId]: {
          ...prev[projectId],
          api,
        },
      };
    });
  }, []);

  const handleCarouselChange = useCallback((projectId) => {
    setCarouselStates((prev) => {
      const state = prev[projectId];
      if (!state || !state.api) return prev;

      const currentSlide = state.api.selectedScrollSnap();

      return {
        ...prev,
        [projectId]: {
          ...state,
          currentIndex: currentSlide,
        },
      };
    });
  }, []);

  useEffect(() => {
    const autoSlideTimers = {};

    Object.entries(carouselStates).forEach(([projectId, state]) => {
      if (state.api && !isHeld) {
        autoSlideTimers[projectId] = setInterval(() => {
          if (state.api) {
            state.api.scrollNext();
            handleCarouselChange(projectId);
          }
        }, 4000);
      }
    });

    return () => {
      Object.values(autoSlideTimers).forEach((timer) => clearInterval(timer));
    };
  }, [carouselStates, isHeld, handleCarouselChange]);

  const handleDotClick = useCallback((projectId, dotIndex, e) => {
    e.preventDefault();
    e.stopPropagation();

    setCarouselStates((prev) => {
      const state = prev[projectId];
      if (!state || !state.api) return prev;

      state.api.scrollTo(dotIndex);

      return {
        ...prev,
        [projectId]: {
          ...state,
          currentIndex: dotIndex,
        },
      };
    });
  }, []);

  const router = useRouter();

  useEffect(() => {
    fetchBannerImages();
  }, []);

  useEffect(() => {
    fetchProjects(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!api) return;

    const onChange = () => {
      if (api) {
        const currentSlide = api.selectedScrollSnap();
        setCurrentIndex(currentSlide);
      }
    };

    api.on("select", onChange);

    return () => {
      api.off("select", onChange);
    };
  }, [api]);

  useEffect(() => {
    if (!api || isHeld) return;

    const autoSlideTimer = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(autoSlideTimer);
  }, [api, isHeld]);

  const fetchBannerImages = async () => {
    setIsLoading(true);
    try {
      const response = await GetOurProjectBanner();
      if (response?.data && response.data.length > 0) {
        const projectBanner = response.data[0];

        if (projectBanner) {
          setBannerImages({
            ourProjectBannerImage: projectBanner.ourProjectBannerImage,
          });
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async (tab) => {
    setLoading(true);
    try {
      const response = await GetProjectList();

      if (response?.data?.data) {
        let filteredProjects = [];

        switch (tab) {
          case "featured":
            filteredProjects = response.data.data.filter(
              (project) => project.status === "Featured"
            );
            break;
          case "ongoing":
            filteredProjects = response.data.data.filter(
              (project) => project.status === "Ongoing"
            );
            break;
          case "completed":
            filteredProjects = response.data.data.filter(
              (project) => project.status === "Completed"
            );
            break;
          default:
            filteredProjects = response.data.data;
        }

        setProjects(filteredProjects);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.log(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExploreProject = (project) => {
    router.push(`/project-details/${project.id}`);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div>
      <section className="relative lg:h-[25.3vw] h-[25vh] flex items-center">
        {isLoading ? (
          <div className="absolute inset-0 w-full h-full bg-gray-200 -z-10"></div>
        ) : bannerImages.ourProjectBannerImage ? (
          <>
            <Image
              src={`${API_URL}/our_project_banner/${bannerImages.ourProjectBannerImage}`}
              alt="Background"
              fill
              className="hidden lg:block -z-10"
            />

            <Image
              src={`${API_URL}/our_project_banner/${bannerImages.ourProjectBannerImage}`}
              alt="Background Mobile"
              fill
              className="block lg:hidden -z-10"
            />
            <div className="absolute inset-0"></div>
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-300 flex items-center justify-center -z-10">
            <h1 className="text-[16px] mt-12">
              Banner is not available for Project
            </h1>
          </div>
        )}

        <div className="nbr-container relative z-10">
          <h2 className="text-[51.73px] leading-[100%] tracking-[0%] font-roboto font-bold text-nbr-black09 mb-4 lg:text-[80px] lg:leading-[100%]">
            Our Projects
          </h2>
        </div>
      </section>

      <section className="lg:py-16 py-8">
        <div className="lg:px-[7.5%] px-4">
          <div className="flex flex-col lg:gap-4 gap-6 text-left md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <div className="w-[6%] h-[2px] bg-nbr-green mr-2"></div>
              <span className="text-[13px] font-semibold leading-[100%] text-nbr-green">
                OUR PROJECTS
              </span>
            </div>
            <div className="flex flex-col">
              <h2 className="lg:text-[32px] text-[26px] font-roboto font-bold lg:leading-[44px] leading-[35px] text-nbr-black02 mb-6 text-center lg:text-left">
                Welcome to Samvardhana Properties – Real Estate Projects &
                Developers !
              </h2>

              <p className="lg:text-[18px] text-[16px] lg:leading-[30px] leading-[26px] tracking-[0.5px] text-nbr-black03 font-roboto font-normal text-base text-center md:text-left">
                <span>Samvardhana Properties,</span> where modern living meets
                strategic locations and unparalleled amenities. Our projects are
                designed to offer sustainable, luxurious, and convenient living
                spaces that cater to diverse lifestyles. Explore our latest
                developments that promise a perfect blend of comfort, nature,
                and urban accessibility.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide pb-2 md:overflow-visible md:pb-0">
            <div className="flex gap-2 py-8 min-w-max md:pr-0">
              <Button
                variant={activeTab === "ongoing" ? "default" : "outline"}
                className={`h-[44px] rounded-[8px] text-center align-middle font-medium text-sm leading-5 tracking-[0.1px] ${
                  activeTab === "ongoing"
                    ? "bg-nbr-orange text-black hover:bg-nbr-orange/90"
                    : "bg-nbr-gray01 text-black hover:bg-nbr-gray01"
                }`}
                onClick={() => handleTabChange("ongoing")}
              >
                All Ongoing Projects
              </Button>
              <Button
                variant={activeTab === "featured" ? "default" : "outline"}
                className={`h-[44px] rounded-[8px] text-center align-middle font-medium text-sm leading-5 tracking-[0.1px] ${
                  activeTab === "featured"
                    ? "bg-nbr-orange text-black hover:bg-nbr-orange/90"
                    : "bg-nbr-gray01 text-black hover:bg-nbr-gray01"
                }`}
                onClick={() => handleTabChange("featured")}
              >
                Featured Projects
              </Button>
              <Button
                variant={activeTab === "completed" ? "default" : "outline"}
                className={`h-[44px] rounded-[8px] text-center align-middle font-medium text-sm leading-5 tracking-[0.1px] ${
                  activeTab === "completed"
                    ? "bg-nbr-orange text-black hover:bg-nbr-orange/90"
                    : "bg-nbr-gray01 text-black hover:bg-nbr-gray01"
                }`}
                onClick={() => handleTabChange("completed")}
              >
                Completed Projects
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div className="lg:px-[7.5%] px-4">
            {loading ? (
              <div className="text-center py-10">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="flex justify-center">
                <div className="flex flex-col items-center text-center py-10 text-lg font-medium ">
                  <Image
                    src={Banner}
                    alt="mobile background"
                    className="w-[131px] h-[131px] rounded-full object-cover mb-4 shadow-md"
                  />

                  <h3 className="mb-2 text-[22px] font-bold">
                    Projects is Not Available
                  </h3>
                  <p className="text-gray-500 text-[16px]">
                    No projects have been uploaded yet. Please visit again later
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6">
                {projects.map((project, index) => (
                  <Link
                    href={`/project-details/${project?.id || ""}`}
                    key={project?.id || index}
                    onClick={() => project?.id && handleExploreProject(project)}
                    className="flex flex-col cursor-pointer w-full sm:w-[48%] lg:w-[31%]"
                  >
                    <div className="relative overflow-hidden group lg:h-[19.3vw] h-[32vh]">
                      {project?.images &&
                      Array.isArray(project.images) &&
                      project.images.length > 0 ? (
                        <Carousel
                          setApi={(api) => {
                            if (project?.id) {
                              setCarouselApi(project.id, api);

                              if (api) {
                                api.off("scroll");
                                api.off("select");

                                api.on("scroll", () => {
                                  if (project?.id) {
                                    const currentSlide =
                                      api.selectedScrollSnap();
                                    setCarouselStates((prev) => ({
                                      ...prev,
                                      [project.id]: {
                                        ...prev[project.id],
                                        currentIndex: currentSlide,
                                      },
                                    }));
                                  }
                                });

                                api.on("select", () => {
                                  if (project?.id) {
                                    handleCarouselChange(project.id);
                                  }
                                });
                              }
                            }
                          }}
                          className="w-full h-full"
                          opts={{
                            slidesToScroll: 1,
                            loop: true,
                            dragFree: false,
                            duration: 40,
                          }}
                        >
                          <CarouselContent
                            className="h-full"
                            onMouseDown={() => setIsHeld(true)}
                            onMouseUp={() => setIsHeld(false)}
                            onMouseLeave={() => setIsHeld(false)}
                            onTouchStart={() => setIsHeld(true)}
                            onTouchEnd={() => setIsHeld(false)}
                          >
                            {project.images.map((image, imgIndex) => (
                              <CarouselItem key={imgIndex} className="h-full">
                                <div className="w-full lg:h-[19.3vw] h-[32vh] relative">
                                  <Image
                                    src={`${API_URL}${image.fileUrl}`}
                                    alt={`${project.name || "Project"} image ${
                                      imgIndex + 1
                                    }`}
                                    fill
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          {/* Only show dots if there's more than one image */}
                          {project.images.length > 1 && (
                            <div className="flex justify-center gap-2 mt-4 absolute bottom-4 left-0 right-0 z-10">
                              {project.images.map((_, dotIndex) => (
                                <button
                                  key={dotIndex}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    carouselStates[project.id]?.currentIndex ===
                                    dotIndex
                                      ? "bg-white scale-125"
                                      : "bg-gray-400 bg-opacity-70"
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDotClick(project.id, dotIndex, e);
                                  }}
                                  aria-label={`Go to image ${dotIndex + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </Carousel>
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <p className="text-gray-500">No image available</p>
                        </div>
                      )}
                    </div>
                    <div
                      className="bg-white flex flex-col pt-3 pr-5 pb-6 pl-5 gap-4 flex-grow"
                      style={{ border: "1px solid #E5E5E5" }}
                    >
                      <h4 className="font-roboto font-bold text-[22px] tracking-normal text-nbr-black04 whitespace-nowrap overflow-hidden text-ellipsis">
                        {project?.name || "Project Name"}
                      </h4>
                      <div
                        className="font-roboto font-medium text-[14px] tracking-normal line-clamp-4 overflow-hidden"
                        title={project?.description || ""}
                      >
                        {project?.description
                          ? parse(project.description)
                          : "No description available"}
                      </div>
                      <Link
                        href={
                          project?.id ? `/project-details/${project.id}` : "#"
                        }
                        passHref
                      >
                        <Button
                          className="bg-nbr-green  hover:bg-nbr-green/90 text-white font-roboto w-[50%] h-[48px] rounded-lg"
                          onClick={(e) => {
                            if (!project?.id) {
                              e.preventDefault();
                            } else {
                              handleExploreProject(project);
                            }
                          }}
                        >
                          Explore More
                          <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
