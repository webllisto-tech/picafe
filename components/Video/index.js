import React, { useEffect, useState } from "react";
// import { useVideoThumbnail } from "../../utils/useVideoThumbnail";
import Image from "next/image";
import { AiOutlinePlayCircle } from "react-icons/ai";

const Video = ({ src, videoThumbnail, className }) => {
  const [isPlayVideo, setIsPlayVideo] = useState(false);

  const handlePlay = () => {
    setIsPlayVideo((prev) => !prev);
  };

  return (
    <>
      {!isPlayVideo ? (
        <div
          className="relative hover:shadow-lg hover:scale-105 transition-all w-full h-full aspect-square"
          onClick={handlePlay}
        >
          <AiOutlinePlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white text-6xl" />
          <Image
            src={videoThumbnail}
            alt="thumb"
            fill
            quality={50}
            className={`${className} object-cover`}
          />
        </div>
      ) : (
        <>
          <iframe
            className="aspect-square h-full w-full"
            src={`https://www.youtube.com/embed/${
              src.match(/v=([a-zA-Z0-9_-]{11})/)[1]
            }`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </>
      )}
    </>
  );
};

export default Video;
