
import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";
import { appURL } from "@/utils/utils";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "OnlyFiends 😉",
        description: "This is a hidden frame",
        other: {
            ...(await fetchMetadata(
                new URL("/posts/frames", appURL())
            )),
        },
    };
}

export default async function Home() {
    return (
        <div>
            Frames.js dynamic routes example
        </div>
    );
}
