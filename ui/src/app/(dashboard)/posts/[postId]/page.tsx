"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import axios from "axios";
import { Posts, PostsFrames } from "@prisma/client";
import Image from "next/image";

interface PageProps {
    params: { postId: string };
}

export default function ViewPost({ params }: PageProps) {
    const router = useRouter();
    const { ready, authenticated, user } = usePrivy();
    const [post, setPost] = useState<Posts>();
    const [postFrame, setPostFrame] = useState<PostsFrames>();

    const handleFetchPost = async () => {
        const { data } = await axios.get(`/api/posts/${params.postId}`);
        if (data.success) {
            setPost(data.post);
            setPostFrame(data.frame);
        } else {
            router.push(`/posts`)
        }
    };

    useEffect(() => {
        if (ready && !authenticated) {
            // todo share on warp cast
            router.push(`/sign-in`)
        } else if (ready && authenticated) {
            handleFetchPost();
        }
    }, [ready, authenticated]);

    return (
        <div className="flex flex-col h-screen justify-center items-center">

            {post != null && postFrame != null ? (
                <Card
                    className="overflow-hidden" x-chunk="dashboard-07-chunk-4"
                >
                    <CardHeader>
                        <CardTitle>
                            Share your post
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <Image
                                width={400}
                                height={400}
                                src={postFrame?.post_image}
                                alt="Thumb"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full max-w-md mt-5 px-4 rounded mr-5"
                        >
                            Post on Farcaster
                        </Button>
                    </CardFooter>
                </Card>
            ) : (
                <>Loading....</>
            )}
        </div >
    )
}
