"use client"

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const CreateTripNavigateButton = () => {
    const router = useRouter()
    return (
        <div className='flex justify-center mt-9'>
            <Button onClick={() => router.push("/create-trip")}>Get Started, It's Free</Button>
        </div>
    )
}

export default CreateTripNavigateButton