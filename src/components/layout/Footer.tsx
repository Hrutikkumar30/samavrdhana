import Link from "next/link";
import Image from "next/image";
import logo from "../../assests/images/Logo.png";
import fcbk from "../../assests/images/Facebook Icon.png";
import linkedIn from "../../assests/images/Linkedin Icon.png";
import insta from "../../assests/images/Instagram.png";
import x from "../../assests/images/Xicon.png";
import youtube from "../../assests/images/YouTube.png";

export default function Footer() {
  return (
    <footer className="lg:px-[7.5%] px-3">
      {/* Main Footer Section */}
      <div className="pt-16 pb-8 flex flex-col md:flex-row flex-1 justify-between md:gap-[88px] gap-8">
        {/* Logo & Description */}
        <div className="md:flex-[0.75_1_0%]">
          <Image src={logo} alt="Samvardhana Properties logo" priority />
          <p className="mt-[16px] text-nbr-black font-roboto font-normal text-[16px] leading-[26px]">
            Building sustainable communities for a better tomorrow. With a focus
            on eco-friendly developments and prime locations, we deliver
            residential and commercial spaces that inspire.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-[24px]">
          <h2 className="text-nbr-blue text-[18px] font-roboto font-bold">
            Quick Links
          </h2>
          <nav className="flex flex-col">
            <Link
              href="/"
              className="text-nbr-black block py-2 text-[16px] font-roboto font-medium hover:underline transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about-us"
              className="text-nbr-black block py-2 text-[16px] font-roboto font-medium hover:underline transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/projects"
              className="text-nbr-black block py-2 text-[16px] font-roboto font-medium hover:underline transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/contact-us"
              className="text-nbr-black block py-2 text-[16px] font-roboto font-medium hover:underline transition-colors"
            >
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Social Media */}
        <div className="flex flex-col gap-[24px] md:flex-[0.5_1_0%]">
          <h2 className="text-nbr-blue text-[18px] font-roboto font-bold">
            We are on Social Media
          </h2>
          <p className="text-nbr-black text-[16px] leading-[32px] font-roboto font-normal">
            Don’t miss our future updates! Follow us on social media.
          </p>

          <div className="flex space-x-4">
            <Link
              href="https://www.facebook.com/profile.php?id=61575802924970"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook page link"
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all"
            >
              <Image src={fcbk} alt="Facebook icon" />
            </Link>

            <Link
              href="https://www.linkedin.com/in/samvardhana-pro-33a752367/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile link"
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all"
            >
              <Image src={linkedIn} alt="LinkedIn icon" />
            </Link>

            <Link
              href="https://www.instagram.com/sphoskot/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram profile link"
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all"
            >
              <Image src={insta} alt="Instagram icon" />
            </Link>

            <Link
              href="https://x.com/Samvardhanpro"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter) profile link"
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all"
            >
              <Image src={x} alt="X (Twitter) icon" />
            </Link>

            <Link
              href="https://www.youtube.com/@SamvardhanaProperties"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube channel link"
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all"
            >
              <Image src={youtube} alt="YouTube icon" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="py-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
        <p className="font-roboto text-[14px] text-nbr-blue text-center md:text-left mt-4 md:mt-0">
          © 2025, Samvardhana Properties — All rights reserved.
        </p>

        <p className="font-roboto text-[14px] text-nbr-blue text-center md:text-left mt-4 md:mt-0">
          Powered by{" "}
          <a
            href="https://rayabharitech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-medium"
          >
            Rayabhari Tech
          </a>
        </p>

        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link
            href="/terms-conditions"
            className="font-roboto text-[14px] text-nbr-blue hover:underline font-medium"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/privacy-policy"
            className="font-roboto text-[14px] text-nbr-blue hover:underline font-medium"
          >
            Privacy Policy
          </Link>
          <Link
            href="/refund-policy"
            className="font-roboto text-[14px] text-nbr-blue hover:underline font-medium"
          >
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
