import Image from "next/image";
import React from "react";

function WelcomeBanner() {
  return (
    <div className="relative bg-[#D33746] p-4 sm:p-8 rounded-sm overflow-hidden mb-8">
      <div
        className="absolute right-0 top-0 -mt-4 mr-16 pointer-events-none hidden xl:block"
        aria-hidden="true"
      >
        <Image
          src="/images/bannersvg.svg"
          alt="banner"
          width={319}
          height={198}
        />
      </div>

      <div className="relative">
        <h1 className="text-2xl md:text-3xl text-white font-bold mb-1">
          Good afternoon, Admin. 👋
        </h1>
      </div>
    </div>
  );
}

export default WelcomeBanner;
