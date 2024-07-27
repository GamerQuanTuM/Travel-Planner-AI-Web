import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { prismadb } from "@/utils/prismadb";

export async function GET(request: NextRequest) {
    const session = await verifySession();
    if (!session) return null;

    try {
        const user = await prismadb.user.findFirst({
            where: {
                id: session?.userId as string
            },
            select: {
                email: true,
                id: true,
                name: true,
                updatedAt: true,
                createdAt: true,
            }
        })

        return NextResponse.json({ message: user }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }
}