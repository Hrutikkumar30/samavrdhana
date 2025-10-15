import { GetProjectDetails } from "@/api/apis";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import img1 from "../../assests/images/Nisarga Vision City Location.jpeg";

export default function LocationSection({ projectId }) {
  const [projectData, setProjectData] = useState(null);
  const [locationImage, setLocationImage] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;

      try {
        const response = await GetProjectDetails(projectId);

        if (response.data) {
          setProjectData(response.data);

          if (response.data.locationImage) {
            setLocationImage(response.data.locationImage);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const openFullScreen = () => {
    setIsFullScreen(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    document.body.style.overflow = "auto";
  };

  // Close the modal when pressing ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeFullScreen();
      }
    };

    if (isFullScreen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isFullScreen]);

  return (
    <div>
      <section className="lg:py-16 py-6">
        <div className="lg:px-[7.5%]">
          <p className="font-roboto font-bold lg:text-[32px] text-[26px] lg:leading-[44px] leading-[35px] tracking-normal text-nbr-black02 mb-8 text-center lg:text-left">
            Location
          </p>

          <div
            className="relative rounded-lg overflow-hidden cursor-pointer"
            onClick={openFullScreen}
          >
            {locationImage ? (
              <div className="lg:h-[45vw] h-[50vh]">
                <Image
                  src={img1}
                  alt="Project Location Map"
                  className="w-full h-full object-contain"
                  fill
                />
              </div>
            ) : (
              <div className="text-center">no location provided</div>
            )}
          </div>
        </div>
      </section>

      {/* Full Screen Image Modal */}
      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeFullScreen}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white  z-10 p-2 rounded-full  hover:bg-white hover:bg-opacity-20 transition-colors"
              onClick={closeFullScreen}
            >
              <X size={24} />
            </button>

            {/* Image container */}
            <div className="relative w-[80%] h-full flex items-center justify-center">
              <Image
                src={img1}
                alt="Project Location Map"
                className="object-contain"
                fill
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
