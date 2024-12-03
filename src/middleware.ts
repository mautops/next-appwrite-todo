import auth from "./auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const user = await auth.getUser();
  if (!user) {
    request.cookies.delete("session");
    const response = NextResponse.redirect(new URL("/auth/login", request.url));

    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/todo"],
};
