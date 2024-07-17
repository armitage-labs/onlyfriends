"use client";

import Balancer from "react-wrap-balancer";
import { Button } from "./button";
import { HiArrowRight } from "react-icons/hi2";
import { Badge } from "./badge";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { Link } from "next-view-transitions";
import { GradientCard } from "./gradient-card";
import { SparklesCore } from "./ui/sparkles";

export const Hero = () => {

  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen pt-20 md:pt-40 relative overflow-hidden">

      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={1.5}
          maxSize={5}
          particleDensity={30}
          className="w-full h-full"
          particleColor="#FF00FF"
        />

      </div>

      <motion.div
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
        }}
        className="flex justify-center"
      >


        <Badge onClick={() => router.push("/blog/top-5-llm-of-all-time")}>
          Subscribe to the waitlist to qualify for an airdrop

        </Badge>

      </motion.div>
      <motion.h1
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
        }}
        className="text-2xl md:text-4xl lg:text-8xl font-semibold max-w-6xl mx-auto text-center mt-6 relative z-10"
      >

        <Balancer>
          Invest and trade your favorite <a className="text-violet-500">Farcaster</a> content creators

        </Balancer>


      </motion.h1>
      <motion.p
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
          delay: 0.2,
        }}
        className="text-center mt-6 text-base md:text-xl text-black dark:text-muted-dark max-w-3xl mx-auto relative z-10 pt-10"
      >
        <Balancer>
          Access all your content directly on Farcaster feeds through frames. Subscribe to your favorite creators and get exclusive access to their content.

        </Balancer>

        <div className="flex justify-center pt-10">
          <GradientCard></GradientCard>
        </div>

      </motion.p>
      <motion.div
        initial={{
          y: 80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
          delay: 0.4,
        }}
        className="flex items-center gap-4 justify-center mt-6 relative z-10"
      >
        <div className="flex flex-row pb-32">
          <Button
            as={Link}
            href="/waitlist"
            className="flex space-x-2 items-center group"
          >
            Waitlist</Button>
          <Button
            variant="simple"
            as={Link}
            href="/contact"
            className="flex space-x-2 items-center group"
          >
            <span>Contact us</span>

            <HiArrowRight className="text-muted group-hover:translate-x-1 stroke-[1px] h-3 w-3 transition-transform duration-200 dark:text-muted-dark" />

          </Button>
        </div>

      </motion.div>

    </div>
  );
};
