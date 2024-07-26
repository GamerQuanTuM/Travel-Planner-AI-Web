
import { NextRequest, NextResponse } from "next/server";
import { prismadb } from "@/utils/prismadb";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const itinerary = await prismadb.itinerary.findMany({
            where: {
                userId: params.id
            },
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                cover: true,
                destination: true,
                budgetType: true,
                duration: true,
                travelOrigin: true,
            }
        })

        return NextResponse.json({ message: itinerary }, { status: 200 });
    } catch (error) {
        console.error('Error fetching itinerary:', error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
