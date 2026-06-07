import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(
  request: NextRequest
) {

  const token =
    request.cookies
      .get("token")
      ?.value;

  const role =
    request.cookies
      .get("role")
      ?.value;

  const {
    pathname,
  } = request.nextUrl;

  /* =====================================================
     LOGIN REDIRECT
  ===================================================== */

  if (
    pathname === "/login" &&
    token
  ) {

    if (
      role === "admin"
    ) {

      return NextResponse.redirect(

        new URL(
          "/admin/dashboard",
          request.url
        )
      );
    }

    if (
      role === "pegawai"
    ) {

      return NextResponse.redirect(

        new URL(
          "/pegawai/dashboard",
          request.url
        )
      );
    }

    if (
      role === "pelanggan"
    ) {

      return NextResponse.redirect(

        new URL(
          "/",
          request.url
        )
      );
    }
  }

  /* =====================================================
     ADMIN
  ===================================================== */

  if (
    pathname.startsWith(
      "/admin"
    )
  ) {

    if (!token) {

      return NextResponse.redirect(

        new URL(
          "/login",
          request.url
        )
      );
    }

    if (
      role !== "admin"
    ) {

      return NextResponse.redirect(

        new URL(
          "/",
          request.url
        )
      );
    }
  }

  /* =====================================================
     PEGAWAI
  ===================================================== */

  if (
    pathname.startsWith(
      "/pegawai"
    )
  ) {

    if (!token) {

      return NextResponse.redirect(

        new URL(
          "/login",
          request.url
        )
      );
    }

    if (
      role !== "pegawai"
    ) {

      return NextResponse.redirect(

        new URL(
          "/",
          request.url
        )
      );
    }
  }

  /* =====================================================
     CUSTOMER ONLY
  ===================================================== */

  const protectedCustomerRoutes = [

    "/booking",

    "/profile",
  ];

  const isCustomerRoute =
    protectedCustomerRoutes.some(
      (route) =>
        pathname.startsWith(
          route
        )
    );

  if (
    isCustomerRoute
  ) {

    if (!token) {

      return NextResponse.redirect(

        new URL(
          "/login",
          request.url
        )
      );
    }

    if (
      role !== "pelanggan"
    ) {

      return NextResponse.redirect(

        new URL(
          "/",
          request.url
        )
      );
    }
  }

  return NextResponse.next();
}

export const config = {

  matcher: [

    "/admin/:path*",

    "/pegawai/:path*",

    "/booking/:path*",

    "/profile/:path*",

    "/login",
  ],
};