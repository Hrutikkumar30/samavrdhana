"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle } from "lucide-react";
import { AddContactUsForm } from "@/api/apis";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  city: z.string().optional(),
  message: z.string().optional(),
});

export default function ContactForm({ dark = false }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "+91",
      city: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await AddContactUsForm(values);

      setIsSubmitted(true);
      form.reset();
      form.setValue("phone", "+91");
    } catch (err) {
      console.error(err);
      setError("Failed to submit form. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldBackgroundColor = "#F7FBF6";

  if (isSubmitted) {
    return (
      <div
        className={`rounded-lg p-8 text-center ${
          dark ? "bg-nbr-navy text-white" : "bg-white text-nbr-navy"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <CheckCircle size={48} className="text-green-500" />
          <h1 className="text-xl font-semibold">
            Thank you for contacting us!
          </h1>
          <p>We have received your message and will get back to you soon.</p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              form.setValue("phone", "+91");
            }}
            className={`mt-4 ${
              dark
                ? "bg-white text-nbr-navy hover:bg-nbr-green/90"
                : "bg-nbr-green text-white hover:bg-nbr-green/90"
            }`}
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  const phoneInputCustomStyles = {
    ".react-tel-input .form-control": {
      paddingLeft: "52px !important",
    },
    ".react-tel-input .flag-dropdown": {
      borderRight: "none",
    },
    ".react-tel-input .selected-flag": {
      width: "45px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  return (
    <div
      className={`rounded-lg ${
        dark ? "bg-nbr-navy text-white" : "bg-white text-nbr-navy"
      }`}
    >
      {/* Add custom CSS to fix the flag and input text issue */}
      <style jsx global>{`
        .react-tel-input .form-control {
          padding-left: 52px !important;
        }
        .react-tel-input .selected-flag {
          width: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .react-tel-input .flag-dropdown {
          border-right: none;
        }
      `}</style>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-plus-jakarta font-normal text-[15px] leading-[22px] tracking-[-0.2px] mb-2 block text-nbr-black06">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter full name"
                    {...field}
                    className={`h-[52px] border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${
                      dark
                        ? "placeholder:text-nbr-darkGray"
                        : "placeholder:text-nbr-darkGray"
                    }`}
                    style={{ backgroundColor: fieldBackgroundColor }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-plus-jakarta font-normal text-[15px] leading-[22px] tracking-[-0.2px] mb-2 block text-nbr-black06">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      type="email"
                      {...field}
                      className={`h-[52px] border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${
                        dark
                          ? "placeholder:text-nbr-darkGray"
                          : "placeholder:text-nbr-darkGray"
                      }`}
                      style={{ backgroundColor: fieldBackgroundColor }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-plus-jakarta font-normal text-[15px] leading-[22px] tracking-[-0.2px] mb-2 block text-nbr-black06">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="phone-input-wrapper">
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field: { onChange, value, ref } }) => (
                          <PhoneInput
                            country={"in"}
                            value={value}
                            onChange={(phone) => onChange(phone)}
                            inputProps={{
                              ref: ref,
                              required: true,
                              className: `w-full h-[52px] border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${
                                dark
                                  ? "placeholder:text-nbr-darkGray"
                                  : "placeholder:text-nbr-darkGray"
                              }`,
                              style: {
                                backgroundColor: fieldBackgroundColor,
                                paddingLeft: "52px",
                              },
                            }}
                            containerStyle={{
                              width: "100%",
                            }}
                            inputStyle={{
                              width: "100%",
                              height: "52px",
                              backgroundColor: fieldBackgroundColor,
                              border: "none",
                              borderRadius: "0.375rem",
                              paddingLeft: "52px",
                            }}
                            buttonStyle={{
                              backgroundColor: fieldBackgroundColor,
                              border: "none",
                              borderRadius: "0.375rem 0 0 0.375rem",
                              position: "absolute",
                              left: 0,
                              top: 0,
                            }}
                            dropdownStyle={{
                              width: "300px",
                            }}
                            enableSearch={true}
                            preferredCountries={["in"]}
                            inputExtraProps={{
                              autoComplete: "tel",
                              name: "phone",
                            }}
                          />
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-plus-jakarta font-normal text-[15px] leading-[22px] tracking-[-0.2px] mb-2 block text-nbr-black06">
                  City
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter city"
                    {...field}
                    className={`h-[52px] border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${
                      dark
                        ? "placeholder:text-nbr-darkGray"
                        : "placeholder:text-nbr-darkGray"
                    }`}
                    style={{ backgroundColor: fieldBackgroundColor }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-plus-jakarta font-normal text-[15px] leading-[22px] tracking-[-0.2px] mb-2 block text-nbr-black06">
                  Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className={`min-h-[100px] border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${
                      dark
                        ? "placeholder:text-nbr-darkGray"
                        : "placeholder:text-nbr-darkGray"
                    }`}
                    style={{ backgroundColor: fieldBackgroundColor }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={`mt-6 ${
              dark
                ? "bg-white text-nbr-navy hover:bg-nbr-green/90"
                : "bg-nbr-green text-white hover:bg-nbr-green/90"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send "}{" "}
            <ArrowRight className="ml-1" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
