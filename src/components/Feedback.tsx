"use client"

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { submitForm } from '@/actions/submitForm';

export default function FeedbackForm() {

    const [state, formAction] = useFormState<{
        message: string;
        isSubmitted: boolean;
        error: null | string;
        loading: boolean;
    }, FormData>(submitForm, {
        message: "",
        error: null,
        isSubmitted: false,
        loading: false
    });

    return (
        <section className="bg-gray-100 py-12">
            <div className="container mx-auto text-center px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">We Value Your Feedback</h2>
                <p className="text-lg text-gray-600 mb-8">
                    Please let us know your thoughts and suggestions to help us improve.
                </p>
                {state.isSubmitted ? (
                    <p className="text-lg text-green-600">Thank you for your feedback!</p>
                ) : (
                    <form action={formAction} className="flex flex-col justify-center items-center">
                        <input
                            type="email"
                            name='email'
                            placeholder="Enter your email"
                            className="border border-gray-300 rounded-t-lg px-4 py-2 w-80 text-gray-700 focus:outline-none mb-4"
                            required
                        />
                        <textarea
                            name='feedback'
                            placeholder="Enter your feedback"
                            className="border border-gray-300 rounded-b-lg px-4 py-2 w-80 text-gray-700 focus:outline-none mb-4 h-40"
                            required
                        />
                        <SubmitForm />
                    </form>
                )}
            </div>
        </section>
    );
}



const SubmitForm = () => {
    const { pending } = useFormStatus()
    return (
        <button
            disabled={pending}
            type="submit"
            className="bg-black text-white rounded-lg px-6 py-2 font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            {pending ? "Submitting...." : "Submit"}
        </button>
    )
}