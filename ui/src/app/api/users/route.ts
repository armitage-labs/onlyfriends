import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "../untils/authentication";
import { CreateUserDto } from "@/app/types/user.dtos";
import { Users } from "@prisma/client";
import prisma from "db";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: false,
  });
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
