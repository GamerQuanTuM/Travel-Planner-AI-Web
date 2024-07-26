
import { NextRequest, NextResponse } from "next/server";
import { prismadb } from "@/utils/prismadb";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const itinerary = await prismadb.itinerary.findUnique({
            where: {
                id: params.id
            },
            select: {
                id: true,
                trip: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
                cover:true,
                destination:true,
                budgetType:true,
                duration:true,
                travelOrigin:true,
                travelType:true
            }
        });

        return NextResponse.json({ message: itinerary }, { status: 200 });
    } catch (error) {
        console.error('Error fetching itinerary:', error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
