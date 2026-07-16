import React from "react";
import Image from "next/image";
import travelDeals from "../public/travel-deals.webp";
import beachDeals from "../public/deal-beach.webp";

const NewsletterSection = () => {
  return (
    <>
      <div className="min-h-[50vh] sm:min-h-[45vh] md:min-h-[50vh] lg:min-h-[50vh] grid grid-cols-1 md:grid-cols-3 items-center justify-center">
        <Image
          src={travelDeals}
          alt="woman on beach"
          className="h-full w-full hidden md:block object-fill"
        />
        <Image
          src={beachDeals}
          alt="coconut trees on beach"
          className="w-full h-full hidden md:block object-fill"
        />
        <div className="ml-embedded py-8 sm:py-0" data-form="ZoMitI"></div>
      </div>
    </>
  );
};

export default NewsletterSection;
