import { prismadb } from "@/utils/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { id } = await request.json();

    try {
        const itinerary = await prismadb.itinerary.findFirst({
            where: {
                id
            },
        })

        const trip = itinerary?.trip
        return NextResponse.json({ message: trip }, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: error }, { status: 500 })
    }
}