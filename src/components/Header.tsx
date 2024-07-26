"use client"

import React from 'react'
import Image from 'next/image'

import Logo from "@/assets/travel-ai-extended.png"
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useSession } from '@/context/authContext'
import { Avatar, AvatarFallback } from './ui/avatar'

const Header = ({ show = true }: { show?: boolean }) => {
    const router = useRouter()
    const { session, loading } = useSession();

    if (loading) {
        <div>Loading...</div>
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
                        <Button onClick={() => router.push("/auth")} variant="default">Sign In</Button>
                    </div>
                    :
                    <div className='flex gap-x-3'>
                        <Button onClick={() => router.push("/create-trip")} className='rounded-full' variant="outline"><span className='text-xl'>+ &nbsp;</span>Create Trip</Button>
                        <Button onClick={() => router.push("/my-trips")} className='rounded-full' variant="outline">My Trips</Button>

                        <Avatar>
                            <AvatarFallback className='bg-orange-600 text-white text-xl'>{session?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                )
            }
        </header>
    )
}

export default Header