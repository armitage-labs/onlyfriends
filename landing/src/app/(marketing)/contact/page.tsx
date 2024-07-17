import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ContactForm } from "./contact";
import { NavBar } from "@/components/navbar";
import { Background } from "@/components/background";
import { FeaturedTestimonials } from "@/components/featured-testimonials";
import { HorizontalGradient } from "@/components/horizontal-gradient";

export const metadata: Metadata = {
  title: "Contact Us - OnlyFriends",
  description:
    "Gated community on Farcaster Frames.",
  openGraph: {
    images: ["https://xkrrcuvbmddexwwj.public.blob.vercel-storage.com/onlyfiriends-logo-ySPTXfgTqsio390klIpl1w1y1XEW9r.svg"],
  },
};

export default function ContactPage() {
  return (

    <><NavBar /><div className="relative overflow-hidden py-20 md:py-0 px-4 md:px-20 bg-primary">
      <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
        <Background />
        <ContactForm />
        <div className="relative w-full z-20 hidden md:flex border-l border-neutral-100 dark:border-neutral-900 overflow-hidden dark:bg-black items-center justify-center">
          <div className="max-w-sm mx-auto">
            <FeaturedTestimonials />
            <p
              className={cn(
                "font-semibold text-xl text-center text-black"
              )}
            >
              OnlyFriends is the best place to be.
            </p>
            <p
              className={cn(
                "font-normal text-base text-center text-black dark:text-neutral-200 mt-8"
              )}
            >
              Reach out if you are a content creator or a fan.
              We are here to help you and give you alpha ;)
            </p>
          </div>
          <HorizontalGradient className="top-20" />
          <HorizontalGradient className="bottom-20" />
          <HorizontalGradient className="-right-80 transform rotate-90 inset-y-0 h-full scale-x-150" />
          <HorizontalGradient className="-left-80 transform rotate-90 inset-y-0 h-full scale-x-150" />
        </div>
      </div>
    </div></>
  );
}
