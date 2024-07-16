import { Link } from "next-view-transitions";
import Image from "next/image";
import React from "react";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm mr-4  text-black px-2 py-1  relative z-20"
    >

      <Image
        width={40}
        height={40}
        alt="Logo"
        src={"https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/onlyfiriends-logo-ySPTXfgTqsio390klIpl1w1y1XEW9r.svg"}></Image>
      <span className="pl-1 font-medium text-black dark:text-white">OnlyFriends</span>
    </Link>
  );
};
