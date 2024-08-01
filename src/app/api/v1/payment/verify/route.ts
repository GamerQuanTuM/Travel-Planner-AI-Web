import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { prismadb } from "@/utils/prismadb";

export async function POST(req: NextRequest) {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, plan } = await req.json();
    console.log(plan)
    try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_SECRET_ID as string)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;
        if (isAuthentic) {
            const newPlan = await prismadb.plan.create({
                data: {
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                },
            });

            await prismadb.user.update({
                where: { id: userId },
                data: { planId: newPlan.id, subscription: plan.toUpperCase() },
            });
            return NextResponse.json({ message: "Success" }, { status: 200 })
        } else {
            return NextResponse.json({ message: "Signature didnt match" }, { status: 400 })
        }
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }
}