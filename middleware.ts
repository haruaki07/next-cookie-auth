import { type NextRequest } from "next/server";

export const ignore = ["/login"];

// return true if path is protected
const checkPath = (path: string) => {
  if (!ignore.includes(path)) return true;

  return false;
};

export async function middleware(request: NextRequest) {
  if (!checkPath(request.nextUrl.pathname)) return;

  const token = request.cookies.get("sid");
  if (!token) {
    return Response.redirect(new URL("/login", request.url));
  }

  const res = await fetch(new URL("/api/auth/session", request.url), {
    headers: {
      Authorization: token.value,
    },
  });

  const data = (await res.json()) as { authenticated: boolean };

  if (!data.authenticated) {
    return Response.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)"],
};
