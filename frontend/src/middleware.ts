import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // 0. Check for Dev Switch
    if (process.env.NEXT_PUBLIC_AUTH_REQUIRED === 'false') {
        return NextResponse.next();
    }

    const token = request.cookies.get("jwt")?.value;
    const { pathname } = request.nextUrl;

    // 1. Protected Routes (Owner & Profile)
    if (pathname.startsWith("/owner") || pathname.startsWith("/profile") || pathname.startsWith("/my-bookings")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // 2. Auth Routes (Login/Register) - Redirect to home if already logged in
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        if (token) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/owner/:path*",
        "/profile/:path*",
        "/my-bookings/:path*",
        "/login",
        "/register",
    ],
};
