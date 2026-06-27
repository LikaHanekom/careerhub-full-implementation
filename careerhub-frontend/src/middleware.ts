import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const isEmployerRoute = path.startsWith("/dashboard");
    const isLoginRoute = path === "/login";

    if (isEmployerRoute) {
      if (!token) return NextResponse.redirect(new URL("/login", req.url));
      if (token.role !== "employer") return NextResponse.redirect(new URL("/jobs", req.url));
      return NextResponse.next();
    }

    if (isLoginRoute && token) {
      if (token.role === "employer") return NextResponse.redirect(new URL("/dashboard/listings", req.url));
      return NextResponse.redirect(new URL("/jobs", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true to allow withAuth to proceed to the middleware function.
      // Returning false would redirect to the signIn page automatically.
      // We handle redirects manually above, so always return true here.
      authorized: () => true,
    },
  }
);