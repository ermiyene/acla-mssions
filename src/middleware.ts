import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "./lib/server/helpers/jwt";

// Middleware for checking user authentication and authorization
// Wll only be applied to pages that are not listed in config below
export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    const currentUser = await getUser();

    if (
      path.startsWith("/admin") &&
      (!currentUser || currentUser?.role !== "ADMIN")
    ) {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/500", request.url));
  }
}

async function getUser() {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    return null;
  }

  try {
    const decodedUser = await verifyJWT(token);
    return decodedUser.user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth (Auth routes)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (images)
     * - fonts (fonts)
     * - favicon (favicon icons and manifest files)
     * - 404 (404 page)
     * - 500 (500 page)
     */
    {
      source:
        "/((?!auth|api|_next/static|_next/image|images|fonts|favicon|404|500).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
