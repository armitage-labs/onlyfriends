"use client";
import React from "react";
import Image from "next/image";
import { BackgroundGradient } from "./background-gradient";
import { Button } from "./ui/button";

export function GradientCard() {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-zinc-900">
        <Image
          src={`https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/logo-with-text-sOnqDTsKFHSkmsrGeenkodbxLtlqR2.svg`}
          alt="onlyfriends-card"
          height="400"
          width="400"
          className="object-contain"
        />
        <p className="text-primary sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          This is a private Farcaster Frame
        </p>

        <p className="text-sm text-white dark:text-neutral-400 pb-3">
          To view this post, you need to subscribe to the content creator. Do so by clicking the button.
          Optionally, you can buy Personal Tokens of this content creator to support it.
        </p>
        <div className="flex flex-row justify-between">
          <Button className="pl-4 pr-1  text-white flex items-center space-x-1 mt-4 text-xs font-bold bg-zinc-800 w-full m-2">
            <span className="text-center">👀 View Post</span>
          </Button>

          <Button className="pl-4 pr-1  text-white flex items-center space-x-1 mt-4 text-xs font-bold bg-zinc-800 w-full m-2">
            <span>Subscribe </span>
            <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
              $25
            </span>
          </Button>
        </div>
      </BackgroundGradient>
    </div>
  );
}
