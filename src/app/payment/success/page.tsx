import { prismadb } from "@/utils/prismadb";
import SuccessButton from "./successButton";

const PaymentSuccess = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [paymentId: string]: string | undefined };
}) => {

  const paymentId = searchParams && searchParams.paymentId;

  const paymentDetails = await prismadb.plan.findFirst({
    where: {
      razorpay_payment_id: paymentId
    },
    select: {
      razorpay_order_id: true,
      razorpay_payment_id: true
    }
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-700 mb-6">
          Thank you for your purchase. Here are your details:
        </p>
        <p className="text-lg font-semibold text-gray-900 mb-4">
          Payment ID: {paymentDetails?.razorpay_payment_id}
        </p>
        <p className="text-lg font-semibold text-gray-900 mb-8">
          Order ID: {paymentDetails?.razorpay_order_id}
        </p>
        <div className="flex justify-center">
          <SuccessButton />
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
