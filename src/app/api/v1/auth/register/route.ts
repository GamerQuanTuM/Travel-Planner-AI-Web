import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { prismadb } from "@/utils/prismadb";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
    const { name, email, password } = await request.json()

    try {
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

        return NextResponse.json({ message: user }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }
}