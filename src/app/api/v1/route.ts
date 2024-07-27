import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const origin = request.headers.get('origin')
    try {
        return NextResponse.json({ message: "Hello" }, {
            headers: {
                'Access-Control-Allow-Origin': origin || '*',
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }
}