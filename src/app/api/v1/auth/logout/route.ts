import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin')
    try {
        cookies().delete('session');
        return NextResponse.json({ message: "Logout Success" }, {
            status: 200, 
            headers: {
                'Access-Control-Allow-Origin': origin || '*',
                'Content-Type': 'application/json'
            }
        },);
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }


}