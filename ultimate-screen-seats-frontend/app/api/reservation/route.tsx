"use server"

import { NextResponse } from "next/server";
import ApiProxy from "../proxy";

const DJANGO_API_RESERVATIONS_URL = "http://127.0.0.1:8000/api/reservation";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user_id");

    if (!userId) {
        return NextResponse.json({ error: 'Brak ID użytkownika w zapytaniu.' }, { status: 400 });
    }

    try {
        const { data, status } = await ApiProxy.get(`${DJANGO_API_RESERVATIONS_URL}?user_id=${userId}`, true);

        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        return NextResponse.json(data, { status });
    } catch (error) {
        console.error("Błąd przy pobieraniu rezerwacji:", error);
        return NextResponse.json({ error: 'Błąd przy pobieraniu rezerwacji.' }, { status: 500 });
    }
}