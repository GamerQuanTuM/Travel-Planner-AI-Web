import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { prismadb } from "@/utils/prismadb";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
    const { email, password } = await request.json()

    try {
        const dbUser = await prismadb.user.findFirst({
            where: {
                email
            }
        })
        if (!dbUser) {
            return NextResponse.json({ message: 'Email not found.' }, { status: 409 })
        }

        const passwordMatch = await bcrypt.compare(
            password,
            dbUser.password,
        );

        if (passwordMatch) {


            const userId = dbUser.id;
            const session = await createSession(userId);

            const { password, ...rest } = dbUser

            const user = {
                ...rest,
                session
            }

            return NextResponse.json({ message: user }, { status: 201 })
        } else {
            return NextResponse.json({ message: "Password didn't match" }, { status: 403 })
        }



    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }
}