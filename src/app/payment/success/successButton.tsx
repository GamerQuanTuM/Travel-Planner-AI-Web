"use client"
import { useRouter } from "next/navigation";

function SuccessButton() {
    const router = useRouter();
    const redirectToHome = () => {
        router.push('/');
    };
    return (
        <button
            onClick={redirectToHome}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
        >
            Go to Home
        </button>
    )
}

export default SuccessButton