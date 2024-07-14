"use client";

import { usePrivy, useFarcasterSigner, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ExternalEd25519Signer, HubRestAPIClient } from '@standard-crypto/farcaster-js';
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

import Image from "next/image"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import axios from "axios";
import { PostDto } from "@/app/types/post.dtos";


export default function PostsPage() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const { requestFarcasterSignerFromWarpcast, getFarcasterSignerPublicKey, signFarcasterMessage } = useFarcasterSigner();
  const [posts, setPosts] = useState<PostDto[]>();
  const [showConfetti, setShowConfetti] = useState<boolean>();

  const { wallets } = useWallets();

  useEffect(() => {
    if (!ready) return;
    console.log(wallets);
  }, [wallets, ready]);

  function handleCreatePost() {
    router.push(`/posts/new`)
  }



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
      }
    }
  }

  const handleFetchPosts = async () => {
    const { data } = await axios.get(`/api/posts?providerId=${user?.id}`);
    if (data.success) {
      setPosts(data.posts);
    }
  };

  useEffect(() => {
    if (ready && !authenticated) {
      router.push(`/sign-in`)
    } else if (ready && authenticated) {
      handleFetchPosts();
    }
  }, [ready, authenticated]);

  if (posts == null || posts.length == 0) {
    return (
      <div className="flex flex-col h-screen justify-center items-center">

        <h3 className="text-2xl font-bold tracking-tight">
          {"Looks like you haven't posted anything yet!"}
        </h3>
        <p className="text-sm text-muted-foreground">
          Afraid of commitment, are we? 😜
        </p>
        <Button onClick={handleCreatePost} className="mt-4 rounded-full">Create your first post</Button>
      </div>
    )
  }

  return (

    <div className="flex-1 space-y-4  p-4 md:p-8">
      <div className="flex items-start justify-between">
        <Heading title="Posts" description="Craft some posts and spread the word like confetti!"></Heading>
        <Button onClick={handleCreatePost} className="mt-4 rounded-full">Create Post</Button>
      </div>
      <Separator />


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent>
              <div className="grid gap-2">
                <div className="h-[400px] w-[400px] overflow-hidden">
                  <Image
                    width={400}
                    height={400}
                    src={post.postsFrames[0]?.post_image ?? '/image-upload.svg'}
                    alt="PlaceHolder"
                  />
                </div>
                <span>
                  {post.text}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full max-w-md mt-5 px-4 rounded"
                onClick={() => { handleSharePost(post.id) }}
              >
                Share On Farcaster
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {showConfetti ? (
        <Fireworks autorun={{ speed: 5, duration: 20 }} />
      ) : (
        <></>
      )
      }
    </div >
  );
}
