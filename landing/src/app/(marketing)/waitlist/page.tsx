"use client"

import { Icons } from "@/components/icons";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Vortex } from "@/components/vortex";
import { usePrivy } from "@privy-io/react-auth";
import { IconBrandTelegram } from "@tabler/icons-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { TelegramShareButton, TwitterShareButton } from "react-share";

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

          <div className="flex space-x-4 mt-5">

            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-transparent text-primary dark:text-white flex items-center space-x-2"
            >
              <TwitterShareButton
                url={"https://www.onlyfriends.tech"}
                title={`🌟 I just registered for the OnlyFriends and qualified for an #airdrop! 🪂 

With OnlyFriends, you can freely buy and trade personal tokens, all while enjoying fixed subscription prices in USDc for your favorite content without ever leaving Farcaster.

❤️‍🔥`}
              >
                <span>
                  <div className="flex flex-row">
                    <Icons.twitter className="w-6 h-6 pr-1" />
                    Share on X
                  </div>

                </span>
              </TwitterShareButton>

            </HoverBorderGradient>


            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-transparent text-primary dark:text-white flex items-center space-x-2"
            >

              <TelegramShareButton
                url={"https://www.onlyfriends.tech"}
                title={`
🌟 I just registered for OnlyFriends and qualified for an #airdrop! 🪂 

With OnlyFriends, you can freely buy and trade personal tokens, all while enjoying fixed subscription prices in USDc for your favorite content without ever leaving Farcaster.
❤️‍🔥`}>

                <div className="flex flex-row">
                  <IconBrandTelegram className="w-6 h-6 pr-1" />
                  Share on Telegram
                </div>
              </TelegramShareButton>

            </HoverBorderGradient>
          </div>
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
    </div >
  );
}
