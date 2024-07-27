import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const origin = request.headers.get('origin')
    try {
        return NextResponse.json({ message: "Hello" }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        })
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }
}