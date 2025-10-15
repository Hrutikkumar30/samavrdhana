"use client";

import { useEffect, useState, useCallback } from "react";
import parse from "html-react-parser";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { NextIcon, PreviousIcon } from "@/app/projects/icons";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GetOurProjectInfo, GetProjectList } from "@/api/apis";

export default function ProjectsSection() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [info, setInfo] = useState({ title: "", description: "" });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  const [autoSlideTimer, setAutoSlideTimer] = useState(null);
  const router = useRouter();

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

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
  }, []);

  useEffect(() => {
    fetchProjects(activeTab);
  }, [activeTab]);

  const fetchOurProjectInfo = async () => {
    try {
      const response = await GetOurProjectInfo();
      setInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProjects = async (tab) => {
    setLoading(true);
    try {
      const status = tab === "ongoing" ? "Ongoing" : "Completed";

      const response = await GetProjectList(status);

      if (response?.data) {
        const filteredProjects = response.data.data.filter(
          (project) => project.status === status
        );
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

  useEffect(() => {
    if (!api || loading || projects.length <= 2 || isHeld) {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        setAutoSlideTimer(null);
      }
      return;
    }

    const timer = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    setAutoSlideTimer(timer);

    return () => {
      clearInterval(timer);
      setAutoSlideTimer(null);
    };
  }, [api, loading, projects, isHeld]);

  const resetAutoSlideTimer = useCallback(() => {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
    }

    if (api && !loading && projects.length > 2 && !isHeld) {
      const timer = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      }, 5000);
      setAutoSlideTimer(timer);
    }
  }, [api, loading, projects, isHeld, autoSlideTimer]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
    resetAutoSlideTimer();
  }, [api, resetAutoSlideTimer]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
    resetAutoSlideTimer();
  }, [api, resetAutoSlideTimer]);

  const showNavigationButtons = projects.length > 3;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const renderProjectCard = (project, index) => (
    <div
      key={project.id || index}
      className="flex flex-col cursor-pointer h-full"
      onClick={() => handleExploreProject(project)}
    >
      <div className="relative overflow-hidden group lg:h-[15vw] h-[55vw] rounded-t-md ">
        {project?.images && project?.images.length > 0 ? (
          <Image
            src={`${API_URL}${project?.images[0].fileUrl}`}
            alt={project?.name || "Project Image"}
            fill
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>

      <div
        className="bg-white flex flex-col pt-3 pr-5 pb-6 pl-5 gap-4 rounded-b-md flex-grow"
        style={{ border: "1px solid #E5E5E5" }}
      >
        <p className="font-roboto font-bold text-[22px] tracking-normal text-nbr-black04 whitespace-nowrap overflow-hidden text-ellipsis">
          {project?.name}
        </p>

        <div
          className="text-nbr-black03 font-roboto lg:text-[18px] text-[16px] lg:leading-[30px] leading-[26px] tracking-[0.5px] font-normal lg:text-left line-clamp-4 overflow-hidden  [&_p]:mb-4 
            [&_ul]:list-disc [&_ul]:pl-5 
            [&_ol]:list-decimal [&_ol]:pl-5 
            [&_li]:mb-2 
            [&_a]:text-blue-600 [&_a]:underline 
            [&_strong]:font-bold 
            [&_em]:italic 
            [&_u]:underline"
        >
          {parse(project?.description)}
        </div>

        <Button
          asChild
          className="bg-nbr-green hover:bg-nbr-green/90 text-white font-roboto w-[50%] lg:h-[48px] rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleExploreProject(project);
          }}
        >
          <Link href={`/project-details/${project.id}`}>
            Explore More
            <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <section>
      <div className="lg:py-16 lg:px-[7.5%] px-2 sm:justify-center">
        <div className="flex flex-col lg:gap-4 gap-[23px]">
          <div className="flex items-center justify-center lg:justify-start">
            <div className="w-[6%] h-[2px] bg-nbr-green mr-2"></div>
            <span className="text-[13px] font-semibold leading-[100%] text-nbr-green">
              OUR PROJECTS
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-center lg:text-left lg:text-[32px] lg:font-bold lg:leading-[44px] text-nbr-black02 font-roboto text-[26px] leading-[35px] tracking-[0%] font-bold lg:tracking-normal">
              {info?.title}
            </h2>

            <div
              className="text-nbr-black03 font-roboto lg:text-[18px] text-[16px] lg:leading-[30px] leading-[26px] tracking-[0.5px] font-normal text-center lg:text-left  [&_p]:mb-4 
              [&_ul]:list-disc [&_ul]:pl-5 
              [&_ol]:list-decimal [&_ol]:pl-5 
              [&_li]:mb-2 
              [&_a]:text-blue-600 [&_a]:underline 
              [&_strong]:font-bold 
              [&_em]:italic 
              [&_u]:underline"
            >
              {info?.description
                ? parse(info.description)
                : "no description available"}
            </div>
          </div>
          <div className="flex justify-center lg:justify-start gap-2">
            <Button
              variant={activeTab === "ongoing" ? "default" : "outline"}
              className={`h-[44px] rounded-[8px]   text-center align-middle font-medium text-sm leading-5 tracking-[0.1px] ${
                activeTab === "ongoing"
                  ? "bg-nbr-green text-white hover:bg-nbr-green/90"
                  : "bg-nbr-gray01 text-black hover:bg-nbr-gray01"
              }`}
              onClick={() => setActiveTab("ongoing")}
            >
              Ongoing Projects
            </Button>

            <Button
              variant={activeTab === "completed" ? "default" : "outline"}
              className={`h-[44px] rounded-[8px] text-center align-middle font-medium text-sm leading-5 tracking-[0.1px] ${
                activeTab === "completed"
                  ? "bg-nbr-green text-white hover:bg-nbr-green/90"
                  : "bg-nbr-gray01 text-black hover:bg-nbr-gray01"
              } font-roboto`}
              onClick={() => setActiveTab("completed")}
            >
              Completed Projects
            </Button>
          </div>
          <hr style={{ border: "1px solid #CCCCCC" }} />
        </div>

        {loading ? (
          <div className="text-center py-10">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-10">
            No projects found in this category.
          </div>
        ) : projects.length <= 2 ? (
          <div className="mt-8 lg:block hidden">
            <div className="flex flex-wrap justify-center w-full gap-6 items-stretch">
              {projects.map((project, index) => (
                <div
                  key={project.id || index}
                  className="lg:w-[30%] w-[85%] flex-grow-0 flex-shrink-0 flex flex-col"
                >
                  {renderProjectCard(project, index)}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {!loading &&
          projects.length > 0 &&
          (projects.length > 2 || window.innerWidth < 1024) && (
            <div className="w-auto lg:mr-[-7.4vw] lg:pr-0 overflow-visible mt-4">
              <Carousel
                opts={{
                  // align: "start",
                  slidesToScroll: 1,
                  loop: true,
                  duration: 60,
                }}
                setApi={setApi}
                className="w-full"
              >
                <CarouselContent
                  className="lg:-ml-6 -ml-2"
                  onMouseDown={() => setIsHeld(true)}
                  onMouseUp={() => setIsHeld(false)}
                  onMouseLeave={() => setIsHeld(false)}
                  onTouchStart={() => setIsHeld(true)}
                  onTouchEnd={() => setIsHeld(false)}
                >
                  {projects.map((project, index) => (
                    <CarouselItem
                      key={project.id || index}
                      className="lg:basis-[30%] basis-[80%] lg:pl-6 pl-2 flex-grow-0 flex-shrink-0 flex flex-col"
                    >
                      {renderProjectCard(project, index)}
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {showNavigationButtons && (
                  <div className="lg:absolute lg:top-[30%] lg:left-5 lg:right-20 lg:flex lg:items-center lg:justify-between hidden">
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

              {projects.length > 1 && (
                <div className="flex justify-center mt-4 mb-2 gap-4 lg:hidden">
                  <button
                    onClick={canScrollPrev ? scrollPrev : undefined}
                    className={`flex items-center justify-center rounded-full ${
                      canScrollPrev
                        ? "cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    style={{ border: "1px solid #E5E5E5" }}
                    disabled={!canScrollPrev}
                  >
                    <PreviousIcon />
                  </button>
                  <button
                    onClick={canScrollNext ? scrollNext : undefined}
                    className={`flex items-center justify-center rounded-full ${
                      canScrollNext
                        ? "cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    style={{ border: "1px solid #E5E5E5" }}
                    disabled={!canScrollNext}
                  >
                    <NextIcon />
                  </button>
                </div>
              )}
            </div>
          )}
      </div>
    </section>
  );
}
