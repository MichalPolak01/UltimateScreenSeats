// route.tsx
"use server"

import { NextResponse } from "next/server"

const DJANGO_API_SHOWING_URL = "http://127.0.0.1:8000/api/showing"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.pathname.split("/").pop()

  if (!id) {
    return NextResponse.json(
      { error: "Brak ID pokazu w zapytaniu." },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(`${DJANGO_API_SHOWING_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "Błąd podczas pobierania pokazu." },
        { status: res.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error("Błąd podczas pobierania pokazu:", err)
    return NextResponse.json(
      { error: "Wystąpił błąd podczas pobierania danych." },
      { status: 500 }
    )
  }
}
