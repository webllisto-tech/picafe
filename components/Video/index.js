import React, { useEffect, useState } from "react";
import { useVideoThumbnail } from "../../utils/useVideoThumbnail";
import Image from "next/image";
import { AiOutlinePlayCircle } from "react-icons/ai";

const Video = ({ src, onSeeked, controls, className }) => {
  const [imgUrl, setImgUrl] = useState("");
  const [isPlayVideo, setIsPlayVideo] = useState(false);

  const handlePlay = () => {
    setIsPlayVideo((prev) => !prev);
  };

  const videoToImage = useVideoThumbnail();
  useEffect(() => {
    videoToImage(src, 2, (imgUrl) => {
      setImgUrl(imgUrl);
    });
  }, [src, videoToImage]);

  if (!imgUrl) {
    return (
      <>
        <div
          role="status"
          className="flex justify-center aspect-square items-center max-w-sm h-full bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
        >
          <svg
            className="w-12 h-12 text-gray-200 dark:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 384 512"
          >
            <path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </>
    );
  }

  return (
    <>
      {!isPlayVideo ? (
        <div className="relative w-full h-full aspect-square" onClick={handlePlay}>
          <AiOutlinePlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white text-6xl" />
          <Image
            src={imgUrl}
            alt=""
            fill
            className={`${className} object-cover`}
          />
        </div>
      ) : (
        <video
          src={src}
          onSeeked={onSeeked}
          controls={controls}
          autoPlay={true}
          className={className}
        ></video>
      )}
    </>
  );
};

export default Video;
