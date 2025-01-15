"use server"

import { NextResponse } from "next/server";

import ApiProxy from "../../proxy";

const DJANGO_API_MOVIES_URL = "http://127.0.0.1:8000/api/movie/"



export async function GET( request: Request, context: { params: { id: string } }) {
    const { params } = context;
    const { id } = await params;

    const { data, status } = await ApiProxy.get(`${DJANGO_API_MOVIES_URL}${id}`, false);

    return NextResponse.json(data, { status: status });
}