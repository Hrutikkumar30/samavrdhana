"use client";

import { WhatsappIcon } from "@/app/projects/icons";

export default function ChatWidget() {
  const phoneNumber = "918050014145";

  const openWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div>
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 lg:right-20 right-10 z-50 flex justify-end"
        aria-label="Chat with us"
      >
        <WhatsappIcon />
      </button>
    </div>
  );
}
