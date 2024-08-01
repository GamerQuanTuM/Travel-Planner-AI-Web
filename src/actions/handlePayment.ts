"use client"

import axiosInstance from "@/lib/axiosInstance";
import { RazorpayOptions } from "react-razorpay";
import { Session } from "@/typings/session";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


type Props = {
    price: number,
    selectedPlan: string,
    Razorpay: any,
    session: Session | null,
    router: AppRouterInstance
}

const handlePayment = async ({ price, selectedPlan, Razorpay, session, router }: Props) => {
    try {
        const response = await axiosInstance.post("/payment/init", {
            amount: price * 100
        });

        const options: RazorpayOptions = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
            amount: (price * 100).toString(),
            currency: "INR",
            name: "Travel AI",
            description: `${selectedPlan} for Travel AI`,
            image: "https://firebasestorage.googleapis.com/v0/b/instagram-native-040399.appspot.com/o/travel-ai-logo.png?alt=media&token=24d0cca4-f634-431d-ace8-4284769e84bd",
            order_id: response.data.order.id,
            handler: async function (response: {
                razorpay_payment_id: string,
                razorpay_order_id: string,
                razorpay_signature: string
            }) {
                try {
                    // Log the response from Razorpay
                    console.log('Razorpay Response:', response);

                    // Verify payment
                    const { data } = await axiosInstance.post("/payment/verify", {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        userId: session?.id,
                        plan: selectedPlan
                    });

                    if (data.message === "Success") {
                        router.push("/payment/success?paymentid=" + response.razorpay_payment_id);
                    }
                } catch (verifyError: any) {
                    console.error('Payment verification failed', verifyError);
                }
            },
            prefill: {
                name: session?.name,
                email: session?.email,
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

        rzp1.on('payment.failed', function (response: any) {
            router.push("/payment/failure?paymentid=" + response.error.metadata.payment_id)
            // alert(response.error.code);
            // alert(response.error.description);
            // alert(response.error.source);
            // alert(response.error.step);
            // alert(response.error.reason);
            // alert(response.error.metadata.order_id);
            // alert(response.error.metadata.payment_id);
        });
    } catch (error) {
        console.error('Payment initiation failed', error);
        alert('Payment failed. Please try again. Contact support for help.');
    }
};

export default handlePayment;