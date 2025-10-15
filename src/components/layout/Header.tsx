"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import logo from "../../assests/images/Logos.webp";
import mobileLogo from "../../assests/images/Logos.webp";
import { MenuIcon, PhoneIcon } from "@/app/projects/icons";
import GoogleSignInButton from "../googleSignIn/page";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blogs" },
    { href: "/emi-calculator", label: "EMI Calculator" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="lg:px-[7.5%] px-4">
        <div className="flex items-center justify-between py-4">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-nbr-black z-50"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <span className="text-2xl font-bold">✕</span>
            ) : (
              <MenuIcon />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="relative z-50">
            <Image
              src={logo}
              alt="Samvardhana Properties logo"
              priority
              className="h-auto w-auto hidden lg:block"
            />
            <Image
              src={mobileLogo}
              alt="Samvardhana Properties mobile logo"
              priority
              className="h-auto w-auto lg:hidden"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center space-x-8"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-roboto text-[16px] leading-[20px] tracking-[0.1px] whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-nbr-orange font-bold"
                      : "text-nbr-black font-medium hover:text-nbr-orange"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section (Phone + Google Sign-In) */}
          <div className="flex items-center gap-4">
            <Button
              asChild
              className="bg-nbr-green hover:bg-nbr-green/90 text-white font-roboto h-[44px]"
            >
              <Link
                href="tel:+918050014145"
                className="flex items-center gap-1"
              >
                <PhoneIcon />
                <span>+91 80500 14145</span>
              </Link>
            </Button>
            <GoogleSignInButton />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 lg:hidden pt-24 px-6 overflow-y-auto">
          <nav
            className="flex flex-col space-y-6"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-roboto text-[16px] leading-[20px] tracking-[0.1px] ${
                    isActive
                      ? "text-nbr-orange font-bold"
                      : "text-nbr-black font-medium hover:text-nbr-orange"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
