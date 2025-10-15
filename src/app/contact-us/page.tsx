"use client";

import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import ContactForm from "@/components/shared/ContactForm";
import { MailIcon, OfficeLocationIcon, TelePhoneIcon } from "../projects/icons";
import FaqSection from "@/components/home/FaqSection";
import img1 from "../../assests/images/ContactUsMbBg.png";
import img2 from "../../assests/images/ContactUsBg.png";
import { useEffect, useState } from "react";
import { GetAllBannerImages, GetSupportContactUsInfo } from "@/api/apis";
import { useRouter } from "next/navigation";

export default function ContactUs() {
  const [bannerImages, setBannerImages] = useState({
    contactUsBannerImage: "",
    contactUsMobileBannerImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const [contactInfo, setContactInfo] = useState({
    supportEmail: "",
    supportPhone: "",
    address: "",
  });
  const router = useRouter();

  useEffect(() => {
    fetchBannerImages();
    fetchContactInfo();
  }, []);

  const fetchBannerImages = async () => {
    setIsLoading(true);
    try {
      const response = await GetAllBannerImages();
      if (response.data && response.data.length > 0) {
        const contactUsBanner = response.data.find(
          (item) => item.contactUsBannerImage
        );

        if (contactUsBanner) {
          setBannerImages({
            contactUsBannerImage: contactUsBanner.contactUsBannerImage,
            contactUsMobileBannerImage:
              contactUsBanner.contactUsMobileBannerImage ||
              contactUsBanner.contactUsBannerImage,
          });
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContactInfo = async () => {
    try {
      const response = await GetSupportContactUsInfo();

      if (response.data && response.data.length > 0) {
        // Handle if API returns an array
        const info = response.data[0];
        setContactInfo({
          supportEmail: info.supportEmail || "",
          supportPhone: info.supportPhone || "",
          address: info.address || "",
        });
      } else if (response.data) {
        // Handle if API returns a single object
        setContactInfo({
          supportEmail: response.data.supportEmail || "",
          supportPhone: response.data.supportPhone || "",
          address: response.data.address || "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const renderAddress = () => {
    if (!contactInfo.address) {
      return <span>Address not available</span>;
    }

    try {
      const parts = contactInfo.address.split(",");
      return (
        <>
          <div>
            {parts
              .slice(0, 3)
              .join(",")
              .trim()
              .replace(/<[^>]*>/g, "")}
            ,
          </div>
          <div>
            {parts
              .slice(3, 5)
              .join(",")
              .trim()
              .replace(/<[^>]*>/g, "")}
            ,
          </div>
          <div>
            {parts
              .slice(5)
              .join(",")
              .trim()
              .replace(/<[^>]*>/g, "")}
          </div>
        </>
      );
    } catch (error) {
      console.log(error);
      return <span>{contactInfo.address.replace(/<[^>]*>/g, "")}</span>;
    }
  };

  return (
    <div>
      <section className="relative lg:h-[25.3vw] h-[25vh] flex items-center">
        {isLoading ? (
          <div className="absolute inset-0 w-full h-full bg-gray-200 -z-10"></div>
        ) : bannerImages.contactUsBannerImage ? (
          <>
            <Image
              src={`${API_URL}/${bannerImages?.contactUsBannerImage}`}
              alt="Background"
              fill
              className="hidden lg:block -z-10 "
            />
            <Image
              src={`${API_URL}/${bannerImages?.contactUsBannerImage}`}
              alt="Background Mobile"
              fill
              className="block lg:hidden -z-10"
            />
            <div className="absolute inset-0"></div>
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-300 flex items-center justify-center -z-10">
            <p className="text-[16px] mt-12">
              Banner is not available for contactUs
            </p>
          </div>
        )}
        <div className="lg:px-[7.5%] px-2 relative z-10">
          <h1 className="text-[51.73px] leading-[100%] tracking-[0%] font-roboto font-bold  mb-4 lg:text-[80px] lg:leading-[100%] text-nbr-black09">
            Contact Us
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="lg:px-[7.5%] px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div
              style={{
                border: "1px solid #E3EAE2",
                padding: "26px",
                borderRadius: "10px",
              }}
            >
              <h2 className="font-roboto font-bold text-[32px] leading-[32px] tracking-normal text-nbr-black02 mb-8">
                Get in Touch
              </h2>
              <ContactForm />
            </div>

            <div>
              <div className="mb-8">
                <div className="h-[450px] relative rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62294.994645681206!2d77.7729913!3d13.0579706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae059d54a06701%3A0x1b9949a9903a6b5a!2sSamvardhana%20Properties!5e0!3m2!1sen!2sin!4v1714461900000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-roboto font-bold text-[22px] leading-[22px] tracking-normal text-nbr-black04 mb-2">
                  Support
                </h3>

                <div className="flex flex-wrap items-center gap-4">
                  {contactInfo?.supportEmail ? (
                    <p className="font-roboto font-medium text-base leading-[26px] tracking-normal text-nbr-black whitespace-nowrap">
                      <Link
                        href={`mailto:${contactInfo.supportEmail}`}
                        className="flex items-center gap-2"
                      >
                        <MailIcon /> {contactInfo.supportEmail}
                      </Link>
                    </p>
                  ) : (
                    <p className="font-roboto font-medium text-base leading-[26px] tracking-normal text-nbr-black whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <MailIcon /> No email available
                      </span>
                    </p>
                  )}

                  {contactInfo.supportPhone ? (
                    <p className="font-roboto font-medium text-base leading-[26px] tracking-normal text-nbr-black whitespace-nowrap">
                      <Link
                        href={`tel:${contactInfo.supportPhone}`}
                        className="flex items-center gap-2"
                      >
                        <TelePhoneIcon /> {contactInfo.supportPhone}
                      </Link>
                    </p>
                  ) : (
                    <p className="font-roboto font-medium text-base leading-[26px] tracking-normal text-nbr-black whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <TelePhoneIcon /> No phone number available
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <h3 className="font-roboto font-bold text-[22px] leading-[22px] tracking-normal text-nbr-black04 mb-4">
                Office Address
              </h3>
              <p className="flex items-start gap-4 font-roboto font-medium text-base leading-[26px] tracking-normal">
                <OfficeLocationIcon />
                <div
                  className="flex flex-col [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 
    [&_li]:mb-2 [&_a]:text-blue-600 [&_a]:underline [&_strong]:font-bold 
    [&_em]:italic [&_u]:underline [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3
    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2
    [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2
    [&_h4]:font-bold [&_h4]:mb-2
    [&_h5]:font-bold [&_h5]:text-sm [&_h5]:mb-1
    [&_h6]:font-bold [&_h6]:text-xs [&_h6]:mb-1"
                >
                  {contactInfo.address ? (
                    renderAddress()
                  ) : (
                    <span>Address not added</span>
                  )}
                </div>
              </p>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
    </div>
  );
}
