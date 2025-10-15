"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import googleImg from "../../assests/images/Google__G__logos.webp";
import { useState, useRef, useEffect } from "react";
import { Mail, LogOut } from "lucide-react";

export default function GoogleSignInButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (status === "loading") return null;

  if (status === "unauthenticated") {
    return (
      <button
        onClick={() => signIn("google", { prompt: "select_account" })}
        className="flex items-center justify-center md:justify-start space-x-2 lg:border lg:border-gray-300 px-2  rounded-md shadow-sm hover:shadow-md h-[44px]"
      >
        <div className="flex-shrink-0">
          <Image src={googleImg} alt="Google" width={19} height={19} />
        </div>
        <span className="hidden md:inline text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">
          Sign in with Google
        </span>
      </button>
    );
  }

  const emailInitial = session.user?.email?.charAt(0).toUpperCase() || "?";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold hover:shadow"
      >
        {emailInitial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2  bg-white border rounded-md shadow-lg z-50">
          <div className="px-4 py-3 text-sm text-gray-700 border-b flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            <p>{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/", redirect: true })}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
