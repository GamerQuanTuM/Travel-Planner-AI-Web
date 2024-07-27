"use client"

import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/loading.json"

export default function Loading() {
    return (
        <div className="flex justify-center items-center w-screen h-screen">
            <Lottie className="w-1/2 h-1/2 mx-auto" animationData={LoadingAnimation} loop={true} />;
        </div>
    )
}