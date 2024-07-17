"use client"

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Vortex } from "@/components/vortex";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

export default function WaitlistPage() {
  const [registered, setRegistered] = useState(false);
  const { ready, authenticated, user, login, linkEmail } = usePrivy();

  useEffect(() => {
    if (authenticated && user != null) {
      if (user.email != null) {
        setRegistered(true);
      }
      try {
        linkEmail();
      } catch (error) {
        console.error(error);
      }
    }
  }, [authenticated, user]);

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

        {registered ? (<>
          <Fireworks autorun={{ speed: 5, duration: 20 }} />
          <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
            Wohoo! You are in!
          </h2>
          <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
            You will be the first to know when we launch and will be elligible for airdrops. We are excited to have you on-board.
          </p>

        </>) : (<>

          <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
            Join the waitlist
          </h2>
          <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
            You will be the first to know when we launch and will be elligible for airdrops. We are excited to have you on-board.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-transparent text-primary dark:text-white flex items-center space-x-2"
            >
              <span onClick={() => { login() }}>Join Now</span>
            </HoverBorderGradient>
          </div>
        </>)}
      </Vortex>
    </div>
  );
}
