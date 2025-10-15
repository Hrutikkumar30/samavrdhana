import parse from "html-react-parser";
import { useEffect, useState, useRef } from "react";
import { GetProjectDetails } from "@/api/apis";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function AboutProjectSection({ projectId }) {
  const [projectData, setProjectData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descriptionRef = useRef(null);
  const router = useRouter();

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;

      try {
        const response = await GetProjectDetails(projectId);
        setProjectData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjectData();
  }, [projectId]);

  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(descriptionRef.current).lineHeight
      );
      const height = descriptionRef.current.scrollHeight;
      const lines = Math.round(height / lineHeight);

      setShowReadMore(lines > 8);
    }
  }, [projectData]);

  const handleNavigate = () => {
    router.push("/home");
  };

  if (!projectData) {
    return (
      <div className="py-16 text-center">No project information available</div>
    );
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const displayFeatures =
    projectData.features && projectData.features.length > 0
      ? projectData.features.map((feature) => ({
          id: feature.id || "",
          title: feature.title || "",
          fileUrl: feature.fileUrl || "",
        }))
      : [];

  const descriptionContent = () => {
    const parsedDescription = parse(
      projectData?.description ?? "no description"
    );

    if (!showReadMore) {
      return <div>{parsedDescription}</div>;
    }

    return (
      <>
        <div
          className={isExpanded ? undefined : "line-clamp-[8] overflow-hidden"}
        >
          {parsedDescription}
        </div>{" "}
        <span
          onClick={toggleReadMore}
          className="text-nbr-green font-medium cursor-pointer inline-block"
        >
          {isExpanded ? "Read less" : "Read more"}
        </span>
      </>
    );
  };

  const FeatureCard = ({ feature }) => (
    <div className="bg-[#67BD4A0D] p-4 rounded flex flex-col gap-3 items-center justify-center text-center">
      {feature?.fileUrl ? (
        <div>
          <Image
            src={`${API_URL}/${feature?.fileUrl}`}
            alt={feature.title}
            width={70}
            height={70}
          />
        </div>
      ) : (
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-xs text-gray-500">Icon</span>
        </div>
      )}
      <p className="font-roboto font-medium text-[14px] leading-[24px] tracking-[0.5px] text-center text-nbr-green">
        {feature?.title}
      </p>
    </div>
  );

  return (
    <div className="py-16 lg:px-[7.5%] px-2">
      <nav aria-label="Breadcrumb" className="mb-5">
        <ol className="flex flex-wrap items-center gap-0 text-sm font-bold md:text-base">
          <li>
            <button
              className="whitespace-nowrap text-gray-600 hover:text-black hover:underline transition-colors"
              onClick={() => router.push("/home")}
            >
              Home
            </button>
          </li>
          <li className="mx-1 text-gray-400" aria-hidden="true">
            <IoIosArrowForward className="text-xs" />
          </li>
          <li>
            <button
              className="whitespace-nowrap text-gray-600 hover:text-black hover:underline transition-colors"
              onClick={() => router.push("/projects")}
            >
              Our Projects
            </button>
          </li>
          <li className="mx-1 text-gray-400" aria-hidden="true">
            <IoIosArrowForward className="text-xs" />
          </li>
          <li>
            <span
              className="whitespace-nowrap text-gray-900"
              aria-current="page"
            >
              Project Detail
            </span>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row items-start gap-[50px]">
        <div className="lg:flex-1 w-full lg:order-2">
          <div className="flex flex-col lg:gap-[61px] gap-[23px]">
            <div className="flex flex-col gap-4">
              <h1
                className="text-center lg:text-left lg:text-[32px] lg:font-bold lg:leading-[44px] text-nbr-black02 font-roboto
                         text-[26px] leading-[35px] tracking-[0%] font-bold lg:tracking-normal"
              >
                {projectData?.name}
              </h1>
              <div
                ref={descriptionRef}
                className="text-nbr-black03 font-roboto text-[16px] leading-[32px] tracking-[0.5px] font-normal text-center lg:text-left 
             [&_ul]:list-disc [&_ul]:mx-auto [&_ul]:w-fit lg:[&_ul]:mx-0 lg:[&_ul]:w-auto [&_ul]:pl-5
             [&_ol]:list-decimal [&_ol]:mx-auto [&_ol]:w-fit lg:[&_ol]:mx-0 lg:[&_ol]:w-auto [&_ol]:pl-5
             [&_li]:mb-2 [&_li]:text-left"
              >
                {descriptionContent()}
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full lg:flex-1 order-2 lg:order-2">
          <div className="flex flex-col items-center gap-4">
            {displayFeatures.length === 0 ? (
              <div className="text-center py-8">No features available</div>
            ) : displayFeatures.length === 1 ? (
              <div className="w-full flex justify-center">
                <FeatureCard feature={displayFeatures[0]} />
              </div>
            ) : displayFeatures.length === 3 ? (
              <>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {displayFeatures.slice(0, 2).map((feature, index) => (
                    <FeatureCard key={feature.id || index} feature={feature} />
                  ))}
                </div>
                <div className="w-full flex justify-center">
                  <FeatureCard feature={displayFeatures[2]} />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 w-full">
                {displayFeatures.map((feature, index) => (
                  <FeatureCard key={feature.id || index} feature={feature} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
