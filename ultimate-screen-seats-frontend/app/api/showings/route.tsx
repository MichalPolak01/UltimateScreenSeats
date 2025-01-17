"use server";

import { NextResponse } from "next/server";

import ApiProxy from "../proxy";

const DJANGO_API_SHOWINGS_URL = "http://127.0.0.1:8000/api/showing";


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const limit = searchParams.get("limit");

    const url = new URL(DJANGO_API_SHOWINGS_URL);

    if (limit) url.searchParams.append("limit", limit);

    const { data, status } = await ApiProxy.get(url.toString(), false);

    return NextResponse.json(data, { status });
}