"use server"

import { prismadb } from "@/utils/prismadb";

type State = {
    message: string,
    isSubmitted: boolean,
    error: null | string,
    loading: boolean
}

export const submitForm = async (state: State, formData: FormData) => {
    const email = formData.get("email") as string;

    const feedback = formData.get("feedback") as string

    try {
        await prismadb.feedback.create({
            data: {
                email,
                text: feedback
            }
        })

        return {
            message: 'Feedback Posted',
            isSubmitted: true,
            error: null,
            loading: false
        }
    } catch (error:any) {
        return {
            message: 'Something went wrong',
            isSubmitted: false,
            error: error,
            loading: false
        }
    }

};