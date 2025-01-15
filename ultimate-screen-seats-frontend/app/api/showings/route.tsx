"use server";

import { NextResponse } from "next/server";
import ApiProxy from "../proxy";

const DJANGO_API_MOVIES_URL = "http://127.0.0.1:8000/api/showing/list";

export async function GET(request: Request) {
    // Pobierz parametry zapytania
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    // Zbuduj URL z filtrami dat
    const url = new URL(DJANGO_API_MOVIES_URL);
    if (startDate) url.searchParams.append("start_date", startDate);
    if (endDate) url.searchParams.append("end_date", endDate);

    // Wykonaj żądanie do API Django
    const { data, status } = await ApiProxy.get(url.toString(), false);

    // Zwróć dane do klienta
    return NextResponse.json(data, { status });
}
