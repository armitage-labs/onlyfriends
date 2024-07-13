/* eslint-disable react/jsx-key */

import { NextRequest } from "next/server";

import { Button } from "frames.js/next";
import { frames } from "../../frames";
import { Users } from "@prisma/client";
import { fetchPost } from "@/app/api/posts/post.service";
import { fetchUserById } from "@/app/api/users/user.service";


const handler = async (
    req: NextRequest,
    { params: { id } }: { params: { id: string } }
) => {
    console.log(id);
    const post = await fetchPost(id);
    if (post == null) {
        return await create404Frame(req);
    }

    const user = await fetchUserById(post?.user_id);
    if (user == null) {
        return await create404Frame(req);
    }

    return await createFrameHidden(req, user)
};

async function createFrameHidden(req: NextRequest, user: Users) {
    const username: string = user.username ?? (user.display_name ? user.display_name : "");
    const slug: string = user.username ?? user.id;
    const appUrl = process.env.APP_URL ? process.env.APP_URL : 'http://localhost:3000';
    const buttonText = `Subscribe to ${username} OnlyFriends 🔔`
    return await frames(async (ctx) => {
        return {
            image: (
                <div tw="flex">
                    <span>Ready to unlock the good stuff? Subscribe to {username} view this post!</span>
                </div>
            ),
            imageOptions: {
                aspectRatio: "1:1",
            },
            buttons: [
                <Button
                    action="link"
                    target={
                        `${appUrl}/creator/${slug}`
                    }
                >
                    {buttonText}
                </Button >,
            ],
            title: `${username} OnlyFriends Post`,
        };
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
