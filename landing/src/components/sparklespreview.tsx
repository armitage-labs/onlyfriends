"use client";
import React from "react";
import { SparklesCore } from "./ui/sparkles";

export function SparklesPreview() {
  return (
    <div className="h-[40rem] relative w-full bg-transparent flex flex-col items-center justify-center overflow-hidden rounded-md">
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
      <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20">
        Build great products
      </h1>
    </div>
  );
}
