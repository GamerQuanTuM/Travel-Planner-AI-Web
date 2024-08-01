// typings/razorpay.d.ts
declare module 'react-razorpay' {
    export interface RazorpayOptions {
        key: string;
        amount: string;
        currency: string;
        name: string;
        description: string;
        image: string;
        order_id: string;
        handler: (response: any) => void;
        prefill: {
            name: string;
            email: string;
            contact: string;
        };
        notes: {
            address: string;
        };
        theme: {
            color: string;
        };
    }

    export interface RazorpayInstance {
        open: () => void;
        on(event: string, callback: (response: any) => void): void;
    }

    export interface RazorpayConstructor {
        new(options: RazorpayOptions): RazorpayInstance;
    }

    const useRazorpay: () => [RazorpayConstructor];
    export default useRazorpay;
}
