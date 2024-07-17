import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { Background } from "@/components/background";
import { CTA } from "@/components/cta";
import { GridFeatures } from "@/components/grid-features";
import { WobbleCard } from "@/components/ui/wobble-card";
import Image from "next/image";
import { PocketHero } from "@/components/pocketHero";

export default function Home() {
  return (
    <div className="relative overflow-hidden ">
      {/* <Background /> */}

      <Container className="flex min-h-screen flex-col items-center justify-between ">
        <Hero />
      </Container>
      <div className="relative">
        <Background />
        <div className="bg-primary">
          {/* <PocketHero /> */}
        </div>


        {/* <GridFeatures /> */}
        {/* <CTA /> */}
      </div>
    </div>
  );
}
