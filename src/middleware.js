import { NextResponse } from "next/server";
export async function middleware(request) {
  const token = request.cookies.get("access_token");
  const route = "auth/login";
  if (!token) {
    return NextResponse.redirect(new URL(route, request.url));
  }

  try {
    const userResponse = await fetch("http://localhost:3001/user/getUser", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie"),
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(new URL(route, request.url));
    }
  } catch {
    return NextResponse.redirect(new URL(route, request.url));
  }
}
export const config = {
  matcher: ["/bingo/:path*"],
};
