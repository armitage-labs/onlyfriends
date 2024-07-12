"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push(`/sign-in`)
    }
  }, [ready, authenticated]);

  return (
    <>
      Home
      Account page


      Activate your account and create your own personal token using the Bondage Curve
    </>
  )
}
