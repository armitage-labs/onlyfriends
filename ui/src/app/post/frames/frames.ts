import { appURL } from "@/utils/utils";
import { createFrames } from "frames.js/next";

export const frames = createFrames({
  basePath: "/post/frames",
  baseUrl: appURL(),
  debug: process.env.NODE_ENV === "development",
});
