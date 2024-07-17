import { NavItem } from "@/types";

export const signedInNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/home",
    icon: "dashboard",
    label: "dashboard",
  },
  {
    title: "Posts",
    href: "/posts",
    icon: "handHeart",
    label: "posts",
  },
  {
    title: "Bondage",
    href: "/bondage",
    icon: "heartHandshake",
    label: "bondage",
  },
];

export const signedOutNavItems: NavItem[] = [
  {
    title: "Login",
    href: "/sign-in",
    icon: "login",
    label: "login",
  },
];
