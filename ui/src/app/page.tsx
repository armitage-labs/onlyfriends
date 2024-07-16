import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fadein";
import { HoverCard } from "@/components/ui/hover-card";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-6xl items-center justify-between font-mono text-sm lg:flex">
        <Container className="mt-24 sm:mt-32 md:mt-56">
          <div className="flex flex-row">
            <FadeIn className="max-w-3xl">
              <h1 className="font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-7xl">
                Invest and trade your favorite content creators.
              </h1>
              <p className="mt-6 text-xl text-neutral-600">
                OnlyFriends.tech enables gated content directly into your farcaster feed, allowing you to invest in your favorite creators while maintaining a fixed
                subscription price for their content.
              </p>
            </FadeIn>
            <HoverCard></HoverCard>
          </div>
        </Container>
      </div>
    </main>
  );
}
