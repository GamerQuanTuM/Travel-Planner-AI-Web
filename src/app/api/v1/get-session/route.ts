import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { prismadb } from "@/utils/prismadb";

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin')
    const session = await verifySession();
    console.log(session)
    if (!session) {
        return NextResponse.json({ message: "Session not found" }, { status: 404 });
    }

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
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: user }, {
            status: 200, headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });

    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
