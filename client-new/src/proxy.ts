import { NextRequest, NextResponse } from "next/server";

const CUSTOMER_ONLY_ROUTES = [
  "/pemesanan",
  "/profile",
];

const ADMIN_ROUTES = [
  "/admin",
];

const PEGAWAI_ROUTES = [
  "/pegawai",
];

export function middleware(
  req: NextRequest
) {

  const { pathname } =
    req.nextUrl;

  const token =
    req.cookies.get(
      "token"
    )?.value;

  const role =
    req.cookies.get(
      "role"
    )?.value;

  /* =========================================================
     CUSTOMER ONLY ROUTES
  ========================================================= */

  const isCustomerRoute =
    CUSTOMER_ONLY_ROUTES.some(
      (route) =>
        pathname.startsWith(
          route
        )
    );

  if (isCustomerRoute) {

    // belum login
    if (!token) {

      return NextResponse.redirect(

        new URL(
          "/login",
          req.url
        )
      );
    }

    // bukan pelanggan
    if (
      role !== "pelanggan"
    ) {

      return NextResponse.redirect(

        new URL(
          "/",
          req.url
        )
      );
    }
  }

  /* =========================================================
     ADMIN ROUTES
  ========================================================= */

  const isAdminRoute =
    ADMIN_ROUTES.some(
      (route) =>
        pathname.startsWith(
          route
        )
    );

  if (isAdminRoute) {

    if (!token) {

      return NextResponse.redirect(

        new URL(
          "/login",
          req.url
        )
      );
    }

    if (role !== "admin") {

      return NextResponse.redirect(

        new URL(
          "/",
          req.url
        )
      );
    }
  }

  /* =========================================================
     PEGAWAI ROUTES
  ========================================================= */

  const isPegawaiRoute =
    PEGAWAI_ROUTES.some(
      (route) =>
        pathname.startsWith(
          route
        )
    );

  if (isPegawaiRoute) {

    if (!token) {

      return NextResponse.redirect(

        new URL(
          "/login",
          req.url
        )
      );
    }

    if (role !== "pegawai") {

      return NextResponse.redirect(

        new URL(
          "/",
          req.url
        )
      );
    }
  }

  /* =========================================================
     LOGIN PAGE PROTECTION
  ========================================================= */

  if (
    pathname === "/login"
  ) {

    if (
      token &&
      role === "admin"
    ) {

      return NextResponse.redirect(

        new URL(
          "/admin/dashboard",
          req.url
        )
      );
    }

    if (
      token &&
      role === "pegawai"
    ) {

      return NextResponse.redirect(

        new URL(
          "/pegawai/dashboard",
          req.url
        )
      );
    }

    if (
      token &&
      role === "pelanggan"
    ) {

      return NextResponse.redirect(

        new URL(
          "/",
          req.url
        )
      );
    }
  }

  return NextResponse.next();
}

export const config = {

  matcher: [

    "/login",
    "/admin/:path*",
    "/pegawai/:path*",
    "/pemesanan",
    "/profile/:path*",
  ],
};