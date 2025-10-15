"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/shared/ChatWidget";
import SessionWrapper from "@/components/sessionWrapper/SessionWrapper";
import logo from "@/assests/images/Logo.png";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <Image
              src={logo}
              alt="Samvardhana Properties Logo"
              className="mx-auto mb-4 animate-logo"
              //   id="logo"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <SessionWrapper>
      <Header />
      <main className="pt-20">{children}</main>
      <Footer />
      <ChatWidget />
    </SessionWrapper>
  );
}
