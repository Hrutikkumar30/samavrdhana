"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";
import {
  CommentIcon,
  CopyIcon,
  DisLikeIcon,
  LeftArrow,
  LikeIcon,
  RightArrow,
  ShareIcon,
} from "../projects/icons";
import { AddLike, AddUnlike, GetBlogsInfo } from "@/api/apis";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { signIn, useSession } from "next-auth/react";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  EmailShareButton,
  EmailIcon,
} from "react-share";

export default function BlogsCard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogData, setBlogData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [shareMenuVisible, setShareMenuVisible] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sharableLink, setSharableLink] = useState("");

  const { data: session, status } = useSession();
  const itemsPerPage = 5;
  const AUTO_SCROLL_INTERVAL = 4000; // Slide every 2 seconds
  const STAGGER_OFFSET = 1000; // 500ms delay per card (adjust for more/less variation)
  const useAutoScroll = true; // Set to false to disable auto-scroll entirely

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  // Fetch blogs with robust validation
  useEffect(() => {
    setIsLoading(true);
    const fetchBlogs = async () => {
      try {
        const response = await GetBlogsInfo();
        if (
          response &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          const blogsWithEngagement = response.data.data.map((blog) => ({
            ...blog,
            id:
              blog.id || `fallback-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
            like: blog.like || 0,
            unlike: blog.unlike || 0,
            blogImages: Array.isArray(blog.blogImages)
              ? blog.blogImages.filter((img) => img && img.image)
              : [], // Filter invalid images
            hasLikedByUser: (blog.blogUsers || []).some(
              (user) =>
                user.user.email === session?.user?.email && user.isLike === true
            ),
            hasUnlikedByUser: (blog.blogUsers || []).some(
              (user) =>
                user.user.email === session?.user?.email &&
                user.isLike === false
            ),
            title: blog.title || "Untitled",
            description: blog.description || "No description available",
            postByName: blog.postByName || "Unknown",
            postByImage: blog.postByImage || null,
            createdAt: blog.createdAt || new Date().toISOString(),
            commentCount: blog.commentCount || 0,
          }));
          setBlogData(blogsWithEngagement);
          setSharableLink(window.location.href);
          setTotalItems(response.total || response.data.data.length);
        } else {
          setBlogData([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [session?.user?.email]);

  // Handle click outside for share menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareMenuVisible !== null &&
        !event.target.closest(".share-menu-container")
      ) {
        setShareMenuVisible(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shareMenuVisible]);

  // Pagination logic
  const totalPages = Math.ceil((totalItems || blogData.length) / itemsPerPage);
  const currentItems = Array.isArray(blogData)
    ? blogData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 2) endPage = 4;
      else if (currentPage >= totalPages - 1) startPage = totalPages - 3;
      if (startPage > 2) pageNumbers.push("...");
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (endPage < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  // Share and copy logic
  const handleShareClick = (e, blogId) => {
    e.preventDefault();
    e.stopPropagation();
    setShareMenuVisible(shareMenuVisible === blogId ? null : blogId);
  };

  const copyLinkToClipboard = (e, blog) => {
    e.preventDefault();
    e.stopPropagation();
    if (!blog) return;
    const currentUrl = `${window.location.origin}/blog-details/${blog.id}`;
    const title = blog?.title || "Check out this blog post";
    const shareText = `${title}\n\nRead more: ${currentUrl}`;
    navigator.clipboard
      .writeText(shareText)
      .then(() => alert("Link copied to clipboard!"))
      .catch((err) => {
        console.error("Clipboard error:", err);
        const textArea = document.createElement("textarea");
        textArea.value = shareText;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          alert("Link copied to clipboard!");
        } catch (fallbackErr) {
          console.error("Fallback copy error:", fallbackErr);
          alert("Failed to copy link");
        }
        document.body.removeChild(textArea);
      })
      .finally(() => setShareMenuVisible(null));
  };

  const handleExploreProject = (blog) => {
    router.push(`/blog-details/${blog.id}`);
  };

  // Like and Unlike handlers
  const handleLikeClick = async (blog) => {
    if (!session || !session.user) {
      signIn("google");
      return;
    }
    try {
      const blogId = blog.id;
      const email = session.user.email;
      const response = await AddLike(blogId, email, true);
      setBlogData((prevData) =>
        prevData.map((item) => {
          if (item.id === blogId) {
            return {
              ...item,
              like: item.hasLikedByUser ? item.like : item.like + 1,
              unlike: item.hasUnlikedByUser ? item.unlike - 1 : item.unlike,
              hasLikedByUser: true,
              hasUnlikedByUser: false,
            };
          }
          return item;
        })
      );
      if (response.data.success === false) {
        setBlogData((prevData) =>
          prevData.map((item) => {
            if (item.id === blogId) {
              return {
                ...item,
                like: item.hasLikedByUser ? item.like - 1 : item.like,
                unlike: item.hasUnlikedByUser ? item.unlike : item.unlike,
                hasLikedByUser: false,
                hasUnlikedByUser: item.hasUnlikedByUser,
              };
            }
            return item;
          })
        );
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleUnLikeClick = async (blog) => {
    if (!session || !session.user) {
      signIn("google");
      return;
    }
    try {
      const blogId = blog.id;
      const email = session.user.email;
      const response = await AddUnlike(blogId, email, true);
      setBlogData((prevData) =>
        prevData.map((item) => {
          if (item.id === blogId) {
            return {
              ...item,
              unlike: item.hasUnlikedByUser ? item.unlike : item.unlike + 1,
              like: item.hasLikedByUser ? item.like - 1 : item.like,
              hasUnlikedByUser: true,
              hasLikedByUser: false,
            };
          }
          return item;
        })
      );
      if (response.data.success === false) {
        setBlogData((prevData) =>
          prevData.map((item) => {
            if (item.id === blogId) {
              return {
                ...item,
                unlike: item.hasUnlikedByUser ? item.unlike - 1 : item.unlike,
                like: item.hasLikedByUser ? item.like : item.like,
                hasUnlikedByUser: false,
                hasLikedByUser: item.hasLikedByUser,
              };
            }
            return item;
          })
        );
      }
    } catch (err) {
      console.error("Unlike error:", err);
    }
  };

  // BlogCard component for individual carousel management
  const BlogCard = ({ blog, index }) => {
    const [api, setApi] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHeld, setIsHeld] = useState(false);

    // Auto-scroll logic with stagger offset
    useEffect(() => {
      if (!api || isHeld || !useAutoScroll) return;

      // Stagger start: Delay by index * offset ms
      const staggerDelay = setTimeout(() => {
        const autoSlideTimer = setInterval(() => {
          if (api && !isHeld) {
            api.scrollNext();
          }
        }, AUTO_SCROLL_INTERVAL);

        // Cleanup timer on unmount or change
        return () => clearInterval(autoSlideTimer);
      }, index * STAGGER_OFFSET);

      return () => clearTimeout(staggerDelay);
    }, [api, isHeld, index]);

    // Sync currentIndex with carousel changes
    useEffect(() => {
      if (!api) return;

      const onChange = () => {
        if (api) {
          const currentSlide = api.selectedScrollSnap();
          setCurrentIndex(currentSlide);
        }
      };

      api.on("select", onChange);
      api.on("settle", onChange); // Additional settle event for stability

      return () => {
        api.off("select", onChange);
        api.off("settle", onChange);
      };
    }, [api]);

    const handleDotClick = (dotIndex, e) => {
      e.preventDefault();
      e.stopPropagation();
      if (api) {
        api.scrollTo(dotIndex);
        setCurrentIndex(dotIndex);
        // Pause auto-scroll briefly on manual navigation
        setIsHeld(true);
        setTimeout(() => setIsHeld(false), 100); // Short pause to prevent immediate next scroll
      }
    };

    return (
      <div key={blog.id}>
        <Link
          href={`/blog-details/${blog.id}`}
          onClick={() => blog?.id && handleExploreProject(blog)}
        >
          <div
            className={`flex flex-col-reverse lg:flex-row gap-[30px] ${
              index > 0 ? "mt-12" : ""
            }`}
            style={{ backgroundColor: "#FAF9F9" }}
          >
            <div className="relative w-full lg:w-[45%] lg:flex-grow-0 lg:flex-shrink-0 order-2 lg:order-1">
              {Array.isArray(blog.blogImages) && blog.blogImages.length > 1 ? (
                <Carousel
                  setApi={setApi}
                  className="w-full h-full"
                  opts={{
                    slidesToScroll: 1,
                    loop: true,
                    align: "start", // Ensure proper alignment to prevent misplacement
                  }}
                >
                  <CarouselContent
                    className="h-full"
                    onMouseDown={() => setIsHeld(true)}
                    onMouseUp={() => setIsHeld(false)}
                    onMouseLeave={() => setIsHeld(false)}
                    onTouchStart={() => setIsHeld(true)}
                    onTouchEnd={() => setIsHeld(false)}
                  >
                    {blog.blogImages.map((image, imgIndex) => (
                      <CarouselItem
                        key={`${blog.id}-image-${imgIndex}`} // Unique key per blog
                        className="h-[30vw] lg:h-[25vw]"
                      >
                        <div className="w-full h-full relative">
                          <Image
                            src={
                              image.image
                                ? `${API_URL}/${image.image}`
                                : "/placeholder-image.jpg"
                            }
                            alt={`blog image ${imgIndex + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 45vw"
                            className="" // Prevent weird stretching
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* Dots for navigation */}
                  <div className="flex justify-center gap-2 absolute bottom-4 left-0 right-0 z-10">
                    {blog.blogImages.map((_, dotIndex) => (
                      <button
                        key={`${blog.id}-dot-${dotIndex}`} // Unique key per blog
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentIndex === dotIndex
                            ? "bg-white scale-125"
                            : "bg-gray-400 bg-opacity-70"
                        }`}
                        onClick={(e) => handleDotClick(dotIndex, e)}
                        aria-label={`Go to image ${dotIndex + 1}`}
                      />
                    ))}
                  </div>
                </Carousel>
              ) : (
                <div className="w-full h-[30vw] lg:h-[25vw] relative">
                  <Image
                    src={
                      Array.isArray(blog.blogImages) &&
                      blog.blogImages.length > 0
                        ? `${API_URL}/${blog.blogImages[0].image}`
                        : "/placeholder-image.jpg"
                    }
                    alt="blog image"
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="lg:flex-1 lg:flex-grow w-full order-1 lg:order-2 pt-6">
              <div className="flex flex-col lg:gap-4 gap-[23px]">
                <div className="flex flex-col gap-4">
                  <h2
                    className="text-left lg:text-[36px] lg:font-bold lg:leading-[46px] text-nbr-black02 font-roboto
                    text-[26px] leading-[36px] tracking-[0%] font-bold lg:tracking-normal"
                  >
                    {blog?.title}
                  </h2>

                  <div
                    className="text-nbr-black03 font-roboto text-[16px] leading-[32px] tracking-[0.5px] font-normal text-left space-y-4 
                    [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2 
                    [&_a]:text-blue-600 [&_a]:underline [&_strong]:font-bold [&_em]:italic [&_u]:underline 
                    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2
                    [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h4]:font-bold [&_h4]:mb-2
                    [&_h5]:font-bold [&_h5]:text-sm [&_h5]:mb-1 [&_h6]:font-bold [&_h6]:text-xs [&_h6]:mb-1"
                  >
                    {blog?.description && blog.description.length > 150
                      ? parse(
                          `${blog.description.substring(
                            0,
                            150
                          )}... <span class="text-nbr-green">Read More</span>`
                        )
                      : parse(blog?.description || "")}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Image
                    src={
                      blog?.postByImage
                        ? `${API_URL}/${blog.postByImage}`
                        : "/placeholder-user.png"
                    }
                    alt="user.png"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="overflow-hidden">
                    <div className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis">
                      <h3 className="font-roboto font-normal text-[15px] leading-[160%] tracking-[0px] text-nbr-black10">
                        By {blog?.postByName}
                      </h3>
                      <span className="text-nbr-gray02 mx-1">•</span>
                      <h3 className="font-roboto font-normal text-[15px] leading-[160%] tracking-[0px] text-nbr-gray02 overflow-hidden text-ellipsis">
                        {new Date(blog?.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(blog?.createdAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between lg:px-0 px-2 lg:pr-4 pr-2 lg:pb-0 pb-4">
                  <div className="flex items-center my-auto gap-[26.75px]">
                    <div
                      className="flex items-center gap-[12.04px]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLikeClick(blog);
                      }}
                    >
                      <LikeIcon isActive={blog.hasLikedByUser} />
                      <h3 className="font-roboto font-normal text-[14px] leading-[100%] tracking-[0]">
                        {blog?.like}
                      </h3>
                    </div>
                    <div
                      className="flex items-center gap-[12.04px]"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnLikeClick(blog);
                      }}
                    >
                      <DisLikeIcon isActive={blog.hasUnlikedByUser} />
                      <h4 className="font-roboto font-normal text-[14px] leading-[100%] tracking-[0]">
                        {blog?.unlike}
                      </h4>
                    </div>
                    <div
                      className="flex items-center gap-[12.04px] cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/blog-details/${blog.id}#comments`;
                      }}
                    >
                      <CommentIcon />
                      <h4 className="font-roboto font-normal text-[14px] leading-[100%] tracking-[0]">
                        {blog?.commentCount}
                      </h4>
                    </div>
                  </div>
                  <div
                    className="relative share-menu-container"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={(e) => handleShareClick(e, blog.id)}
                    >
                      <ShareIcon />
                    </div>

                    {/* Share Menu Popup */}
                    {shareMenuVisible === blog.id && (
                      <div className="absolute right-0 bottom-10 bg-white shadow-lg rounded-md p-2 z-10 min-w-[200px]">
                        <div className="flex flex-col gap-4">
                          <FacebookShareButton
                            url={sharableLink}
                            quote={blog.title}
                          >
                            <div className="flex items-center gap-2">
                              <FacebookIcon size={24} round />
                              <span>Facebook</span>
                            </div>
                          </FacebookShareButton>

                          <LinkedinShareButton
                            url={sharableLink}
                            title={blog.title}
                            summary={blog.description?.substring(0, 150) || ""}
                            source="Samvardhana Properties – Real Estate Projects & Developers"
                          >
                            <div className="flex items-center gap-2">
                              <LinkedinIcon size={24} round />
                              <span>LinkedIn</span>
                            </div>
                          </LinkedinShareButton>

                          <TwitterShareButton
                            url={sharableLink}
                            title={blog.title}
                            hashtags={[blog.title.split(" ")[0]]}
                            via="SamvardhanaProps"
                          >
                            <div className="flex items-center gap-2">
                              <TwitterIcon size={24} round />
                              <span>Twitter</span>
                            </div>
                          </TwitterShareButton>

                          <WhatsappShareButton
                            url={sharableLink}
                            title={`${
                              blog.title
                            } - ${blog.description.substring(0, 50)}...`}
                            separator=" | "
                          >
                            <div className="flex items-center gap-3">
                              <WhatsappIcon size={28} round />
                              <span>WhatsApp</span>
                            </div>
                          </WhatsappShareButton>

                          <EmailShareButton
                            url={sharableLink}
                            subject={blog.title}
                            body="Checkout this Blog:"
                          >
                            <div className="flex items-center gap-3">
                              <EmailIcon size={26} round />
                              <span>Email</span>
                            </div>
                          </EmailShareButton>

                          <div
                            className="p-1 rounded flex items-center gap-2"
                            onClick={(e) => copyLinkToClipboard(e, blog)}
                          >
                            <CopyIcon />
                            <span>Copy Link</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <h4 className="lg:hidden justify-center text-center mt-auto font-roboto font-bold text-[26px] leading-[35px] tracking-normal mt-4">
        Get In Touch
      </h4>

      <div className="lg:py-16 py-8 lg:px-[7.5%] px-2">
        {isLoading ? (
          <p className="text-center text-nbr-gray02 font-roboto text-lg font-medium">
            loading Blogs...
          </p>
        ) : currentItems.length === 0 ? (
          <p className="text-center text-nbr-gray02 font-roboto text-lg font-medium">
            No blogs are availables
          </p>
        ) : (
          currentItems.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))
        )}
        <div className="flex lg:justify-end justify-center items-center mt-16">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-md ${
                currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              <LeftArrow />
            </button>

            {getPageNumbers().map((number, index) => (
              <button
                key={`page-${index}`} // Unique key
                onClick={() => number !== "..." && paginate(number)}
                className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                  number === currentPage
                    ? "text-green-700 border border-green-700"
                    : number === "..."
                    ? "cursor-default"
                    : ""
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-md border border-solid border-[#DFE3E8] ${
                currentPage === totalPages ? "cursor-not-allowed" : ""
              }`}
            >
              <RightArrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
