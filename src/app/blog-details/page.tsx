"use client";

import Image from "next/image";
import parse from "html-react-parser";
import { useEffect, useState, useRef } from "react";
import {
  GetBlogComments,
  GetBlogDetails,
  AddLike,
  AddUnlike,
} from "@/api/apis";
import img1 from "../../assests/images/BlogsMb.png";
import {
  CommentIcon,
  CommentUserIcon,
  DisLikeIcon,
  InstagramIcon,
  LikeIcon,
  ReplyIcon,
  ShareIcon,
} from "../projects/icons";
import CommentForm from "./CommentsForms";
import ReplyForm from "./ReplyForm";
import { useParams, useRouter } from "next/navigation";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  EmailIcon,
  EmailShareButton,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { FacebookIcon } from "react-share";
import BlogsBanner from "../blog/BlogsBanner";
import { signIn, useSession } from "next-auth/react";
import { CopyIcon } from "lucide-react";
import { IoIosArrowForward } from "react-icons/io";

export default function BlogDetailsSection() {
  const [selectedBlog, setSelectedBlog] = useState([]);
  const [comments, setComments] = useState([]);
  const [shareMenuVisible, setShareMenuVisible] = useState(null);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [isHeld, setIsHeld] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [isUnLikedByUser, setIsUnlikedByUser] = useState(false);
  const [sharableLink, setSharableLink] = useState("");

  const { data: session, status } = useSession();

  const descriptionRef = useRef(null);
  const commentSectionRef = useRef(null);
  const router = useRouter();

  const siteUrl = "https://smvdp.rayabharitech.com";

  const params = useParams();
  const blogId = params.blogId || params.id;

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hash === "#comments" &&
      commentSectionRef.current
    ) {
      setTimeout(() => {
        commentSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 500);
    }
  }, [commentSectionRef.current]);

  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      // Check if the content height exceeds the visible height
      const isOverflowing = element.scrollHeight > element.clientHeight;
      setShowReadMore(isOverflowing);
    }
  }, [selectedBlog?.description]);

  useEffect(() => {
    if (!api) return;

    const onChange = () => {
      if (api) {
        const currentSlide = api.selectedScrollSnap();
        setCurrentIndex(currentSlide);
      }
    };

    api.on("select", onChange);

    return () => {
      api.off("select", onChange);
    };
  }, [api]);

  useEffect(() => {
    if (!api || isHeld) return;

    const autoSlideTimer = setInterval(() => {
      api.scrollNext();
    }, 2000);

    return () => clearInterval(autoSlideTimer);
  }, [api, isHeld]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getBlogIdFromUrl = () => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      return pathParts[pathParts.length - 1];
    }
    return null;
  };

  const name = "ro";

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shareMenuVisible]);

  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleShareClick = (e, blogId) => {
    e.preventDefault();
    e.stopPropagation();
    setShareMenuVisible(shareMenuVisible === blogId ? null : blogId);
  };

  const copyLinkToClipboard = (e, selectedBlog) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedBlog) {
      console.error("Blog object is undefined");
      return;
    }

    const currentUrl = window.location.href;
    const title = selectedBlog?.title || "Check out this blog post";
    const shareText = `${title}\n\nRead more: ${currentUrl}`;

    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error(err);
        // Fallback method for older browsers
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
          console.error(fallbackErr);
          alert("Failed to copy link");
        }

        document.body.removeChild(textArea);
      })
      .finally(() => {
        setShareMenuVisible(null);
      });
  };

  const toggleReplyForm = (id) => {
    if (activeReplyId === id) {
      setActiveReplyId(null);
    } else {
      setActiveReplyId(id);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchBlogData = async () => {
      try {
        const blogId = getBlogIdFromUrl();

        if (!blogId) {
          return;
        }

        const blogResponse = await GetBlogDetails(blogId);
        setSelectedBlog(blogResponse.data);

        const currentLink = window.location.href;
        console.log(
          "outside if and setsharablelink Current Link:",
          currentLink
        );
        if (currentLink) {
          console.log(
            "inside if and setsharablelink Current Link:",
            currentLink
          );
          setSharableLink(currentLink);
        }
        if (session?.user?.email) {
          const hasLiked = blogResponse.data.blogUsers.some(
            (user) =>
              user.user.email === session.user.email && user.isLike === true
          );
          const hasUnLiked = blogResponse.data.blogUsers.some(
            (user) =>
              user.user.email === session.user.email && user.isLike === false
          );
          setIsLikedByUser(hasLiked);
          setIsUnlikedByUser(hasUnLiked);
        }

        fetchComments(blogId);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlogData();
  }, [blogId, session]);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const fetchComments = async (blogId) => {
    try {
      const commentsResponse = await GetBlogComments(blogId);

      if (commentsResponse && Array.isArray(commentsResponse.data)) {
        setComments(commentsResponse.data);
      } else if (
        commentsResponse &&
        commentsResponse.data &&
        Array.isArray(commentsResponse.data.data)
      ) {
        setComments(commentsResponse.data.data);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };

  const ReplyCommentForm = ({ commentId }) => {
    return (
      <div className="mt-4 mb-4">
        <ReplyForm
          isReply={true}
          commentId={commentId}
          onReplyPosted={() => {
            setActiveReplyId(null);
            handleCommentPosted();
          }}
        />
      </div>
    );
  };

  const handleCommentPosted = () => {
    const blogId = getBlogIdFromUrl();
    if (blogId) {
      fetchComments(blogId);
    }
  };

  const handleDotClick = (index) => {
    if (api) {
      api.scrollTo(index);
      setCurrentIndex(index);
    }
  };

  const handleLikeClick = async (e) => {
    e.preventDefault();
    if (!session || !session.user) {
      signIn("google");
      return;
    }

    try {
      const blogId = selectedBlog.id;
      const email = session.user.email;
      const isGoogleSignedIn = true;

      const response = await AddLike(blogId, email, isGoogleSignedIn);

      setSelectedBlog((prevState) => {
        const newLikes = isLikedByUser ? prevState.like : prevState.like + 1;
        const newUnlikes = isUnLikedByUser
          ? prevState.unlike - 1
          : prevState.unlike;

        return {
          ...prevState,
          like: newLikes,
          unlike: newUnlikes,
        };
      });

      setIsUnlikedByUser(false);

      if (response.data.success === false) {
        setSelectedBlog((prevState) => {
          const newLikes = isLikedByUser ? prevState.like - 1 : prevState.like;
          const newUnlikes = isUnLikedByUser
            ? prevState.unlike - 1
            : prevState.unlike;

          return {
            ...prevState,
            like: newLikes,
            unlike: newUnlikes,
          };
        });

        setIsLikedByUser(false);
      } else {
        setIsLikedByUser(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnLikeClick = async (e) => {
    e.preventDefault();
    if (!session || !session.user) {
      signIn("google");
      return;
    }

    try {
      const blogId = selectedBlog.id;
      const email = session.user.email;
      const isGoogleSignedIn = true;

      const response = await AddUnlike(blogId, email, isGoogleSignedIn);

      setSelectedBlog((prevState) => {
        const newLikes = isLikedByUser ? prevState.like - 1 : prevState.like;
        const newUnlikes = isUnLikedByUser
          ? prevState.unlike
          : prevState.unlike + 1;

        return {
          ...prevState,
          like: newLikes,
          unlike: newUnlikes,
        };
      });

      setIsLikedByUser(false);
      if (response.data.success === false) {
        setSelectedBlog((prevState) => {
          const newLikes = isLikedByUser ? prevState.like - 1 : prevState.like;
          const newUnlikes = isUnLikedByUser
            ? prevState.unlike - 1
            : prevState.unlike;

          return {
            ...prevState,
            like: newLikes,
            unlike: newUnlikes,
          };
        });

        setIsUnlikedByUser(false);
      } else {
        setIsUnlikedByUser(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        <BlogsBanner />

        <div className="py-16 px-2 lg:px-[7.5%]">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-0 text-sm font-bold md:text-base">
              <li>
                <button
                  className="whitespace-nowrap text-gray-600 hover:text-black hover:underline transition-colors"
                  onClick={() => router.push("/home")}
                >
                  Home
                </button>
              </li>
              <li className="mx-1 text-gray-400" aria-hidden="true">
                <IoIosArrowForward className="text-xs" />
              </li>
              <li>
                <button
                  className="whitespace-nowrap text-gray-600 hover:text-black hover:underline transition-colors"
                  onClick={() => router.push("/blog")}
                >
                  Blogs
                </button>
              </li>
              <li className="mx-1 text-gray-400" aria-hidden="true">
                <IoIosArrowForward className="text-xs" />
              </li>
              <li>
                <span
                  className="whitespace-nowrap text-gray-900"
                  aria-current="page"
                >
                  Blogs Detail
                </span>
              </li>
            </ol>
          </nav>

          {!selectedBlog ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl">Blog not found</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col">
                {selectedBlog?.blogImages &&
                Array.isArray(selectedBlog.blogImages) &&
                selectedBlog.blogImages.length > 0 ? (
                  <div className="w-full relative">
                    <Carousel
                      setApi={setApi}
                      className=""
                      opts={{
                        slidesToScroll: 1,
                        loop: true,
                      }}
                    >
                      <CarouselContent
                        onMouseDown={() => setIsHeld(true)}
                        onMouseUp={() => setIsHeld(false)}
                        onMouseLeave={() => setIsHeld(false)}
                        onTouchStart={() => setIsHeld(true)}
                      >
                        {selectedBlog.blogImages.map((image, imgIndex) => (
                          <CarouselItem
                            key={imgIndex}
                            className="relative lg:h-[43.7vw] h-[35vh]"
                          >
                            <Image
                              src={`${API_URL}/${image?.image}`}
                              alt={`${selectedBlog?.title} - Image ${
                                imgIndex + 1
                              }`}
                              fill
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>

                    {selectedBlog.blogImages.length > 1 && (
                      <div className="flex justify-center gap-2 mt-4 absolute bottom-6 left-0 right-0 z-10">
                        {selectedBlog.blogImages.map((_, index) => (
                          <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all ${
                              currentIndex === index
                                ? "bg-white scale-125"
                                : "bg-gray-400 opacity-70"
                            }`}
                            onClick={() => handleDotClick(index)}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
                <div
                  className="flex justify-between p-4"
                  style={{ backgroundColor: "#FAF9F9" }}
                >
                  <div className="flex items-center gap-6">
                    <div
                      className="flex items-center gap-[12.04px]"
                      onClick={handleLikeClick}
                    >
                      <LikeIcon isActive={isLikedByUser} />
                      <h2 className="font-roboto font-normal text-[14px] leading-[100%] tracking-[0]">
                        {selectedBlog?.like || 0}
                      </h2>
                    </div>
                    <div
                      className="flex items-center gap-[12.04px]"
                      onClick={handleUnLikeClick}
                    >
                      <DisLikeIcon isActive={isUnLikedByUser} />
                      <h2 className="font-roboto font-normal text-[14px] leading-[100%] tracking-[0]">
                        {selectedBlog?.unlike || 0}
                      </h2>
                    </div>
                    <div
                      className="flex items-center gap-[12.04px] cursor-pointer"
                      onClick={scrollToComments}
                    >
                      <CommentIcon />
                      <h2 className="font-roboto font-normal text-[14px] leading-[100%] tracking-[0]">
                        {selectedBlog?.commentCount || 0}
                      </h2>
                    </div>
                  </div>
                  <div
                    className="relative share-menu-container"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={(e) => handleShareClick(e, selectedBlog.id)}
                    >
                      <ShareIcon />
                    </div>

                    {/* Share Menu Popup */}

                    {shareMenuVisible === selectedBlog.id && (
                      <div className="absolute right-0 bottom-10 bg-white shadow-lg rounded-md p-2 z-10 min-w-[200px]">
                        <div className="flex flex-col gap-4">
                          <FacebookShareButton
                            //  url={${window.location.origin}/blog-details/${selectedBlog.id}}
                            url={sharableLink}
                            quote={selectedBlog.title}
                          >
                            <div className="flex items-center gap-2">
                              <FacebookIcon size={24} round />
                              <span>Facebook</span>
                            </div>
                          </FacebookShareButton>

                          <LinkedinShareButton
                            url={sharableLink}
                            title={selectedBlog.title}
                            summary={
                              selectedBlog.description?.substring(0, 150) || ""
                            }
                            source="Samvardhana Properties – Real Estate Projects & Developers"
                          >
                            <div className="flex items-center gap-2">
                              <LinkedinIcon size={24} round />
                              <span>LinkedIn</span>
                            </div>
                          </LinkedinShareButton>

                          <TwitterShareButton
                            url={sharableLink}
                            title={selectedBlog.title}
                            hashtags={[selectedBlog.title.split(" ")[0]]}
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
                              selectedBlog.title
                            } - ${selectedBlog.description.substring(
                              0,
                              50
                            )}...`}
                            separator=" | "
                          >
                            <div className="flex items-center gap-3">
                              <WhatsappIcon size={28} round />
                              <span>WhatsApp</span>
                            </div>
                          </WhatsappShareButton>

                          <EmailShareButton
                            url={sharableLink}
                            subject={selectedBlog.title}
                            body="Checkout this Blog:"
                          >
                            <div className="flex items-center gap-3">
                              <EmailIcon size={26} round />
                              <span>Email</span>
                            </div>
                          </EmailShareButton>

                          <div
                            className="p-1 rounded flex items-center gap-2 cursor-pointer"
                            onClick={(e) =>
                              copyLinkToClipboard(e, selectedBlog)
                            }
                          >
                            <CopyIcon />
                            <span>Copy Link</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <h2 className="text-[26px] lg:text-[36px] font-bold leading-[1.3] text-nbr-black02 font-roboto text-left">
                    {selectedBlog?.title}
                  </h2>
                  <div className="flex items-center gap-4">
                    <Image
                      src={`${API_URL}/${selectedBlog?.postByImage}`}
                      alt="user.png"
                      width={40}
                      height={40}
                    />
                    <div className="overflow-hidden">
                      <div className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis">
                        <h3 className="font-roboto font-normal text-[15px] leading-[160%] tracking-[0px] text-nbr-black10">
                          By {selectedBlog?.postByName}
                        </h3>
                        <span className="text-nbr-gray02 mx-1">•</span>
                        <h3 className="font-roboto font-normal text-[15px] leading-[160%] tracking-[0px] text-nbr-gray02 overflow-hidden text-ellipsis">
                          {new Date(selectedBlog?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}{" "}
                          at{" "}
                          {new Date(selectedBlog?.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="text-nbr-gray02 font-roboto font-normal text-base leading-relaxed tracking-normal text-left">
                    <div
                      ref={descriptionRef}
                      className={`[&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 
              [&_li]:mb-2 [&_a]:text-blue-600 [&_a]:underline [&_strong]:font-bold 
              [&_em]:italic [&_u]:underline [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2
              [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2
              [&_h4]:font-bold [&_h4]:mb-2
              [&_h5]:font-bold [&_h5]:text-sm [&_h5]:mb-1
              [&_h6]:font-bold [&_h6]:text-xs [&_h6]:mb-1
              ${isExpanded ? "" : "line-clamp-[8] overflow-hidden"}`}
                    >
                      {parse(selectedBlog?.description ?? "")}
                    </div>
                    {showReadMore && (
                      <span
                        onClick={toggleReadMore}
                        className="text-nbr-green font-medium cursor-pointer inline-block ml-1"
                      >
                        {isExpanded ? "Read less" : "Read more"}
                      </span>
                    )}
                  </div>

                  {/* Comments section */}
                  <h4 className="lg:text-[32px] text-[18px] lg:leading-[46px] leading-[36px] font-bold text-nbr-black02 font-roboto text-left mt-8">
                    Comments
                  </h4>
                </div>

                {/* Display comments if available */}
                <div className="mb-4">
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={comment.id || index} className="mb-4">
                        <div className="flex gap-4 p-6 rounded-lg border border-solid border-[#E4E4E4]">
                          <div className="flex-shrink-0">
                            {comment.image ? (
                              <Image
                                src={`${API_URL}/${comment?.image}`}
                                alt="User"
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <CommentUserIcon />
                            )}
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-col md:flex-row justify-between items-start w-full">
                              <div>
                                <h4 className="font-roboto font-bold text-[18px] leading-[26px] text-nbr-black10">
                                  {comment?.fullname}
                                </h4>
                                <h4 className="font-roboto font-normal text-[16px] leading-[26px] text-nbr-gray02 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                                  {new Date(
                                    comment?.createdAt
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}{" "}
                                  at{" "}
                                  {new Date(
                                    comment?.createdAt
                                  ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </h4>
                              </div>
                              <div
                                className="hidden md:flex gap-2 items-center mt-1 md:mt-0 cursor-pointer"
                                onClick={() =>
                                  toggleReplyForm(`comment-${comment.id}`)
                                }
                              >
                                <ReplyIcon />
                                <span className="text-nbr-green font-roboto font-normal text-[16px]">
                                  Reply
                                </span>
                              </div>
                            </div>
                            <p className="font-roboto font-normal text-[16px] leading-[26px] mb-2">
                              {comment?.comment}
                            </p>

                            <div
                              className="flex md:hidden gap-2 items-center mt-1 cursor-pointer"
                              onClick={() =>
                                toggleReplyForm(`comment-${comment.id}`)
                              }
                            >
                              <ReplyIcon />
                              <span className="text-nbr-green font-roboto font-normal text-[16px]">
                                Reply
                              </span>
                            </div>
                          </div>
                        </div>
                        {activeReplyId === `comment-${comment.id}` && (
                          <ReplyCommentForm commentId={comment.id} />
                        )}

                        {/* Display replies if available */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="lg:ml-6 ml-4 mt-4">
                            {comment.replies.map((reply, replyIndex) => {
                              const replyId = `reply-${comment.id}-${replyIndex}`;
                              return (
                                <div
                                  key={reply?.id || replyIndex}
                                  className="flex gap-4 p-6 rounded-[10px] border border-dashed border-[#E4E4E4] mb-3"
                                >
                                  <div className="flex-shrink-0">
                                    {reply.image ? (
                                      <Image
                                        src={`${API_URL}/${reply?.image}`}
                                        alt="User"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                      />
                                    ) : (
                                      <CommentUserIcon />
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-2 w-full">
                                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                                      <div>
                                        <h5 className="font-roboto font-bold text-[18px] leading-[26px] text-nbr-black10">
                                          {reply?.fullname}
                                        </h5>
                                        <h6 className="font-roboto font-normal text-[16px] leading-[26px] text-nbr-gray02 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                                          {new Date(
                                            reply?.createdAt
                                          ).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                          })}{" "}
                                          at{" "}
                                          {new Date(
                                            reply?.createdAt
                                          ).toLocaleTimeString("en-US", {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}
                                        </h6>
                                      </div>
                                      <div
                                        className="hidden md:flex gap-2 items-center mt-1 md:mt-0 cursor-pointer"
                                        onClick={() => toggleReplyForm(replyId)}
                                      >
                                        <ReplyIcon />
                                        <span className="text-nbr-green font-roboto font-normal text-[16px]">
                                          Reply
                                        </span>
                                      </div>
                                    </div>
                                    <p className="font-roboto font-normal text-[16px] leading-[26px] mb-2">
                                      {reply?.comment}
                                    </p>

                                    <div
                                      className="flex md:hidden gap-2 items-center mt-1 cursor-pointer"
                                      onClick={() => toggleReplyForm(replyId)}
                                    >
                                      <ReplyIcon />
                                      <span className="text-nbr-green font-roboto font-normal text-[16px]">
                                        Reply
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {activeReplyId &&
                              activeReplyId.startsWith(
                                `reply-${comment.id}`
                              ) && <ReplyCommentForm commentId={comment.id} />}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 my-8">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </div>

              <h6
                ref={commentSectionRef}
                className="lg:text-[32px] text-[18px] lg:leading-[46px] leading-[36px] font-bold text-nbr-black02 font-roboto text-left"
              >
                Post Comment
              </h6>
              <CommentForm
                blogId={selectedBlog.id}
                onCommentPosted={handleCommentPosted}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
