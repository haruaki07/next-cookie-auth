"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const checkSession = async () => {
  const token = cookies().get("sid");
  const sess = await getSession(token?.value);
  return sess;
};

export const doLogout = async () => {
  const token = cookies().get("sid");
  if (token) {
    await prisma.session.delete({ where: { token: token.value } });
  }

  cookies().delete("sid");
};
