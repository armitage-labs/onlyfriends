import { NextRequest, NextResponse } from "next/server";
import prisma from "db";
import { CreateTokenSettingsDto } from "@/app/types/token-settings.dtos";
import { isAuthenticated } from "../untils/authentication";
import { fetchUserByProviderId } from "../users/user.service";

export async function GET(req: NextRequest) {
  const providerId = req.nextUrl.searchParams.get("providerId");

  if (providerId == null) return NextResponse.json({ success: false });
  const user = await fetchUserByProviderId(providerId);

  if (user == null || user?.id == null) {
    return NextResponse.json({
      success: false,
    });
  }
  const tokenSettings = await fetchTokenSettingsByUser(user.id);

  if (tokenSettings !== null) {
    return NextResponse.json({
      success: true,
      tokenSettings: tokenSettings[0]
    });
  } else {
    return NextResponse.json({
      success: false
    });
  }

}

export async function POST(req: NextRequest) {
  const createTokenSettingsDto = (await req.json()) as CreateTokenSettingsDto;
  const claims = isAuthenticated(req);

  if (!claims || createTokenSettingsDto == null) {
    return NextResponse.json({
      success: false,
    });
  }

  const user = await fetchUserByProviderId(createTokenSettingsDto.providerId);
  if (user == null || user?.id == null) {
    return NextResponse.json({
      success: false,
    });
  }

  const tokenSettings = await createTokenSettings(
    user?.id,
    createTokenSettingsDto.chainId,
    createTokenSettingsDto.tokenName,
    createTokenSettingsDto.tokenSymbol,
    createTokenSettingsDto.tokenAddress
  );
  if (tokenSettings !== null) {
    return NextResponse.json({
      success: true,
      tokenSettings: tokenSettings
    });
  } else {
    return NextResponse.json({
      success: false
    });
  }
}

async function fetchTokenSettingsByUser(userId: string) {
  return await prisma.tokenSettings.findMany({
    where: {
      user_id: userId
    }
  })
}

async function createTokenSettings(
  userId: string,
  chainId: string,
  tokenName: string,
  tokenSymbol: string,
  tokenAddress: string
) {
  return await prisma.tokenSettings.create({
    data: {
      user_id: userId,
      chain_id: chainId,
      token_name: tokenName,
      token_symbol: tokenSymbol,
      token_address: tokenAddress
    }
  })
}
