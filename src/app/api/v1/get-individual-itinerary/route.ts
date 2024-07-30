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
            select: {
                id: true,
                trip: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
                cover: true,
                destination: true,
                budgetType: true,
                duration: true,
                travelOrigin: true,
                travelType: true
            }
        })

        const trip = itinerary?.trip
        return NextResponse.json({ message: trip }, {
            status: 200, headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        })

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: error }, { status: 500 })
    }
}