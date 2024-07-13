/* eslint-disable react/jsx-key */

import { NextRequest } from "next/server";

import { Button } from "frames.js/next";
import { getAddressForFid, getFrameMessage } from "frames.js"
import { frames } from "../../frames";
import { Posts, Users } from "@prisma/client";
import { fetchPost, fetchPostFrames } from "@/app/api/posts/post.service";
import { fetchUserById } from "@/app/api/users/user.service";
import { fetchActiveSubscription } from "@/app/api/subscriptions/subscriptions.service";


const handler = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const post = await fetchPost(id);
  if (post == null) {
    return await create404Frame(req);
  }

  const user = await fetchUserById(post?.user_id);
  if (user == null) {
    return await create404Frame(req);
  }

  return await createFrameHidden(req, user, post)
};

async function createFrameHidden(req: NextRequest, user: Users, post: Posts) {
  const username: string = user.username ?? (user.display_name ? user.display_name : "");
  const slug: string = user.username ?? user.id;
  const appUrl = process.env.APP_URL ? process.env.APP_URL : 'http://localhost:3000';
  const buttonText = `Subscribe to ${username} OnlyFriends 🔔`
  const postFrame = await fetchPostFrames(post.id);

  if (postFrame == null) {
    return await create404Frame(req);
  }

  return await frames(async (ctx) => {
    const custodyAddress = ctx.message?.requesterCustodyAddress ?? "";
    const verifiedAddresses = ctx.message?.requesterVerifiedAddresses ?? [];
    const activeSubscryption = await fetchActiveSubscription(slug, [custodyAddress, ...verifiedAddresses]);

    if (activeSubscryption != null) {
      return {
        image: (
          <div tw="flex">
            <img
              tw="rounded-lg"
              height="1080"
              width="1080"
              src={postFrame.post_image}
              alt="Thumb"
            />
            <span
              style={{
                position: 'absolute',
                color: 'white',
                paddingLeft: '8px',
                paddingRight: '8px',
                textAlign: 'center',
                bottom: '8%',
              }}
            >
              {post.text}
            </span>
          </div>
        ),
        imageOptions: {
          aspectRatio: "1:1",
        },
        title: `${username} OnlyFriends Post`,
      };
    } else {
      return {
        image: (
          <div tw="flex flex-col items-center justify-center">
            <div tw="flex flex-col items-center justify-center">Ready to unlock the good stuff?</div>
            <div tw="flex flex-col items-center justify-center">Subscribe to {username} view this post!</div>
          </div>
        ),
        imageOptions: {
          aspectRatio: "1:1",
        },
        buttons: [
          <Button
            action="link"
            target={
              `${appUrl}/subscribe/${slug}`
            }
          >
            {buttonText}
          </Button >,
        ],
        title: `${username} OnlyFriends Post`,
      };
    }
  })(req);
}

async function create404Frame(req: NextRequest) {
  return await frames(async (ctx) => {
    return {
      image: (
        <div tw="flex">
          <span>Whoops Post not found</span>
        </div>
      ),
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button
          action="link"
          target={
            "https://github.com/builders-garden/open-frames-starter-framesjs"
          }
        >
          Sign Up to OnlyFriends
        </Button>,
      ],
      title: `OnlyFriends Frame`,
    };
  })(req);
}

export const GET = handler;
export const POST = handler;
