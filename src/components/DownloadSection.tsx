import React from 'react';

import TravelAIApk from "@/assets/travel-ai-apk.png"
import Image from 'next/image';

const DownloadSection = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Download Our Mobile App</h2>
            <p className="text-gray-600 mb-6 text-center">
                Get the best experience by downloading our mobile app. Scan the QR code below to get started!
            </p>
            <Image src={TravelAIApk} alt="Download App QR Code" height={500} width={500} className="w-fit h-80 mb-4 rounded-xl border-2 border-black object-contain p-1" />
        </div>
    );
};

export default DownloadSection;
