import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const session = req.auth;

  // Define protected routes - use includes() to match locale-prefixed paths like /nb/liveAnalyser
  const isProtectedRoute =
    pathname.includes("/liveAnalyser") || pathname.includes("/buytokens");

  // Redirect to sign-in if accessing protected route without session
  if (!session && isProtectedRoute) {
    const signInUrl = new URL("/en/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};