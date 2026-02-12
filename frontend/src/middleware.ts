import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/env";

// Routes that require authentication (any role)
const PROTECTED_ROUTES = ["/owner", "/admin", "/profile", "/my-bookings", "/payment"];

// Routes only accessible when NOT logged in
const AUTH_ROUTES = ["/login", "/owner-login", "/register", "/become-host"];

// Role-based route access
const ROLE_ROUTES: Record<string, string[]> = {
    owner: ["/owner"],
    admin: ["/admin"],
    customer: ["/profile", "/my-bookings", "/payment"],
};

function getRoleFromToken(request: NextRequest): string | null {
    // Try to get the role from the cookie
    const roleCookie = request.cookies.get("user_role")?.value;
    if (roleCookie) return roleCookie;

    // Fallback: try parsing the JWT payload (base64 decode the middle segment)
    const token = request.cookies.get("jwt")?.value;
    if (!token) return null;

    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const payload = JSON.parse(
            Buffer.from(parts[1], "base64url").toString("utf-8")
        );

        // Supabase stores role in user_metadata or app_metadata
        return (
            payload.user_metadata?.role ||
            payload.app_metadata?.role ||
            payload.role ||
            "guest"
        );
    } catch {
        return null;
    }
}

export function middleware(request: NextRequest) {
    // Dev switch: skip all auth checks
    if (!env.NEXT_PUBLIC_AUTH_REQUIRED) {
        return NextResponse.next();
    }

    const token = request.cookies.get("jwt")?.value;
    const { pathname } = request.nextUrl;
    const role = getRoleFromToken(request);

    // 1. Protected Routes — require authentication
    const isProtected = PROTECTED_ROUTES.some((route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isProtected && !token) {
        // Redirect to appropriate login based on route
        if (pathname.startsWith("/owner")) {
            return NextResponse.redirect(new URL("/owner-login", request.url));
        }
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Role-based access control — authenticated but wrong role
    if (isProtected && token && role) {
        // Check if user's role allows access to this route
        if (pathname.startsWith("/owner") && role !== "owner" && role !== "admin") {
            return NextResponse.redirect(new URL("/explore", request.url));
        }
        if (pathname.startsWith("/admin") && role !== "admin") {
            return NextResponse.redirect(new URL("/explore", request.url));
        }
    }

    // 3. Auth Routes — redirect away if already logged in
    const isAuthRoute = AUTH_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isAuthRoute && token) {
        // Smart redirect based on role
        switch (role) {
            case "owner":
                return NextResponse.redirect(new URL("/owner", request.url));
            case "admin":
                return NextResponse.redirect(new URL("/admin", request.url));
            default:
                return NextResponse.redirect(new URL("/explore", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/owner/:path*",
        "/admin/:path*",
        "/profile/:path*",
        "/my-bookings/:path*",
        "/payment/:path*",
        "/login",
        "/owner-login",
        "/register",
        "/become-host",
    ],
};
