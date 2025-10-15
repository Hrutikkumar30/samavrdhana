import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { GetProjectDetails } from "@/api/apis";

export default function PlanSection({ projectId }) {
  const [projectData, setProjectData] = useState(null);
  const [plan, setPlan] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await GetProjectDetails(projectId);

        if (response.data) {
          setProjectData(response.data);

          if (response.data.masterPlan) {
            setPlan(response.data.masterPlan);
          }
        }
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const openFullscreen = (imageUrl) => {
    setFullscreenImage(imageUrl);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    document.body.style.overflow = "";
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (fullscreenImage && e.key === "Escape") {
        closeFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenImage]);

  if (isLoading) {
    return <div className="py-12 text-center">Loading Layout...</div>;
  }

  if (!projectData || !plan || !plan.fileUrl) {
    return <div className="py-12 text-center">No layout available</div>;
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const imageUrl = `${API_URL}${plan.fileUrl}`;

  return (
    <div className="lg:py-16 lg:px-[7.5%] px-2">
      <div className="flex flex-col gap-4">
        <p
          className="text-center lg:text-left lg:text-[32px] lg:font-bold lg:leading-[44px] text-nbr-black02 font-roboto
                     text-[26px] leading-[35px] tracking-[0%] font-bold lg:tracking-normal"
        >
          {plan.title}
        </p>
      </div>

      <div className="flex justify-center">
        <div
          className="relative lg:h-[55vw] h-[35vh] w-full lg:w-4/5 mx-auto cursor-pointer"
          onClick={() => openFullscreen(imageUrl)}
        >
          <Image
            src={imageUrl}
            alt={plan.title || "Master Plan"}
            className="mt-2"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw"
            onError={(e) => {
              console.error(imageUrl);
              e.currentTarget.style.display = "none";

              const parent = e.currentTarget.parentElement;
              if (parent) {
                const errorMsg = document.createElement("div");
                errorMsg.className = "py-12 text-center";
                errorMsg.textContent = "No layout available";
                parent.appendChild(errorMsg);
              }
            }}
          />
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center">
          <div className="absolute top-4 right-4 z-10">
            <button
              className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              onClick={closeFullscreen}
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-auto my-auto">
            <Image
              src={fullscreenImage}
              alt={plan.title || "Master Plan - Fullscreen"}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
