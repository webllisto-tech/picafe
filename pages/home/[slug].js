import React from "react";
import { useRouter } from "next/router";
import BannerUploads from "../../components/BannerUploads";
import Testimonials from "../../components/Testimonials";

const Home = () => {
  const { query } = useRouter();
  if (query.slug === "banner-uploads") {
    return <BannerUploads />;
  } else {
    return <Testimonials />;
  }
};

export default Home;
