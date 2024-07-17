import { CreateContactFormRequest } from "../types/contact.types";
import prisma from "db";

export async function createContactRequest(
  contactRequest: CreateContactFormRequest,
): Promise<boolean> {
  await prisma.contactForm.create({
    data: {
      email: contactRequest.email,
      message: contactRequest.message,
      name: contactRequest.name,
      company: contactRequest.company,
    },
  });
  return true;
}
