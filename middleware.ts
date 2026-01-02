import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define routes that REQUIRE login
const isProtectedRoute = createRouteMatcher(["/", "/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // 2. If the route is NOT protected, just let them pass
  if (!isProtectedRoute(req)) return;

  // 3. Explicitly resolve the auth promise (Fixes the squiggles!)
  const authObject = await auth();

  // 4. Manual check: If no user, redirect them
  if (!authObject.userId) {
    return authObject.redirectToSignIn();
  }
});

export const config = {
  // 5. Official Clerk matcher (Safety for static files)
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
