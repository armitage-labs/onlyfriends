import { NextRequest, NextResponse } from "next/server";
import { CreateContactFormRequest } from "../types/contact.types";
import { createContactRequest } from "./contact.service";

export async function POST(req: NextRequest) {
  const contactFormRequest = (await req.json()) as CreateContactFormRequest;
  if (!contactFormRequest)
    return NextResponse.json({ success: false });

  const contactRequestCreated = await createContactRequest(contactFormRequest);
  return NextResponse.json({ success: contactRequestCreated });
}
