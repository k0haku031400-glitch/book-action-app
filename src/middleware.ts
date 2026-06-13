import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/books");

  if (isProtected && !isLoggedIn) {
    const signInUrl = new URL("/signin", req.nextUrl.origin);
    return Response.redirect(signInUrl);
  }

  if (isAuthPage && isLoggedIn) {
    const dashboardUrl = new URL("/dashboard", req.nextUrl.origin);
    return Response.redirect(dashboardUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/books/:path*", "/signin", "/signup"],
};
