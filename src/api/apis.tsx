import request from "./Request";

export const GetHomeBannerImages = async () => {
  return await request.get("/home-page-banner/get");
};

export const GetWhoWeAreInfo = async () => {
  return await request.get("/who-we-are/get");
};

export const GetOurProjectInfo = async () => {
  return await request.get("/our-project/get");
};

export const GetUpComingProjectDetails = async () => {
  return await request.get("/upcomming-project-card/get");
};

export const GetOurServicesInfo = async () => {
  return await request.get("/our-services/get");
};

export const GetAllBannerImages = async () => {
  return await request.get("/all-banner-images-get");
};

//...................SERVICES........................
export const GetOurServices = async () => {
  return await request.get("/services/get");
};

// ..................CUSTOMER...............................
export const GetCustomerReviewInfo = async () => {
  return await request.get("/customer/get");
};

// ..................FAQ'S...............................

export const GetFaqsInfo = async () => {
  return await request.get("/faqs/get");
};

// ..................ABOUT-US...............................

export const GetAboutUsInfo = async () => {
  return await request.get("/about-us/get");
};

export const GetOurJourneyInfo = async () => {
  return await request.get("/our-journey/get");
};

export const GetOurVisionInfo = async () => {
  return await request.get("/our-vision/get");
};

export const GetOurMissionInfo = async () => {
  return await request.get("/our-mission/get");
};

export const GetWhyToChooseInfo = async () => {
  return await request.get("/why-choose/get");
};

export const GetWhatWeOfferInfo = async () => {
  return await request.get("/what-we-offer/get");
};

// ..................PROJECTS...............................
export const GetOurProjectBanner = async () => {
  return await request.get("/our-project-banner-images/get");
};

export const GetProjectList = async () => {
  return await request.get("/project/list");
};

export const GetProjectDetails = async (id) => {
  return await request.get(`/project/${id}/get`);
};

// ..................BLOGS...............................
export const GetBlogsInfo = async () => {
  return await request.get("/blog/get");
};

export const GetBlogDetails = async (id) => {
  return await request.get(`/blog/${id}/get`);
};

export const AddLike = async (blogId, email, isGoogleSignedIn) => {
  const body = {
    email,
    isGoogleSignedIn,
  };

  return await request.post(`blog/${blogId}/like`, body);
};

export const AddUnlike = async (blogId, email, isGoogleSignedIn) => {
  const body = {
    email,
    isGoogleSignedIn,
  };

  return await request.post(`blog/${blogId}/unlike`, body);
};

export const AddCommentForm = async (id, formData) => {
  const form = new FormData();

  form.append("fullname", formData.fullName);
  form.append("email", formData.email);

  if (formData.comments) {
    form.append("comment", formData.comments);
  }

  return await request.post(`/blog/${id}/post-comment`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const GetBlogComments = async (id) => {
  return await request.get(`/blog/${id}/get-comments`);
};

// ..................CONTACT-US...............................

export const GetSupportContactUsInfo = async () => {
  return await request.get("/contact-us/get");
};

export const AddContactUsForm = async (formData) => {
  return await request.post("/get-in-touch/add", formData);
};
