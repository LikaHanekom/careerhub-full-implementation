import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

export default auth((req: NextAuthRequest) => {
  const session = req.auth;
  const path = req.nextUrl.pathname;

  const isEmployerRoute = path.startsWith("/dashboard");
  const isLoginRoute = path === "/login";

  // /dashboard/ — employer only
  if (isEmployerRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session.user?.role !== "employer") {
      return NextResponse.redirect(new URL("/jobs", req.url));
    }
    return NextResponse.next();
  }

  // /login — redirect already-signed-in users
  if (isLoginRoute && session) {
    if (session.user?.role === "employer") {
      return NextResponse.redirect(new URL("/dashboard/listings", req.url));
    }
    return NextResponse.redirect(new URL("/jobs", req.url));
  }

  // Everything else 
  return NextResponse.next();
});