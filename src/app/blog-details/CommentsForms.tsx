"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ArrowRight } from "lucide-react";
import { AddCommentForm } from "@/api/apis";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  comments: z.string().optional(),
});

export default function CommentForm({ dark = false, blogId, onCommentPosted }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      comments: "",
    },
  });

  async function onSubmit(values) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await AddCommentForm(blogId, values);
      form.reset();
      setSuccess(true);

      if (typeof onCommentPosted === "function") {
        onCommentPosted();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit your comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldBackgroundColor = "#F7FBF6";

  return (
    <div
      className={`${
        dark ? "bg-nbr-navy text-white" : "bg-white text-nbr-navy"
      }`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
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
          </div>

          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-plus-jakarta font-normal text-[15px] leading-[22px] tracking-[-0.2px] mb-2 block text-nbr-black06">
                  Add Comments
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type Here"
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
            {isSubmitting ? "Posting..." : "Post"}{" "}
            <ArrowRight className="ml-2" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
