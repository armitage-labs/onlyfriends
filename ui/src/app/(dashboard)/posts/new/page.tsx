"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { PutBlobResult } from "@vercel/blob"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

export default function NewPost() {
    const router = useRouter();
    const { ready, authenticated, user } = usePrivy();

    const [text, setText] = useState<string>();
    const inputFileRef = useRef<HTMLInputElement>(null);

    const [selectedImage, setSelectedImage] = useState();

    const handleCreatePost = async () => {
        const { data } = await axios.post(`/api/posts`, {
            providerId: user?.id,
            text: text,
        });
        if (data.success) {
            if (!inputFileRef.current?.files) {
                throw new Error("No file selected");
            }
            const file = inputFileRef.current.files[0];
            const response = await fetch(
                `/api/posts/${data.post.id}/upload`,
                {
                    method: 'POST',
                    body: file,
                },
            );
            const newBlob = (await response.json()) as PutBlobResult;
            if (newBlob != null) {
                router.push(`/posts`)
            }
        }
    };

    const handleFileChange = (event: any) => {
        setSelectedImage(event.target.files[0]);
    };

    useEffect(() => {
        if (ready && !authenticated) {
            // todo share on warp cast
            router.push(`/sign-in`)
        }
    }, [ready, authenticated]);

    return (
        <div className="flex flex-col h-screen justify-center items-center">

            <Card
                className="overflow-hidden" x-chunk="dashboard-07-chunk-4"
            >
                <CardHeader>
                    <CardTitle>
                        Create Post
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2">
                        <form
                            onSubmit={async (event) => {
                                event.preventDefault();
                                handleCreatePost();
                            }}
                        >
                            {selectedImage ? (
                                <div
                                    className="h-[400px] w-[400px] overflow-hidden"
                                >
                                    <Image
                                        width={400}
                                        height={400}
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="Thumb"
                                    />
                                </div>
                            ) : (
                                <div
                                    className="h-[400px] w-[400px] overflow-hidden"
                                >
                                    <Image
                                        width={400}
                                        height={400}
                                        src="/image-upload.svg"
                                        alt="Thumb"
                                        onClick={() => inputFileRef?.current?.click()}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            )}

                            <Textarea
                                className="mt-5"
                                placeholder="What's the tea? Spill it here... ."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <input name="file" onChange={handleFileChange} ref={inputFileRef} type="file" required style={{ display: 'none' }} />

                            <Button
                                className="w-full max-w-md mt-5 px-4 rounded"
                                onClick={handleCreatePost}
                                type="submit"
                                disabled={selectedImage == null || text?.trim() == ''} // disable button when upload is happening
                            >
                                Hawk Tuah 🎤
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
