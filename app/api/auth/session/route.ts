import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization");
  const res = await getSession(token ?? undefined);

  return NextResponse.json(res);
}
