"use client"

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Vortex } from "@/components/vortex";
import Image from "next/image";
import React from "react";

export default function WaitlistPage() {
  return (
    <div className="w-screen mx-auto rounded-md  h-screen overflow-hidden">
      <Vortex
        backgroundColor="primary"
        rangeY={800}
        particleCount={500}
        baseHue={250}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      >
        <Image
          src="https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/logo-with-text-sOnqDTsKFHSkmsrGeenkodbxLtlqR2.svg"
          width={400}
          height={400}
          alt="waitlist"
        />
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Join the waitlist
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          You will be the first to know when we launch and elligible for airdrops. We are excited to have you on board.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black bg-transparent text-primary dark:text-white flex items-center space-x-2"
          >
            <span>Join Now</span>
          </HoverBorderGradient>
          <button className="px-4 py-2  text-white ">I am not degen enough</button>
        </div>
      </Vortex>
    </div>
  );
}
