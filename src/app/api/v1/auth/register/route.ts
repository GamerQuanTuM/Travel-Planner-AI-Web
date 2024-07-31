import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { prismadb } from "@/utils/prismadb";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin')
    const { name, email, password } = await request.json()

    try {
        if (!email || !password || !name) {
            return NextResponse.json({ message: 'User Credentials missing.' }, { status: 400 })
        }
        const existingUser = await prismadb.user.findFirst({
            where: {
                email
            }
        })
        if (existingUser) {
            return NextResponse.json({ message: 'Email already exists, please use a different email.' }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const savedUser = await prismadb.user.create({
            data: {
                name, email, password: hashedPassword
            },
            select: {
                name: true,
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        const userId = savedUser?.id

        const session = await createSession(userId);

        const user = {
            ...savedUser,
            session
        }

        return NextResponse.json({ message: user }, {
            status: 201, headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        })

    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }
}