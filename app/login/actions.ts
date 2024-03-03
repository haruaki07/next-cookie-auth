"use server";

import prisma from "@/lib/prisma";
import { verify } from "@node-rs/bcrypt";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ms from "ms";

export const login = async (_prevState: any, formData: FormData) => {
  const username = formData.get("username")! as string;
  const password = formData.get("password")! as string;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return { message: "Wrong email or password!" };
  }

  const valid = await verify(password, user.password);
  if (!valid) {
    return { message: "Wrong email or password!" };
  }

  const expired_at = ms("7 days");
  const token = randomBytes(32).toString("base64url");
  await prisma.session.create({
    data: {
      token,
      expired_at: new Date(expired_at),
      user: { connect: user },
    },
  });

  cookies().set({
    name: "sid",
    value: token,
    httpOnly: true,
    maxAge: expired_at,
  });

  return redirect("/");
};
