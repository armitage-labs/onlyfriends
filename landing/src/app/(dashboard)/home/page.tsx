"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8">
        <div className="flex items-start justify-between">
          <Heading title="Dashboard" description="View the most important info about your Pegged Token and your Bondage Curve"></Heading>
        </div>
        <Separator />
      </div>
    </>
  )
}
