import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/", // The dashboard
  "/api(.*)", // All API routes
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. Check if route is protected AND user is NOT logged in
  if (isProtectedRoute(req)) {
    const { userId } = await auth(); // Get the ID
    if (!userId) {
      // If no ID, redirect to login
      const authObject = await auth();
      return authObject.redirectToSignIn();
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
