"use client";
import { Logo } from "../Logo";
import { Button } from "../button";
import { NavBarItem } from "./navbar-item";
import {
  useMotionValueEvent,
  useScroll,
  motion,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "next-view-transitions";
import { ModeToggle } from "../mode-toggle";

type Props = {
  navItems: {
    link: string;
    title: string;
    target?: "_blank";
  }[];
};

export const DesktopNavbar = ({ navItems }: Props) => {
  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });
  return (
    <div
      className={cn(
        "w-full flex relative justify-between px-4 py-2 rounded-full bg-transparent transition duration-200",
        showBackground &&
        "bg-fuchsia-300 shadow-[0px_-2px_0px_0px_var(--neutral-100),0px_2px_0px_0px_var(--neutral-100)] dark:shadow-[0px_-2px_0px_0px_var(--neutral-800),0px_2px_0px_0px_var(--neutral-800)]"
      )}
    >
      <AnimatePresence>
        {showBackground && (
          <motion.div
            key={String(showBackground)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
            }}
            className="absolute inset-0 h-full w-full bg-primary/35 dark:bg-neutral-800 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent,white)] rounded-full"
          />
        )}
      </AnimatePresence>
      <div className="flex flex-row gap-2 items-center">
        <Logo />
        <div className="flex items-center gap-1.5">
          {navItems.map((item) => (
            <NavBarItem href={item.link} key={item.title} target={item.target}>
              {item.title}
            </NavBarItem>
          ))}
        </div>
      </div>
      <div className="flex space-x-2 items-center">
        <ModeToggle />
        <Button variant="simple" as={Link} href="/login">
          Login
        </Button>
        <Button as={Link} href="/signup">
          Sign Up
        </Button>
      </div>
    </div>
  );
};
