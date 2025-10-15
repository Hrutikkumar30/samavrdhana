"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../assests/images/Logos.webp";

function WelcomePage({ history }) {
  const router = useRouter();

  useEffect(() => {
    let timer = setTimeout(() => {
      router.push("");
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [history]);
  return (
    <>
      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0.5;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .fade-in-animation {
          animation: fade-in 3s;
        }
      `}</style>
      <div className="flex h-screen items-center justify-center">
        <Image src={logo} alt="logo" className="fade-in-animation" />
      </div>
    </>
  );
}
export default WelcomePage;
