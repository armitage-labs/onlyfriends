/* eslint-disable react/jsx-key */

import { NextRequest } from "next/server";

import { Button } from "frames.js/next";
import { frames } from "../frames";
import { fetchPost } from "@/app/api/posts/post.service";
import { Posts, Users } from "@prisma/client";
import { fetchUserById } from "@/app/api/users/user.service";

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

    return createPreview(req, user, post)
};


async function createPreview(
    req: NextRequest,
    user: Users,
    posts: Posts
) {
    const username: string = user.username ?? (user.display_name ? user.display_name : "");
    const postId = posts.id;

    const appUrl = process.env.APP_URL ? process.env.APP_URL : 'http://localhost:3000';
    return await frames(async (ctx) => {
        return {
            image: (
                <div tw="flex">
                    <img
                        width="100%"
                        src={`${appUrl}/hidden-message.svg`}
                        alt="Thumb"
                    />
                    <span
                        style={{
                            position: 'absolute',
                            color: 'white',
                            padding: '8px',
                            textAlign: 'center',
                            top: '80%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        {username}
                    </span>
                </div>
            ),
            imageOptions: {
                aspectRatio: "1:1",
            },
            buttons: [
                <Button action="post" target={`${postId}/postframe`}>
                    👀 View Post
                </Button>,
                <Button
                    action="link"
                    target={
                        `${appUrl}/sign-in`
                    }
                >
                    Sign Up to OnlyFriends
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
