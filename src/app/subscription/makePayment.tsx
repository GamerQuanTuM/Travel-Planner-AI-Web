"use client"

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import useRazorpay from "react-razorpay";

import { useSession } from "@/context/authContext";
import { Session } from "@/typings/session";

interface MakePaymentProps {
    handleSubmit: (props: {
        price: number,
        selectedPlan: string,
        Razorpay: any,
        session: Session | null;
        router: AppRouterInstance
    }) => Promise<void>;
    price: number;
    selectedPlan: string;
    disabled: boolean;
}

const MakePayment: React.FC<MakePaymentProps> = ({ handleSubmit, price, selectedPlan, disabled }) => {
    const [Razorpay] = useRazorpay()
    const { session } = useSession();
    const router = useRouter()
    return (
        <button
            onClick={() => handleSubmit({ price, selectedPlan, Razorpay, session, router })}
            disabled={disabled}
            className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {disabled ? 'Select a Plan' : 'Proceed to Payment'}
        </button>
    );
};

export default MakePayment;
