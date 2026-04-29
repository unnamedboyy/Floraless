import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  id: string;
  role: "admin" | "pelanggan";
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Kalau tidak ada token dan akses protected
  if (
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/user")) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);

      if (pathname.startsWith("/user") && decoded.role === "admin") {
        return NextResponse.redirect(
          new URL("/admin/dashboard", request.url)
        );
      }

      if (pathname.startsWith("/admin") && decoded.role === "pelanggan") {
        return NextResponse.redirect(
          new URL("/user/dashboard", request.url)
        );
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
