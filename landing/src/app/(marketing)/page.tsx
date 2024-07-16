import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { Background } from "@/components/background";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <div className="relative overflow-hidden ">
      <Background />
      <Container className="flex min-h-screen flex-col items-center justify-between ">
        <Hero />
      </Container>
      <div className="relative">
        <Background />
        <CTA />
      </div>
    </div>
  );
}
