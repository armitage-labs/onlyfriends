"use client"

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Vortex } from "@/components/vortex";
import { usePrivy } from "@privy-io/react-auth";
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
            <TwitterShareButton
              url={"https://www.onlyfriends.tech"}
              title={`🌟 I just registered for the OnlyFriends and qualified for an #airdrop! 🪂 

With OnlyFriends, you can freely buy and trade personal tokens, all while enjoying fixed subscription prices in USDc for your favorite content without ever leaving Farcaster.

❤️‍🔥`}
            >
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center hover:bg-blue-700 transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 mr-2" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5 9.341-9.334v-.426A6.68 6.68 0 0016 3.542a6.555 6.555 0 01-1.889.518 3.301 3.301 0 001.443-1.817 6.555 6.555 0 01-2.084.797A3.283 3.283 0 007.88 4.032a9.325 9.325 0 01-6.767-3.431A3.288 3.288 0 002.924 6.21 3.274 3.274 0 01.64 5.64v.041a3.283 3.283 0 002.632 3.218 3.203 3.203 0 01-.864.115c-.212 0-.418-.021-.618-.062a3.283 3.283 0 003.067 2.279 6.588 6.588 0 01-4.862 1.361 9.29 9.29 0 005.034 1.476" />
                </svg>
                Share on Twitter
              </button>
            </TwitterShareButton>

            <TelegramShareButton
              url={"https://www.onlyfriends.tech"}
              title={`
🌟 I just registered for OnlyFriends and qualified for an #airdrop! 🪂 

With OnlyFriends, you can freely buy and trade personal tokens, all while enjoying fixed subscription prices in USDc for your favorite content without ever leaving Farcaster.
❤️‍🔥`}>
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center hover:bg-blue-700 transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" fill="#fffcfc" className="w-6 h-6 mr-2 text-white" viewBox="0 0 64 64">
                  <path d="M32,10c12.15,0,22,9.85,22,22s-9.85,22-22,22s-22-9.85-22-22S19.85,10,32,10z M39.589,40.968	c0.404-1.241,2.301-13.615,2.534-16.054c0.071-0.738-0.163-1.229-0.619-1.449c-0.553-0.265-1.371-0.133-2.322,0.21	c-1.303,0.47-17.958,7.541-18.92,7.951c-0.912,0.388-1.775,0.81-1.775,1.423c0,0.431,0.256,0.673,0.96,0.924	c0.732,0.261,2.577,0.82,3.668,1.121c1.05,0.29,2.243,0.038,2.913-0.378c0.709-0.441,8.901-5.921,9.488-6.402	c0.587-0.48,1.056,0.135,0.576,0.616c-0.48,0.48-6.102,5.937-6.844,6.693c-0.901,0.917-0.262,1.868,0.343,2.249	c0.689,0.435,5.649,3.761,6.396,4.295c0.747,0.534,1.504,0.776,2.198,0.776C38.879,42.942,39.244,42.028,39.589,40.968z"></path>
                </svg>
                Share on Telegram
              </button>
            </TelegramShareButton>
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
