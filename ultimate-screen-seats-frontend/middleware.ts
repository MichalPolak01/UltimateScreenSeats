"use server"

import {jwtDecode} from "jwt-decode";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = {
    "/account-settings": ['USER', 'TEACHER'],
    "/change-password": ['USER', 'TEACHER'],
};

const publicRoutes = ['/register'];

function isTokenExpired(token: string): boolean {
    try {
        const decoded: {exp?: number} = jwtDecode(token);

        return decoded.exp? decoded.exp < Date.now() / 1000 : true;
    } catch {
        return true;
    }
}

export default async function middleware(request:NextRequest) {
    const path = request.nextUrl.pathname;
    const isProtectedRoute = Object.keys(protectedRoutes).includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookieStore = await cookies();
    const userRole = cookieStore.get("role")?.value;
    const token = cookieStore.get("auth-token")?.value;
    const isAuthenticated = token && !isTokenExpired(token);
    
    if (isPublicRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if (isProtectedRoute) {
        const allowedRoles = protectedRoutes[path as keyof typeof protectedRoutes];

        if (!userRole || !allowedRoles.includes(userRole) || !isAuthenticated) {
            return NextResponse.redirect(new URL('/', request.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}