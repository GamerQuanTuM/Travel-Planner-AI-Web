"use client"

import { useRouter } from "next/navigation";

const PaymentFailure = () => {
  const router = useRouter();

  const redirectToHome = () => {
    router.push('/');
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-700 mb-6">
          Unfortunately, your payment could not be processed. Please try again.
        </p>
        <div className="flex justify-center">
          <button
            onClick={redirectToHome}
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
