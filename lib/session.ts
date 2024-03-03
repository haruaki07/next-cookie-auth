import { User } from "@prisma/client";
import prisma from "./prisma";

export const getSession = async (token: string | undefined) => {
  const res = {
    authenticated: false,
    user: null as Omit<User, "password"> | null,
  };

  if (!token) return res;

  const session = await prisma.session.findFirst({
    where: { token },
    select: { user: { select: { id: true, name: true, username: true } } },
  });
  if (!session) return res;

  res.authenticated = true;
  res.user = session.user;

  return res;
};
