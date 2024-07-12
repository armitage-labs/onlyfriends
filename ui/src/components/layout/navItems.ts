import { NavItem } from "@/types";

export const signedInNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/home",
    icon: "dashboard",
    label: "dashboard",
  },
  {
    title: "Account",
    href: "/account",
    icon: "folderGit2",
    label: "projects",
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
