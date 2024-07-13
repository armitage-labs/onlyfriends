import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "../untils/authentication";
import { CreateUserDto } from "@/app/types/user.dtos";
import { Users } from "@prisma/client";
import prisma from "db";

export async function GET(req: NextRequest) {
  const usernameOrId = req.nextUrl.searchParams.get("username");

  if (usernameOrId == null) return NextResponse.json({ success: false });
  const user = await fetchUserByUsernameOrId(usernameOrId);

  if (!user) {
    return NextResponse.json({
      success: false,
    });
  } else {
    return NextResponse.json({
      success: true,
      user: user
    });
  }
}

export async function POST(req: NextRequest) {
  const createUserDto = (await req.json()) as CreateUserDto;
  if (!isAuthenticated(req) || createUserDto == null) {
    return NextResponse.json({
      success: false,
    });
  }

  const user = createUser(createUserDto);
  if (user != null) {
    return NextResponse.json({
      success: true,
      user: user,
    });
  } else {
    return NextResponse.json({
      success: false,
    });
  }
}

async function fetchUserByUsernameOrId(usernameOrId: string): Promise<Users | null> {
  let foundUser: Users | null = null;
  foundUser = await prisma.users.findFirst({
    where: {
      username: usernameOrId
    }
  });
  if (!foundUser) {
    foundUser = await prisma.users.findFirst({
      where: {
        id: usernameOrId
      }
    });
  }
  return foundUser;
}

async function createUser(createUserDto: CreateUserDto): Promise<Users> {
  return await prisma.users.upsert({
    where: {
      provider_id: createUserDto.providerId,
    },
    update: {},
    create: {
      username: createUserDto.username,
      display_name: createUserDto.displayName,
      provider_id: createUserDto.providerId,
      profile_pic: createUserDto.profileUrl,
      bio: createUserDto.bio,
    },
  });
}
