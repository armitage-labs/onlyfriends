"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { usePrivy, useFarcasterSigner, useWallets } from "@privy-io/react-auth";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { PutBlobResult } from "@vercel/blob"
import { Textarea } from "@/components/ui/textarea";
import { ExternalEd25519Signer, HubRestAPIClient } from '@standard-crypto/farcaster-js';
import Image from "next/image"
import axios from "axios";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Posts } from "@prisma/client";

export default function NewPost() {
    const router = useRouter();
    const { ready, authenticated, user } = usePrivy();
    const { requestFarcasterSignerFromWarpcast, getFarcasterSignerPublicKey, signFarcasterMessage } = useFarcasterSigner();
    const [posting, setPosting] = useState<boolean>(false);
    const [text, setText] = useState<string>();
    const [open, setOpen] = useState<boolean>();
    const [shared, setShared] = useState<boolean>();
    const [posts, setPosts] = useState<Posts>();
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [showConfetti, setShowConfetti] = useState<boolean>();

    const [selectedImage, setSelectedImage] = useState();

    const handleCreatePost = async () => {
        if (posting) return;
        setPosting(true);
        const { data } = await axios.post(`/api/posts`, {
            providerId: user?.id,
            text: text,
        });
        if (data.success) {
            setPosts(data.post);
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
                setOpen(true)
            }
        }
        setPosting(false);
    };

    const handleSharePost = async (postId: string) => {
        requestFarcasterSignerFromWarpcast()
        const privySigner = new ExternalEd25519Signer(signFarcasterMessage, getFarcasterSignerPublicKey);
        const client = new HubRestAPIClient({
            hubUrl: 'https://hub.farcaster.standardcrypto.vc:2281',
        });
        if (user?.farcaster?.fid) {
            const submitCastResponse = await client.submitCast(
                {
                    text: "Take a peek at this! My exclusive content on OnlyFriends is waiting for you!",
                    embeds: [{
                        url: `${process.env.NEXT_PUBLIC_APP_URL}/post/frames/${postId}`
                    }]
                },
                user.farcaster.fid,
                privySigner,
            );
            if (submitCastResponse) {
                setShowConfetti(true)
                setShared(true)
            }
        }
    }

    const handleFileChange = (event: any) => {
        setSelectedImage(event.target.files[0]);
    };

    useEffect(() => {
        if (ready && !authenticated) {
            router.push(`/sign-in`)
        }
    }, [ready, authenticated]);

    return (
        <div className="flex flex-col justify-center items-center">
            <Dialog open={open} onOpenChange={setOpen}>

                {!shared && posts != null ? (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Post created!</DialogTitle>
                            <DialogDescription>
                                Your post is live! Time to give your subscribers the heads-up!
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                className="w-full max-w-md mt-5 px-4 rounded"
                                onClick={() => { handleSharePost(posts.id) }}
                            >
                                Share On Farcaster
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                ) : (

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Post Shared!</DialogTitle>
                        </DialogHeader>
                        <DialogFooter>
                            <Button className="w-full max-w-md mt-5 px-4 rounded" onClick={() => { router.push(`/posts`) }}  >Back to posts</Button>
                        </DialogFooter>
                    </DialogContent>
                )}

            </Dialog>

            <Card>
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
                                disabled={selectedImage == null || text?.trim() == '' || posting}
                            >
                                Hawk Tuah 🎤
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>

            {showConfetti ? (
                <Fireworks autorun={{ speed: 5, duration: 20 }} />
            ) : (
                <></>
            )
            }
        </div>
    )
}
