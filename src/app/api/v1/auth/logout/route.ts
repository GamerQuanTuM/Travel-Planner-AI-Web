import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        cookies().delete('session');
        return NextResponse.json({ message: "Logout Success" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }


}