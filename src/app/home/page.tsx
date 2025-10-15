import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import UpcomingProjects from "@/components/home/UpcomingProjects";
import MediaSection from "@/components/home/MediaSection";
import CustomerSection from "@/components/home/CustomerSection";
import FaqSection from "@/components/home/FaqSection";

export default function Home() {
  return (
    <>
      <div>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <UpcomingProjects />
        <MediaSection />
        <CustomerSection />
        <FaqSection />
      </div>
    </>
  );
}
