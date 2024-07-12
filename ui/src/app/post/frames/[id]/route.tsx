/* eslint-disable react/jsx-key */

import { NextRequest } from "next/server";

import { Button } from "frames.js/next";
import { frames } from "../frames";

const handler = async (
    req: NextRequest,
    { params: { id } }: { params: { id: string } }
) => {
    return await frames(async (ctx) => {
        return {
            image: (
                <div tw="flex">
                    You are on frame &quot;{id}&quot;. Try loading this URL with a GET
                    request.
                </div>
            ),
            // buttons: [
            //     <Button action="post" target={"/"}>
            //         ← Back
            //     </Button>,
            // ],
            title: `Frame ${id}`,
        };
    })(req);
};

export const GET = handler;
export const POST = handler;
