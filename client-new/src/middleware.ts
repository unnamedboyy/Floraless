import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  console.log("ROLE:", role);
  console.log("TOKEN:", token);

  if (pathname === "/login" && token) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (role === "pegawai") {
      return NextResponse.redirect(new URL("/pegawai/dashboard", request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/pegawai")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (role !== "pegawai") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/pegawai/:path*", "/login"],
};