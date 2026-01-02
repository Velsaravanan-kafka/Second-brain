import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. SECURITY: We want to protect the ENTIRE application
// The pattern "/(.*)" means "Match absolutely every URL"
const isProtectedRoute = createRouteMatcher(["/(.*)"]);

// 2. SAFETY VALVE: We must explicitly ignore Clerk's login routes
// This prevents the "Infinite Loop" / "500 Error"
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // A. Check for Public Routes FIRST
  // If the user is trying to sign in, let them pass immediately.
  if (isPublicRoute(req)) return;

  // B. If it's NOT public, and matches our "Protect Everything" rule...
  if (isProtectedRoute(req)) {
    // ...force them to sign in.
    const authObject = await auth();
    if (!authObject.userId) {
      return authObject.redirectToSignIn();
    }
  }
});

export const config = {
  // 3. PERFORMANCE: This official matcher tells Next.js to strictly ignore
  // static files (images, css, logos) so the middleware doesn't slow them down.
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
