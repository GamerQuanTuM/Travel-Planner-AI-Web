import { prismadb } from "@/utils/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const origin = request.headers.get('origin')
    const { id } = await request.json();

    try {
        const itinerary = await prismadb.itinerary.findFirst({
            where: {
                id
            },
        })

        const trip = itinerary?.trip
        return NextResponse.json({ message: trip }, { status: 200, headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Content-Type': 'application/json'
        }})

    } catch (error:any) {
        console.log(error)
        return NextResponse.json({ message: error }, { status: 500 })
    }
}