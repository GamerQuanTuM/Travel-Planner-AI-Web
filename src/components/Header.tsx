"use client"

import React, { useState } from 'react'
import Image from 'next/image'

import Logo from "@/assets/travel-ai-extended.png"
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useSession } from '@/context/authContext'
import { Avatar, AvatarFallback } from './ui/avatar'
import axiosInstance from '@/lib/axiosInstance'
import { useToast } from './ui/use-toast'

const Header = ({ show = true }: { show?: boolean }) => {
    const router = useRouter()
    const { session } = useSession();
    const { toast } = useToast()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    if (loading) {
        console.log("Loading")
        return
    }

    const handleLogout = async () => {
        setLoading(false)
        try {
            await axiosInstance.get("/auth/logout");
            localStorage.removeItem("session")
            router.push("/auth")
            setLoading(false)
        } catch (error: any) {
            console.log(error.response.data)
            setError(error.response.data)
            toast({
                title: "Something went wrong"
            })
            setLoading(false)
        }
    }


    return (
        <header className='h-[12%] border border-b-2 flex justify-between items-center px-12'>
            <button
                onClick={() => router.push("/")}
            >
                <Image src={Logo} alt='Logo.png' height={500} width={500} className='object-contain w-40 h-28 cursor-pointer' />
            </button>
            {show &&
                (!session ?
                    <div>
                        <Button className='cursor-pointer' onClick={() => router.push("/auth")} variant="default">Sign In</Button>
                    </div>
                    :
                    <div className='flex gap-x-3'>
                        <Button onClick={() => router.push("/create-trip")} className='rounded-full' variant="outline"><span className='text-xl'>+ &nbsp;</span>Create Trip</Button>
                        <Button onClick={() => router.push("/my-trips")} className='rounded-full' variant="outline">My Trips</Button>

                        <Avatar>
                            <AvatarFallback onClick={() => handleLogout()} className='bg-orange-600 text-white text-xl cursor-pointer'>{session?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                )
            }
        </header>
    )
}

export default Header