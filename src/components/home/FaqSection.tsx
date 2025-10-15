"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import parse from "html-react-parser";
import { AccordianLessIcon, AccordianMoreIcon } from "@/app/projects/icons";
import { useState, useEffect } from "react";
import { GetFaqsInfo } from "@/api/apis";

export default function FaqSection() {
  const [faqs, setFaqs] = useState([]);
  const [openItem, setOpenItem] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await GetFaqsInfo();
        setFaqs(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFaqs();
  }, []);

  const handleAccordionChange = (value) => {
    setOpenItem(value === openItem ? null : value);
  };

  return (
    <section className="lg:py-16 py-2">
      <div className="flex flex-col lg:gap-[70px] gap-[36px] mx-auto w-full md:w-[70%] px-2 md:px-0">
        <div className="flex flex-col gap-4">
          <p className="font-roboto font-bold text-[26px] leading-[35px] tracking-[0] text-center text-nbr-black02 md:text-[32px] md:leading-[100%]">
            FAQs
          </p>
          <p className="lg:hidden font-roboto font-normal text-[16px] leading-[26px] tracking-[0.5px] text-center">
            Hear from our satisfied customers and clients.
          </p>
        </div>

        {faqs.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4"
            value={openItem}
            onValueChange={handleAccordionChange}
          >
            {faqs.map((faq, index) => {
              const itemValue = `item-${index}`;
              const isOpen = openItem === itemValue;

              return (
                <AccordionItem
                  key={faq.id}
                  value={itemValue}
                  className={`shadow-sm border-none transition-colors duration-200 ${
                    isOpen ? "bg-[#EBF1E9]" : "bg-[#F9FBF8]"
                  }`}
                >
                  <AccordionTrigger className="text-left py-4 px-4 md:px-6 hover:no-underline [&>svg]:hidden">
                    <div className="flex justify-between items-center w-full">
                      <span className="flex items-center gap-2">
                        <span className="font-roboto font-bold text-[30px] leading-[100%] tracking-[0] text-nbr-lighgreen2">
                          {index < 9 ? `0${index + 1}` : index + 1}
                        </span>
                        <span className="font-medium text-[18px] leading-[26px] md:leading-[100%]">
                          {faq?.question}
                        </span>
                      </span>

                      <span className="flex items-center ml-2">
                        {isOpen ? <AccordianLessIcon /> : <AccordianMoreIcon />}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="font-roboto font-medium text-[14px] leading-[24px] tracking-[0] text-nbr-black03 px-4 md:px-6">
                    <div
                      className="text-nbr-black03 font-roboto text-[16px] leading-[32px] tracking-[0.5px] font-normal text-left space-y-4 
  [&_p]:mb-4 
  [&_ul]:list-disc [&_ul]:pl-5 
  [&_ol]:list-decimal [&_ol]:pl-5 
  [&_li]:mb-2 
  [&_a]:text-blue-600 [&_a]:underline 
  [&_strong]:font-bold 
  [&_em]:italic 
  [&_u]:underline"
                    >
                      {parse(faq?.answer)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p className="text-center">No FAQs available at the moment.</p>
        )}
      </div>
    </section>
  );
}
