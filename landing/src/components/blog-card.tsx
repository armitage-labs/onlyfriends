import { Link } from "next-view-transitions";
import React from "react";
import { BlurImage } from "./blur-image";
import { Logo } from "./Logo";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
import { BlogWithSlug } from "@/lib/blog";

export const BlogCard = ({ blog }: { blog: BlogWithSlug }) => {
  const truncate = (text: string, length: number) => {
    return text.length > length ? text.slice(0, length) + "..." : text;
  };
  return (
    <Link
      className="shadow-derek rounded-3xl border dark:border-neutral-800 w-full bg-white dark:bg-neutral-900  overflow-hidden  hover:scale-[1.02] transition duration-200"
      href={`/blog/${blog.slug}`}
    >
      {blog.image ? (
        <BlurImage
          src={blog.image || ""}
          alt={blog.title}
          height="800"
          width="800"
          className="h-52 object-cover object-top w-full"
        />
      ) : (
        <div className="h-52 flex items-center justify-center bg-white dark:bg-neutral-900">
          <Logo />
        </div>
      )}
      <div className="p-4 md:p-8 bg-white dark:bg-neutral-900">
        <div className="flex space-x-2 items-center  mb-2">
          <Image
            src={blog.author.src}
            alt={blog.author.name}
            width={20}
            height={20}
            className="rounded-full h-5 w-5"
          />
          <p className="text-sm font-normal text-muted">{blog.author.name}</p>
        </div>
        <p className="text-lg font-bold mb-4">
          <Balancer>{blog.title}</Balancer>
        </p>
        <p className="text-left text-sm mt-2 text-muted">
          {truncate(blog.description, 100)}
        </p>
      </div>
    </Link>
  );
};
