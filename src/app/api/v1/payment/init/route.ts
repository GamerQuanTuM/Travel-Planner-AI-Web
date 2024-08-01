import { NextRequest, NextResponse } from "next/server";
import razorpay from "@/lib/RazorpayInstance";

function generateReceiptId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    const timestamp = Date.now().toString(36);
    return `${result}-${timestamp}`;
}

export async function POST(req: NextRequest) {
    try {
        const { amount } = await req.json();

        const options = {
            amount, // Convert amount to paise
            currency: "INR",
            receipt: generateReceiptId()
        };

        const order = await new Promise((resolve, reject) => {
            razorpay.orders.create(options, (err: any, order: any) => {
                if (err) {
                    console.error('Error creating Razorpay order:', err);
                    reject(err);
                } else {
                    resolve(order);
                }
            });
        });

        return NextResponse.json({ order }, { status: 200 });
    } catch (err) {
        console.error('Error in POST request:', err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
